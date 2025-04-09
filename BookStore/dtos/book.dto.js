class BookDTO {
  constructor({ title, description, price, stock, category, author, rating }) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.author = author;
    this.rating = rating;
  }
}

module.exports = BookDTO;
