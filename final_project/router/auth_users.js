const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });
    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
          data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
          accessToken,username
        }
        return res.status(200).send("User now logged in");
    } 
    else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (!review) {
      return res.status(400).json({ message: 'This book has no reviews.' });
    }

    // Check if the book already exists in the database
    if (!books[isbn]) {
        return res.status(404).json({ message: `Book not found.` });
    }
    // Check if the user already reviewed this book
    if (books[isbn].reviews[username]) {
        // If so, modify the existing review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: `Review modified!`});
    } else {
        // If not, add a new one
        books[isbn].reviews[username] = review;
        return res.status(201).json({ message: `New review submitted by ${username}` });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn
    const username = req.session.authorization.username

    const currentBook = books[isbn]
  
    if (!currentBook) {
      res.status(404).send("Book not found.")
      return
    }
    
    if (!currentBook.reviews[username]) {
      res.status(404).send("Can not delete. No reviews submited yet.")
      return
    }
    
    delete currentBook.reviews[username]
    res.send("Review properly deleted")
  })

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
