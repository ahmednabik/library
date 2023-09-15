const cover = document.getElementById("cover");
const title = document.getElementById("title");
const author = document.getElementById("author");
const genre = document.getElementById("genre");
const pages = document.getElementById("pages");
const status = document.getElementById("status");
const description = document.getElementById("description");
const formElement = document.querySelector("form");
const bookCard = document.getElementById("card-section");
const clearBtn = document.getElementById("clear-library");

storedItems = localStorage.getItem("lib");
if (storedItems) {
  library = JSON.parse(storedItems);
  librarySize = library.length;
  displayBooks();
} else {
  library = [];
  librarySize = 0;
  document.getElementById("card-section").innerHTML =
    "<div>No books found.</div>";
}

formElement.addEventListener("submit", addBook); //add book
clearBtn.addEventListener("click", clearLibrary); //delete library

function displayBooks() {
  bookCard.innerHTML = "";
  bookCard.innerHTML = library
    .map((book) => {
      return `<div class="max-w-2xl mx-auto">
    <div class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm dark:bg-gray-800 dark:border-gray-700">
        <div class="cover grid place-items-center"><img id="cover" class="transition-all duration-300 ease-in-out hover:scale-95 object-cover object-center w-80 h-80 rounded-t-lg" src="${book.cover}" alt=""></div>
        <div class="p-5">
            <h5 id="title" class="text-gray-900 font-bold text-2xl tracking-tight mb-2 dark:text-white">${book.title}</h5>
            <p id="description" class="font-normal text-gray-700 mb-3 dark:text-gray-400">${book.description}</p>
        </div>
        <div class="flex justify-around items-center  gap-4 text-xs mb-4">
            <div><span><strong>Author</strong> </span><p id="author">${book.author}</p></div>
            <div><span><strong>Pages</strong> </span><p id="pages">${book.pages}</p></div>
            <div><span><strong>Status</strong> </span><p id="status">${book.status}</p></div>
            <div><span><strong>Genre</strong> </span><p id="genre">${book.genre}</p></div>
            <div style="display:none"><span><strong>Genre</strong> </span><p id="index">${book.index}</p></div>
        </div>
        <div> <button onClick="removeBook(event)" data-index=${book.index} class="delete-book">X</button></div>
    </div>
</div>`;
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
