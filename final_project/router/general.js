const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  // if the username and password is provided
  if (username && password) {
    // check if the username is valid
    if (!isValid(isValid)) {
      return res.status(400).json({
        message: "Username isn't valid",
      });
    }

    // push username and password to users
    users.push({ username, password });

    return res.status(200).json({
      message: "Customer registered successfully. You can now login!",
    });
  } else {
    return res.status(400).json({
      message: "Username and password must be provided",
    });
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).json({ ...JSON.stringify(books, null, 2) });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const ISBN = req.params.isbn;

  return res.status(200).json({ ...books[ISBN] });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  // find the book by the author's name
  const allBooks = Object.values(books).filter(
    (book) => book.author === author
  );
  // if no book is found
  if (!allBooks) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json({
    booksByAuthor: allBooks,
  });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  // find the book by the title's name
  const allBooks = Object.values(books).filter((book) => book.title === title);

  // if no book is found
  if (!allBooks) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json({
    booksByTitle: allBooks,
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const ISBN = req.params.isbn;

  const book = books[ISBN];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json({
    ...book.reviews,
  });
});

module.exports.general = public_users;
