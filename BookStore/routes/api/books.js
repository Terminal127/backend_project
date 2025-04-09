// BookStore/routes/api/books.js
const express = require("express");
const router = express.Router();
const Book = require("../../models/Book");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");

// @route  GET api/books
// @desc   Get all book list with optional filters and pagination
// @access Public
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

// @route  GET api/books/:bookId
// @desc   Get a book
// @access Public
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

// @router  POST api/books
// @desc    Create Book
// @access  Private
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

// @route  PATCH api/books/:bookId
// @desc   Update a book
// @access Private
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

// @route  DELETE api/books/:bookId
// @desc   Delete a book
// @access Private
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
