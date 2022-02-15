let updateBtn = document.getElementById("updateBook");

updateBtn.addEventListener("click", updateBook);

function updateBook() {
  let bookId = updateBtn.dataset.id;
  let title = document.getElementById("edit_title").value;
  let author = document.getElementById("edit_author").value;
  let isbn = document.getElementById("edit_isbn").value;
  isbn = isbn.replace(/\D/g, "");

  let titleError = document.getElementById("edit_title_error");
  let authorError = document.getElementById("edit_author_error");
  let isbnError = document.getElementById("edit_isbn_error");

  titleError.textContent = "";
  document.getElementById("edit_title").style.borderColor = "#ced4da";
  authorError.textContent = "";
  document.getElementById("edit_author").style.borderColor = "#ced4da";
  isbnError.textContent = "";
  document.getElementById("edit_isbn").style.borderColor = "#ced4da";

  const endpoint = `/books/${bookId}`;

  async function updateData(url = "", data = {}) {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },

      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    return response.json(); // parses JSON response into native JavaScript objects
  }

  updateData(endpoint, {
    title: title.toLowerCase(),
    author: author.toLowerCase(),
    isbn,
  })
    .then((data) => {
      if (!data.success) {
        if (data.errors != undefined) {
          let errors = data.errors;
          errors.forEach((error) => {
            if (error.param === "title") {
              titleError.textContent = error.msg;
              document.getElementById("edit_title").style.borderColor = "#c00";
            }
            if (error.param === "author") {
              authorError.textContent = error.msg;
              document.getElementById("edit_author").style.borderColor = "#c00";
            }
            if (error.param === "isbn") {
              isbnError.textContent = error.msg;
              document.getElementById("edit_isbn").style.borderColor = "#c00";
            }
          });
        }
        if (data.isbn !== undefined) {
          isbnError.textContent = data.isbn;
          document.getElementById("edit_isbn").style.borderColor = "#c00";
        }
        return;
      }
      window.location.href = "/";
    })
    .catch((err) => console.log(err));
}
