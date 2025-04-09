const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const auth = require("../../middleware/auth");
const BookController = require("../../controllers/book.controller");

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
 *         name: title
 *         schema:
 *           type: string
 *         description: Title of the book (partial matches)
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
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by (e.g., title, price, rating)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: asc
 *         description: Sort order (ascending or descending)
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
router.get("/", BookController.getAllBooks);

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
router.get("/:bookId", BookController.getBookById);

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
  BookController.createBook,
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
router.patch("/:bookId", auth, BookController.updateBook);

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
router.delete("/:bookId", auth, BookController.deleteBook);

module.exports = router;
