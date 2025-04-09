# BookStore API

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Technologies](#technologies)
- [Setup Instructions](#setup-instructions)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Server](#running-the-server)
- [Docker Setup](#docker-setup)
  - [Building the Docker Image](#building-the-docker-image)
  - [Running the Docker Container](#running-the-docker-container)
- [API Documentation](#api-documentation)
  - [User Routes](#user-routes)
    - [Register a User](#register-a-user)
    - [Login a User](#login-a-user)
  - [Book Routes](#book-routes)
    - [Get All Books](#get-all-books)
    - [Get a Book by ID](#get-a-book-by-id)
    - [Create a Book](#create-a-book)
    - [Update a Book](#update-a-book)
    - [Delete a Book](#delete-a-book)
- [Testing](#testing)
  - [Running Tests](#running-tests)
  - [Test Files](#test-files)
- [Screenshots](#screenshots)
- [License](#license)

## Description

BookStore API is a RESTful web service for managing books and users in a bookstore. It allows users to register, login, and perform CRUD operations on books. The API also supports role-based access control, where only admin users can add, update, or delete books.

## Features

- User registration and authentication
- Role-based access control (admin and normal users)
- CRUD operations for books
- Purchase management
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
- Docker

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

### Environment Variables

Create a `default.json` file in the `config` directory with the following content:

```json
{
  "mongoURI": "your_mongodb_connection_string",
  "jwtSecret": "your_jwt_secret",
  "admin-signup-key": "your_admin_signup_key"
}
```

### Running the Server

Start the server:

```bash
npm start
```

The server will start on `http://localhost:3000`.

## Docker Setup

### Building the Docker Image

1. Ensure you have Docker installed on your machine.
2. Build the Docker image:

   ```bash
   docker build -t bookstore-api .
   ```

### Running the Docker Container

1. Run the Docker container:

   ```bash
   docker run -p 3000:3000 -d bookstore-api
   ```

2. The server will start on `http://localhost:3000`.

## API Documentation

The API documentation is available at `http://localhost:3000/api-docs`.

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
  - `title` (optional, partial matches)
  - `page` (optional, default: 1)
  - `limit` (optional, default: 10)
  - `sortBy` (optional, e.g., `price`)
  - `order` (optional, `asc` or `desc`)

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

## Screenshots

### User Registration

![User Registration](![image](https://github.com/user-attachments/assets/1ea5a76d-c681-46cc-bfe2-ecc04fdc1b30))

### User Login

![User Login](![image](https://github.com/user-attachments/assets/73ee55b4-2d82-410e-94c5-b97af81f48f1))

### Get All Books

![Get All Books](![image](https://github.com/user-attachments/assets/c7c83de0-dc02-4bbf-96c1-35d178bbcdc1))
![image](https://github.com/user-attachments/assets/32e3973e-d4cb-4250-83bf-de82345159fd)


### Create a Book

![Create a Book](![image](https://github.com/user-attachments/assets/efaa7a19-755b-4f06-965c-12ef82c3885f))

### Update a Book

![Update a Book](![image](https://github.com/user-attachments/assets/dd2aa87c-37ec-4a63-bad5-9e3f5e7c41cc))

### Delete a Book

![Delete a Book](![image](https://github.com/user-attachments/assets/dec04456-8fb6-412e-a599-246afb8beb7e))

### Filters
![Filters](![image](https://github.com/user-attachments/assets/f381c476-4c34-4035-b90a-a0453fc4a3b1))

## License

This project is licensed under the MIT License.
