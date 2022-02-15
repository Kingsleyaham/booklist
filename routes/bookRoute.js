const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const Book = require("../models/Book");
const ISBN = require("is-isbn");

const router = Router();
// add new book request to db

router.get("/", (req, res) => {
  Book.find()
    .then((result) => {
      res.render("index", { books: result });
    })
    .catch((err) => console.log(err));
});

router.post(
  "/books",
  [
    check("title")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Title must be more than 4 characters"),

    check("author")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Author name must be more than 3 characters"),

    check("isbn")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Invalid isbn number")
      .custom(async (isbn) => {
        const existingIsbn = await Book.findOne({ isbn });
        if (existingIsbn) {
          throw new Error("Isbn already exist");
        }
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ success: false, ...errors });
    }
    if (!ISBN.validate(req.body.isbn)) {
      return res.json({ success: false, isbn: "Invalid isbn number" });
    }

    const book = new Book(req.body);

    book
      .save()
      .then((result) => {
        res.json({ success: true });
      })
      .catch((err) => {
        console.log(err);
      });
    //   res.send(req.body);
  }
);

// delete a book by id
router.delete("/books/:id", (req, res) => {
  const id = req.params.id;

  Book.findByIdAndDelete(id)
    .then((result) => res.json({ redirect: "/" }))
    .catch((err) => console.log(err));
});

// fetch book by id
router.get("/books/:id", (req, res) => {
  const id = req.params.id;

  Book.findById(id)
    .then((result) => res.json(result))
    .catch((err) => console.log(err));
});

// update existing book
router.put(
  "/books/:id",
  [
    check("title")
      .trim()
      .isLength({ min: 4 })
      .withMessage("Title must be more than 4 characters"),

    check("author")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Author name must be more than 3 characters"),

    check("isbn")
      .trim()
      .isLength({ min: 10 })
      .withMessage("Invalid isbn number"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.json({ success: false, ...errors });
    }

    if (!ISBN.validate(req.body.isbn)) {
      return res.json({ success: false, isbn: "Invalid isbn number" });
    }

    const id = req.params.id;
    const isbn = req.body.isbn;

    Book.find({ isbn: isbn })
      .then((data) => {
        let dataId = data.length === 0 ? id : data[0]._id;

        if ((data.length <= 1 && dataId == id) || data.length === 0) {
          Book.findByIdAndUpdate(id, { ...req.body })
            .then((result) => {
              return res.json({ success: true });
            })
            .catch((err) => console.log(err));
        } else {
          return res.json({ success: false, isbn: "Isbn already exist" });
        }
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
