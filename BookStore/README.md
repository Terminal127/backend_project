# BookStore API

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [License](#license)

## Description

BookStore API is a RESTful web service for managing books and users in a bookstore. It allows users to register, login, and perform CRUD operations on books. The API also supports role-based access control, where only admin users can add, update, or delete books.

## Features

- User registration and authentication
- Role-based access control (admin and normal users)
- CRUD operations for books
- Swagger/OpenAPI documentation
- Unit and integration tests

## Technologies

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcrypt.js
- Swagger
- Mocha
- Chai
- Chai-HTTP

## Setup Instructions

### Prerequisites

- Node.js (v12 or higher)
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/bookstore.git
   cd bookstore
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   Create a `default.json` file in the `config` directory with the following content:

   ```json
   {
     "mongoURI": "your_mongodb_connection_string",
     "jwtSecret": "your_jwt_secret",
     "admin-signup-key": "your_admin_signup_key"
   }
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`.

### API Documentation

The API documentation is available at `http://localhost:3000/api-docs`.

## API Documentation

### User Routes

#### Register a User

- **URL:** `/api/users/register`
- **Method:** `POST`
- **Request Body:**

  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password1234"
  }
  ```

- **Response:**

  ```json
  {
    "token": "jwt_token"
  }
  ```

#### Login a User

- **URL:** `/api/users/login`
- **Method:** `POST`
- **Request Body:**

  ```json
  {
    "email": "john.doe@example.com",
    "password": "password1234"
  }
  ```

- **Response:**

  ```json
  {
    "token": "jwt_token"
  }
  ```

### Book Routes

#### Get All Books

- **URL:** `/api/books`
- **Method:** `GET`
- **Query Parameters:**
  - `category` (optional)
  - `author` (optional)
  - `rating` (optional)
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10)

- **Response:**

  ```json
  {
    "books": [
      {
        "title": "Malgudi Days",
        "description": "A collection of short stories",
        "price": 500,
        "stock": 100,
        "category": "Fiction",
        "author": "R.K. Narayan",
        "rating": 4.5
      }
    ],
    "totalPages": 1,
    "currentPage": 1
  }
  ```

#### Get a Book by ID

- **URL:** `/api/books/{bookId}`
- **Method:** `GET`
- **Response:**

  ```json
  {
    "title": "Malgudi Days",
    "description": "A collection of short stories",
    "price": 500,
    "stock": 100,
    "category": "Fiction",
    "author": "R.K. Narayan",
    "rating": 4.5
  }
  ```

#### Create a Book

- **URL:** `/api/books`
- **Method:** `POST`
- **Headers:**
  - `x-auth-token`: `jwt_token`
- **Request Body:**

  ```json
  {
    "title": "Malgudi Days",
    "description": "A collection of short stories",
    "price": 500,
    "stock": 100,
    "category": "Fiction",
    "author": "R.K. Narayan",
    "rating": 4.5
  }
  ```

- **Response:**

  ```json
  {
    "newBook": {
      "title": "Malgudi Days",
      "description": "A collection of short stories",
      "price": 500,
      "stock": 100,
      "category": "Fiction",
      "author": "R.K. Narayan",
      "rating": 4.5
    }
  }
  ```

#### Update a Book

- **URL:** `/api/books/{bookId}`
- **Method:** `PATCH`
- **Headers:**
  - `x-auth-token`: `jwt_token`
- **Request Body:**

  ```json
  {
    "price": 600
  }
  ```

- **Response:**

  ```json
  {
    "message": "Successfully updated the book"
  }
  ```

#### Delete a Book

- **URL:** `/api/books/{bookId}`
- **Method:** `DELETE`
- **Headers:**
  - `x-auth-token`: `jwt_token`
- **Response:**

  ```json
  {
    "message": "Successfully deleted the book"
  }
  ```

## Testing

### Running Tests

1. Install development dependencies:

   ```bash
   npm install --save-dev mocha chai chai-http
   ```

2. Run the tests:

   ```bash
   npm test
   ```

### Test Files

- **User Tests:** `BookStore/test/user.js`
- **Book Tests:** `BookStore/test/book.js`

## License

This project is licensed under the MIT License.
