const Book = require("../models/Book");

class BookService {
  async getAllBooks(filter, page, limit, sort) {
    const books = await Book.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const totalBooks = await Book.countDocuments(filter);

    return {
      books,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: parseInt(page),
    };
  }

  async getBookById(bookId) {
    return await Book.findById(bookId);
  }

  async createBook(bookData) {
    const newBook = new Book(bookData);
    return await newBook.save();
  }

  async updateBook(bookId, updateData) {
    return await Book.findByIdAndUpdate(
      bookId,
      { $set: updateData },
      { new: true },
    );
  }

  async deleteBook(bookId) {
    return await Book.findByIdAndDelete(bookId);
  }
}

module.exports = new BookService();
