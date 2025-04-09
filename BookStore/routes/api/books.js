const express = require("express");
const router = express.Router();
const Book = require("../../models/Book");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - title
 *         - price
 *         - stock
 *         - category
 *         - author
 *         - rating
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the book
 *         description:
 *           type: string
 *           description: The description of the book
 *         price:
 *           type: number
 *           description: The price of the book
 *         stock:
 *           type: number
 *           description: The stock of the book
 *         category:
 *           type: string
 *           description: The category of the book
 *         author:
 *           type: string
 *           description: The author of the book
 *         rating:
 *           type: number
 *           description: The rating of the book
 *       example:
 *         title: "Malgudi Days"
 *         description: "A collection of short stories"
 *         price: 500
 *         stock: 100
 *         category: "Fiction"
 *         author: "R.K. Narayan"
 *         rating: 4.5
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category of the book
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Author of the book
 *       - in: query
 *         name: rating
 *         schema:
 *           type: number
 *         description: Minimum rating of the book
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of books per page
 *     responses:
 *       200:
 *         description: The list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.get("/", async (req, res) => {
  try {
    const { category, author, rating, page = 1, limit = 10 } = req.query;
    let filter = { stock: { $gt: 0 } };

    if (category) filter.category = category;
    if (author) filter.author = author;
    if (rating) filter.rating = { $gte: rating };

    const books = await Book.find(filter)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const totalBooks = await Book.countDocuments(filter);

    res.status(200).json({
      books,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @swagger
 * /api/books/{bookId}:
 *   get:
 *     summary: Get a book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The book description by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: Book not found
 */
router.get("/:bookId", async (req, res) => {
  try {
    let bookId = req.params.bookId;
    const book = await Book.findById(bookId);
    if (!book) {
      return res
        .status(400)
        .json({ errors: [{ message: "Could not find a book by this id" }] });
    }
    res.status(200).json(book);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @swagger
 * /api/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Book already exists
 */
router.post(
  "/",
  auth,
  [
    check("title", "Title must be between 2 to 100 characters ").isLength({
      min: 2,
      max: 100,
    }),
    check("description").isLength({ max: 500 }).optional(),
    check("price", "Price not included or invalid price given").isFloat({
      min: 0.0,
    }),
    check("category", "Category is required").not().isEmpty(),
    check("author", "Author is required").not().isEmpty(),
    check("rating", "Rating must be between 0 and 5").isFloat({
      min: 0,
      max: 5,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }

    const { title, description, price, stock, category, author, rating } =
      req.body;

    try {
      let book = await Book.findOne({ title });

      if (book) {
        return res
          .status(400)
          .json({ errors: [{ message: "Book already exists" }] });
      }

      const isAdmin = await User.findById(req.user.id).select("-password");

      if (isAdmin.role === 0) {
        return res
          .status(400)
          .json({ errors: [{ message: "Only admin can add books" }] });
      }

      newBook = new Book({
        title,
        description: description ? description : null,
        price,
        stock,
        category,
        author,
        rating,
      });
      await newBook.save();

      res.status(200).json({
        newBook,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
);

/**
 * @swagger
 * /api/books/{bookId}:
 *   patch:
 *     summary: Update a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully updated
 *       400:
 *         description: Only admin can update books
 *       500:
 *         description: Server error
 */
router.patch("/:bookId", auth, async (req, res) => {
  try {
    let bookId = req.params.bookId;
    const book = await Book.findById(bookId).select("-stock");
    if (!book) {
      return res
        .status(400)
        .json({ errors: [{ message: "Could not find a book by this id" }] });
    }

    const isAdmin = await User.findById(req.user.id).select("-password");

    if (isAdmin.role === 0) {
      return res
        .status(400)
        .json({ errors: [{ message: "Only admin can add books" }] });
    }
    const updateOptions = req.body;
    await book.updateOne({ $set: updateOptions });

    res.status(200).json({ message: "Successfully updated the book" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

/**
 * @swagger
 * /api/books/{bookId}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: string
 *         required: true
 *         description: The book ID
 *     responses:
 *       200:
 *         description: The book was successfully deleted
 *       400:
 *         description: Only admin can delete books
 *       500:
 *         description: Server error
 */
router.delete("/:bookId", auth, async (req, res) => {
  try {
    let bookId = req.params.bookId;
    const book = await Book.findById(bookId).select("-stock");
    if (!book) {
      return res
        .status(400)
        .json({ errors: [{ message: "Could not find a book by this id" }] });
    }

    const isAdmin = await User.findById(req.user.id).select("-password");

    if (isAdmin.role === 0) {
      return res
        .status(400)
        .json({ errors: [{ message: "Only admin can delete a books" }] });
    }

    await book.deleteOne();

    res.status(200).json({ message: "Successfully deleted the book" });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
