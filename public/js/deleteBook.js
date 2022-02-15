function deleteBook(btn, bookId) {
  btn.disabled = true;

  const endpoint = `/books/${bookId}`;

  async function deleteData(url = "") {
    const response = await fetch(url, {
      method: "DELETE",
    });

    return response.json(); // parses JSON response into native JavaScript objects
  }

  deleteData(endpoint)
    .then((data) => (window.location.href = data.redirect))
    .catch((err) => console.log(err));
}
