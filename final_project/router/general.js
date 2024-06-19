const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    isbn = req.params.isbn
    if(books.hasOwnProperty(isbn)){
    res.send(JSON.stringify(books[isbn]))
    } else {
    return res.status(300).json({message: "ISBN not found"})
    }
})
 
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author
    let validAuthor = Object.values(books).filter(book => book.author === author);
    console.log(validAuthor)
    if(validAuthor){
    res.send(JSON.stringify(validAuthor))
    } else {
    return res.status(300).json({message: "Author not found. Try again"});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title
    let validTitle = Object.values(books).filter(book => book.title === title);
    console.log(validTitle)
    if(validTitle){
    res.send(JSON.stringify(validTitle))
    } else {
    return res.status(300).json({message: "Title not found. Try again"});
    }
});

//  Get book review
public_users.get('/reviews/:isbn',function (req, res) {
    let isbn = req.params.isbn
    console.log(isbn)
    if(books.hasOwnProperty(isbn)){
    res.send(JSON.stringify(books[isbn].reviews))
    } else {
    return res.status(300).json({message: "ISBN not found"})
    }
});

module.exports.general = public_users;
