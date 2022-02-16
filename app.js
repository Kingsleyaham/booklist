const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv").config();
const bookRoute = require("./routes/bookRoute");
// express app
const app = express();

if (process.env.NODE_ENV === "production") {
  const dbUsername = process.env.DB_USERNAME;
  const dbPwd = process.env.DB_PASSWORD;

  const dURI = `mongodb+srv://kingsley:08133456114fb@cluster0.kwd9e.mongodb.net/booklist?retryWrites=true&w=majority`;
}
if (process.env.NODE_ENV == "development") {
  const dURI = "mongodb://localhost:27017/booklist";
}

const port = process.env.PORT || 3000;

mongoose
  .connect(dURI)
  .then((result) =>
    app.listen(port, () => {
      console.log(`server running at http://localhost:3000`);
    })
  )
  .catch((err) => console.log(err));

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
