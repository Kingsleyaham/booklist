let submitBtn = document.getElementById("addSubmit");
submitBtn.addEventListener("click", addNewBook);

function addNewBook() {
  submitBtn.disabled = true;
  let title = document.getElementById("title").value;
  let author = document.getElementById("author").value;
  let isbn = document.getElementById("isbn").value;
  isbn = isbn.replace(/\D/g, "");

  let titleError = document.getElementById("title_error");
  let authorError = document.getElementById("author_error");
  let isbnError = document.getElementById("isbn_error");

  titleError.textContent = "";
  document.getElementById("title").style.borderColor = "#ced4da";
  authorError.textContent = "";
  document.getElementById("author").style.borderColor = "#ced4da";
  isbnError.textContent = "";
  document.getElementById("isbn").style.borderColor = "#ced4da";

  async function postData(url = "", data = {}) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },

      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    return response.json(); // parses JSON response into native JavaScript objects
  }

  postData("/books", {
    title: title.toLowerCase(),
    author: author.toLowerCase(),
    isbn,
  })
    .then((data) => {
      submitBtn.disabled = false;

      if (!data.success) {
        if (data.errors != undefined) {
          let errors = data.errors;

          errors.forEach((error) => {
            if (error.param === "title") {
              titleError.textContent = error.msg;
              document.getElementById("title").style.borderColor = "#c00";
            }
            if (error.param === "author") {
              authorError.textContent = error.msg;
              document.getElementById("author").style.borderColor = "#c00";
            }
            if (error.param === "isbn") {
              isbnError.textContent = error.msg;
              document.getElementById("isbn").style.borderColor = "#c00";
            }
          });
        }

        if (data.isbn !== undefined) {
          isbnError.textContent = data.isbn;
          document.getElementById("isbn").style.borderColor = "#c00";
        }
        return;
      }

      window.location.href = "/";
    })
    .catch((err) => console.log(err));
}
