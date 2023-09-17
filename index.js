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
  displayBooks();
} else {
  library = [];
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
            <div id="card" class="card">
                <div class="cover">
                    <div style="background-image: url(${
                      book.cover
                    });" class="cover-image"></div>
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
                    <p class="page-numbers"><strong>Pages:</strong> ${
                      book.pages
                    }</p>
                    <button id="remove" class="btn remove">Remove</button>
                    <button id="mark" class="btn mark">${
                      book.status ? "✓ Read" : "Mark Read"
                    }</button>
                </div>
            </div>
      `;
    })
    .join("");
  const readStatusBtn = document.querySelectorAll(".mark");
  if (readStatusBtn) {
    readStatusBtn.forEach((btn) => {
      btn.addEventListener("click", changeReadStatus);
    });
  }

  const removeBtn = document.querySelectorAll(".remove");
  if (removeBtn) {
    removeBtn.forEach((btn) => {
      btn.addEventListener("click", removeBook);
    });
  }
}

async function addBook(event) {
  event.preventDefault();

  const title = document.getElementById("title-input").value;
  const coverImageUrl = await getCoverImage(title);

  let newBook = {
    title: title,
    author: document.getElementById("author-input").value,
    cover: coverImageUrl,
    description: document.getElementById("description-input").value,
    genre: document.getElementById("genre-input").value,
    pages: document.getElementById("pages-input").value,
    status: document.getElementById("status-input").value === "true",
  };

  library.push(newBook);
  localStorage.setItem("lib", JSON.stringify(library));
  addBookModal.close();
  displayBooks();
}

function removeBook(event) {
  const parentCard = event.target.closest(".card");
  if (parentCard) {
    const title = parentCard.querySelector(".title").textContent;
    const index = library.findIndex((book) => book.title === title);
    library.splice(index, 1); //remove book and update library array
  }
  localStorage.setItem("lib", JSON.stringify(library)); //update local storage
  displayBooks(); //force re-render
}

function changeReadStatus(e) {
  const parentCard = e.target.closest(".card");
  if (parentCard) {
    const title = parentCard.querySelector(".title").textContent;
    const index = library.findIndex((book) => book.title === title);
    library[index].status = !library[index].status; //toggle status
    localStorage.setItem("lib", JSON.stringify(library)); //update local storage
    displayBooks(); //force re-render
  }
}

function clearLibrary() {
  localStorage.clear();
  bookCard.innerHTML = "<div>Library items cleared.</div>";
}

function getCoverImage(title) {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${title}`)
    .then((response) => response.json())
    .then((data) => {
      if (
        data.items &&
        data.items.length > 0 &&
        data.items[0].volumeInfo &&
        data.items[0].volumeInfo.imageLinks
      ) {
        return data.items[0].volumeInfo.imageLinks.thumbnail;
      } else {
        throw new Error("Cover image not found");
      }
    })
    .catch((error) => {
      console.error("Error fetching cover image:", error);
      return "./imgs/book.jpg";
    });
}
