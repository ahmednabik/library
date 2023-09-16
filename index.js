const cover = document.getElementById("cover");
const title = document.getElementById("title");
const author = document.getElementById("author");
const genre = document.getElementById("genre");
const pages = document.getElementById("pages");
const status = document.getElementById("status");
const description = document.getElementById("description");
const formElement = document.querySelector("form");
const bookCard = document.getElementById("book-shelf");
const clearBtn = document.getElementById("clear-library");
const addBookModal = document.getElementById("add-book-modal");
const addBookBtn = document.getElementById("add-book");
const closeModalBtn = document.getElementById("cancel-button");

addBookBtn.addEventListener("click", () => {
  addBookModal.showModal();
});

closeModalBtn.addEventListener("click", () => {
  addBookModal.close();
});

storedItems = localStorage.getItem("lib");

if (storedItems) {
  library = JSON.parse(storedItems);
  librarySize = library.length;
  displayBooks();
} else {
  library = [];
  librarySize = 0;
  document.getElementById(
    "book-shelf"
  ).innerHTML = `<div style="padding-top:50px">No books found.</div>`;
}
formElement.addEventListener("submit", addBook); //add book
clearBtn.addEventListener("click", clearLibrary); //delete library

function displayBooks() {
  bookCard.innerHTML = "";
  bookCard.innerHTML = library
    .map((book) => {
      return `
            <div class="card">
                <div class="cover">
                    <div style="background-image: url(${book.cover});" class="cover-image"></div>
                </div>
                <div class="info">
                    <p class="title">${book.title}</p>
                    <p class="author">By: ${book.author}</p>
                    <div class="description">
                        <p>
                        ${book.description}
                        </p>
                    </div>
                    <p class="genre"><strong>Genre:</strong> ${book.genre}</p>
                    <p class="page-numbers"><strong>Pages:</strong> ${book.pages}</p>
                    <button class="btn remove">Remove</button>
                    <button class="btn mark">Mark Read</button>
                </div>
            </div>
      `;
    })
    .join("");
}

function addBook(event) {
  event.preventDefault();
  let newBook = {
    title: document.getElementById("title-input").value,
    author: document.getElementById("author-input").value,
    cover: "/imgs/book.jpg",
    description: document.getElementById("description-input").value,
    genre: document.getElementById("genre-input").value,
    pages: document.getElementById("pages-input").value,
    status: document.getElementById("status-input").value,
    index: librarySize,
  };

  library.push(newBook);
  librarySize += 1;
  localStorage.setItem("lib", JSON.stringify(library));
  displayBooks();
}

function clearLibrary() {
  localStorage.clear();
  bookCard.innerHTML = "<div>Library items cleared.</div>";
}

function removeBook(event) {
  let itemIndex = event.target.getAttribute("data-index");
  library.splice(itemIndex, 1);
  localStorage.setItem("lib", JSON.stringify(library));
  displayBooks();
}

// currently the data-index is hardcoded and when lower index items are deleted,
//the array length reduces below the remaining index items and the removeBook functions fail to execute.
//Need to find a way to update the data-index dynamically after each removeBook execution
//i am in the refactored branch now
