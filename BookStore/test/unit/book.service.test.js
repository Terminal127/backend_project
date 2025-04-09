const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

const BookService = require("../../services/book.service");
const Book = require("../../models/Book");

describe("BookService", () => {
  describe("getAllBooks", () => {
    it("should return all books with the given filter", async () => {
      const mockBooks = [
        { title: "Book 1", price: 100 },
        { title: "Book 2", price: 200 },
      ];

      const findStub = sinon.stub(Book, "find").returns({
        limit: sinon.stub().returnsThis(),
        skip: sinon.stub().returnsThis(),
        sort: sinon.stub().returnsThis(),
        exec: sinon.stub().resolves(mockBooks),
      });

      const countStub = sinon.stub(Book, "countDocuments").resolves(2);

      const result = await BookService.getAllBooks({}, 1, 10, {});

      expect(result.books).to.deep.equal(mockBooks);
      expect(result.totalPages).to.equal(1);
      expect(result.currentPage).to.equal(1);

      findStub.restore();
      countStub.restore();
    });
  });

  describe("getBookById", () => {
    it("should return the book with the given ID", async () => {
      const mockBook = { title: "Book 1", price: 100 };

      const findByIdStub = sinon.stub(Book, "findById").resolves(mockBook);

      const result = await BookService.getBookById("bookId");

      expect(result).to.deep.equal(mockBook);

      findByIdStub.restore();
    });
  });

  describe("createBook", () => {
    it("should create a new book", async () => {
      const mockBookData = {
        title: "Book 1",
        price: 100,
        rating: 4.5,
        author: "Author 1",
        category: "Fiction",
        stock: 10,
      };
      const mockBook = new Book(mockBookData);

      const saveStub = sinon.stub(mockBook, "save").resolves(mockBook);

      const result = await BookService.createBook(mockBookData);

      expect(result).to.deep.equal(mockBook);

      saveStub.restore();
    });
  });

  describe("updateBook", () => {
    it("should update the book with the given ID", async () => {
      const mockBookData = { title: "Updated Book", price: 150 };
      const mockBook = { title: "Book 1", price: 100 };

      const findByIdAndUpdateStub = sinon
        .stub(Book, "findByIdAndUpdate")
        .resolves(mockBook);

      const result = await BookService.updateBook("bookId", mockBookData);

      expect(result).to.deep.equal(mockBook);

      findByIdAndUpdateStub.restore();
    });
  });

  describe("deleteBook", () => {
    it("should delete the book with the given ID", async () => {
      const mockBook = { title: "Book 1", price: 100 };

      const findByIdAndDeleteStub = sinon
        .stub(Book, "findByIdAndDelete")
        .resolves(mockBook);

      const result = await BookService.deleteBook("bookId");

      expect(result).to.deep.equal(mockBook);

      findByIdAndDeleteStub.restore();
    });
  });
});
