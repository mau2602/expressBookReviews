const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
       
    const username = req.body.username;
    const password = req.body.password; 

    const doesExist = (username)=>{
        let userswithsamename = users.filter((user)=>{
          return user.username === username
        });
        if(userswithsamename.length > 0){
          return true;
        } else {
          return false;
        }
      }

    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
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
    if(validAuthor.length > 0){
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
    if(validTitle.length > 0){
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

