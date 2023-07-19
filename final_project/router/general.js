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
  return res.status(200).json({ books });
});

// TASK 10: available books
public_users.get("/books", async function (req, res) {
  return await new Promise((resolve, reject) => {
    resolve(res.status(200).json({ books }));
  }).then((result) => {
    console.log("Task 10 promise resolved");
  });
});

// TASK 11: book details via ISBN
public_users.get("books/isbn/:isbn", async function (req, res) {
  const callback = new Promise((resolve, reject) => {
    const ISBN = req.params.isbn;
    resolve(res.status(200).json({ ...books[ISBN] }));
  });

  return await callback.then((result) => {
    console.log("Task 11 promise resolved");
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const ISBN = req.params.isbn;

  return res.status(200).json({ ...books[ISBN] });
});

// TASK 12: book details via author
public_users.get("/books/author/:author", async function (req, res) {
  return await new Promise((resolve, reject) => {
    const author = req.params.author;

    // find the book by the author's name
    const allBooks = Object.values(books).filter(
      (book) => book.author === author
    );

    // if no book is found
    if (!allBooks) {
      reject(res.status(404).json({ message: "Book not found" }));
    }

    resolve(res.status(200).json({ booksByAuthor: allBooks }));
  }).then((result) => {
    console.log("Task 12 promise resolved");
  });
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

// TASK 13: book details via title
public_users.get("/books/title/:title", async function (req, res) {
  return await new Promise((resolve, reject) => {
    const title = req.params.title;

    // find the book by the title's name
    const allBooks = Object.values(books).filter(
      (book) => book.title === title
    );

    // if no book is found
    if (!allBooks) {
      reject(res.status(404).json({ message: "Book not found" }));
    }

    resolve(res.status(200).json({ booksByTitle: allBooks }));
  }).then((result) => {
    console.log("Task 13 promise resolved");
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
