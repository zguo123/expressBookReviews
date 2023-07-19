const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return !users.find((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.find(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).json({
      message: "Username and password must be provided",
    });
  }

  // authenticate
  const user = authenticatedUser(username, password);

  if (!user) {
    return res.status(404).json({
      message: "Invalid Login. Check username and password",
    });
  }

  // otherwise ... generate token
  const accessToken = jwt.sign({ data: user.password }, "access", {
    expiresIn: 60 * 60,
  });

  req.session.authorization = {
    accessToken,
    username,
  };

  return res.status(200).send("Customer logged in successfully");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // get username from session
  const username = req.session.authorization["username"];

  const ISBN = req.params.isbn;

  // review from query
  const review = req.query.review;

  // find book by ISBN
  const book = books[ISBN];

  // if book is not found
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // if review is not provided
  if (!review) {
    return res.status(400).json({ message: "Review not provided" });
  }

  // add review to the book
  book.reviews[username] = review;

  return res
    .status(200)
    .send(`Review added successfully to book with ISBN ${ISBN}`);
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  // get username from session
  const username = req.session.authorization["username"];

  const ISBN = req.params.isbn;

  // book
  const book = books[ISBN];

  // if book is not found
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // check if review can be found
  if (!book.reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  // delete review
  delete book.reviews[username];

  return res
    .status(200)
    .send(`Review deleted successfully from book with ISBN ${ISBN}`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
