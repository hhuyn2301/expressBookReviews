const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Đăng ký tài khoản mới
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Task 1 & 10: Lấy danh sách toàn bộ sách (Async/Await + Promise)
public_users.get('/', async function (req, res) {
    try {
        const getBooks = () => new Promise((resolve) => resolve(books));
        const allBooks = await getBooks();
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error retrieving books" });
    }
});

// Task 2 & 11: Tìm sách theo ISBN (Promise)
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });

    getBookByISBN
        .then((book) => res.status(200).json(book))
        .catch((err) => res.status(404).json({ message: err }));
});

// Task 3 & 12: Tìm sách theo tác giả (Async/Await + Promise)
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = () => new Promise((resolve, reject) => {
            let matchingBooks = Object.values(books).filter((b) => b.author === author);
            if (matchingBooks.length > 0) resolve(matchingBooks);
            else reject("No books found for this author");
        });
        const result = await getBooksByAuthor();
        return res.status(200).json({ booksbyauthor: result });
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});

// Task 4 & 13: Tìm sách theo tiêu đề (Async/Await + Promise)
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = () => new Promise((resolve, reject) => {
            let matchingBooks = Object.values(books).filter((b) => b.title === title);
            if (matchingBooks.length > 0) resolve(matchingBooks);
            else reject("No books found with this title");
        });
        const result = await getBooksByTitle();
        return res.status(200).json({ booksbytitle: result });
    } catch (err) {
        return res.status(404).json({ message: err });
    }
});

// Task 5: Lấy đánh giá sách theo ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;