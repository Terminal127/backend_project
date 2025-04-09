const { validationResult } = require("express-validator");
const BookService = require("../services/book.service");
const BookDTO = require("../dtos/book.dto");
const User = require("../models/User");

class BookController {
  async getAllBooks(req, res) {
    try {
      const {
        category,
        author,
        rating,
        title,
        page = 1,
        limit = 10,
        sortBy,
        order,
      } = req.query;
      let filter = { stock: { $gt: 0 } };

      if (category) filter.category = category;
      if (author) filter.author = author;
      if (rating) filter.rating = { $gte: rating };
      if (title) filter.title = { $regex: title, $options: "i" };

      let sort = {};
      if (sortBy) {
        sort[sortBy] = order === "desc" ? -1 : 1;
      }

      const result = await BookService.getAllBooks(filter, page, limit, sort);
      res.status(200).json(result);
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }

  async getBookById(req, res) {
    try {
      const book = await BookService.getBookById(req.params.bookId);
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
  }

  async createBook(req, res) {
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

      const bookDTO = new BookDTO({
        title,
        description,
        price,
        stock,
        category,
        author,
        rating,
      });
      const newBook = await BookService.createBook(bookDTO);

      res.status(200).json({ newBook });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }

  async updateBook(req, res) {
    try {
      const book = await BookService.getBookById(req.params.bookId);
      if (!book) {
        return res
          .status(400)
          .json({ errors: [{ message: "Could not find a book by this id" }] });
      }

      const isAdmin = await User.findById(req.user.id).select("-password");

      if (isAdmin.role === 0) {
        return res
          .status(400)
          .json({ errors: [{ message: "Only admin can update books" }] });
      }

      const updatedBook = await BookService.updateBook(
        req.params.bookId,
        req.body,
      );
      res
        .status(200)
        .json({ message: "Successfully updated the book", updatedBook });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }

  async deleteBook(req, res) {
    try {
      const book = await BookService.getBookById(req.params.bookId);
      if (!book) {
        return res
          .status(400)
          .json({ errors: [{ message: "Could not find a book by this id" }] });
      }

      const isAdmin = await User.findById(req.user.id).select("-password");

      if (isAdmin.role === 0) {
        return res
          .status(400)
          .json({ errors: [{ message: "Only admin can delete books" }] });
      }

      await BookService.deleteBook(req.params.bookId);
      res.status(200).json({ message: "Successfully deleted the book" });
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  }
}

module.exports = new BookController();
