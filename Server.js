// Compatible with Mongoose v7+
var express = require("express");
const cors = require("cors");

let Books = require('./BooksSchema');
const connectDB = require('./MongoDBConnect');

var app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

console.log("Backend Server Starting...");

app.get('/', function (req, res) {
    res.send("Backend server is running.");
});

// ----------------------
// GET ALL BOOKS
// ----------------------
app.get('/allbooks', async (req, res) => {
    const data = await Books.find();
    return res.json(data);
});

// ----------------------
// GET A SINGLE BOOK BY ID
// ----------------------
app.get('/getbook/:id', async (req, res) => {
    let id = req.params.id;
    let book = await Books.findById(id);

    if (book) {
        return res.json(book);
    } else {
        return res.status(404).json({ error: "Book not found" });
    }
});

// ----------------------
// ADD A NEW BOOK
// ----------------------
app.post('/addbooks', function (req, res) {
    let newbook = new Books(req.body);

    newbook.save()
        .then(() => {
            res.status(200).json({ message: 'Book added successfully' });
        })
        .catch(err => {
            res.status(400).send('Adding new book failed');
        });
});

// ----------------------
// UPDATE EXISTING BOOK
// ----------------------
app.post('/updatebook/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const update = {
            booktitle: req.body.booktitle,
            PubYear: req.body.PubYear,
            author: req.body.author,
            Topic: req.body.Topic,
            formate: req.body.formate
        };

        const updatedBook = await Books.findByIdAndUpdate(
            id,
            { $set: update },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        return res.status(200).json({
            message: 'Book updated successfully',
            book: updatedBook
        });
    } catch (err) {
        return res.status(500).json({
            error: 'Failed to update book',
            details: err.message
        });
    }
});

// ----------------------
// DELETE A BOOK
// ----------------------
app.post('/deleteBook/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const deletedBook = await Books.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }

        res.status(200).send('Book Deleted');
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete book', details: err.message });
    }
});

// Start server after DB connects
(async () => {
    await connectDB();
    app.listen(5000, () => console.log('✅ Server running on port 5000'));
})();
