const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const bookRoute = require("./routes/bookRoute");
// express app
const app = express();

// const dURI = "mongodb://localhost:27017/booklist";
const dURI =
  "mongodb+srv://kingsley:08133456114fb@cluster0.kwd9e.mongodb.net/booklist?retryWrites=true&w=majority";

mongoose
  .connect(dURI)
  .then((result) =>
    app.listen(port, host, () => {
      console.log(`server running at http://${host}:${port}`);
    })
  )
  .catch((err) => console.log(err));

// set up PORT AND HOST
const port = process.env.PORT || 3000;
const host = process.env.HOST || "locahost";

// set template engine to use
app.set("view engine", "ejs");

// middlewares and static files
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"));
app.use(express.static("public"));

app.use(bodyParser.json());

//book routes routes
app.use(bookRoute);

// 404 page
app.use((req, res) => {
  res.render("404", {
    title: "Not Found",
  });
});
