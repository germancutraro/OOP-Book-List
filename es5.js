// Book Constructor
function Book (title, author, isbn) {
  this.title = title;
  this.author = author;
  this.isbn = isbn;
}
// UI
const title = document.getElementById('title'),
        author = document.getElementById('author'),
        isbn = document.getElementById('isbn');
const alertWrapper = document.getElementById('output'),
      alertMessage = document.querySelector('.message');

// UI Constructor
function UI () {}
UI.prototype.addBookToList = function (book) {
  const list = document.getElementById('book-list');
  // create tr
  const row = document.createElement('tr');
  // Insert cols
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete">X</a></td>
  `;
  list.appendChild(row);
}

UI.prototype.clearFields = function () {
  title.value = '';
  author.value = '';
  isbn.value = '';
}

UI.prototype.showAlert = function (message, className) {
  let classes = [className, 'show'];
  alertWrapper.classList.add(...classes);
  alertMessage.innerText = message;
  setTimeout(() => {
    alertWrapper.classList = '';
    alertWrapper.classList.add('output');
  }, 2500);
}

UI.prototype.deleteBook = function (target) {
  target.className === 'delete' ? target.parentElement.parentElement.remove() : false;
}


function Store () { }

Store.prototype.getBooks = function () {
  let books;
  localStorage.getItem('books') === null ? books = [] : books = JSON.parse(localStorage.getItem('books'));
  return books;  
};

Store.prototype.displayBooks = function () {
  const books = this.getBooks();
  // create ui instance
  const ui = new UI();
  books.map(book => ui.addBookToList(book));
};

Store.prototype.saveBook = function (book) {
  const books = this.getBooks();
  books.push(book);
  localStorage.setItem('books', JSON.stringify(books));
};

Store.prototype.removeBook = function (isbn) {
  const books = this.getBooks();
  books.map((book, i) => book.isbn === isbn ? books.splice(i, 1) : false);
  localStorage.setItem('books', JSON.stringify(books));
}


const store = new Store();
// DOM LOAD EVENT
document.addEventListener('DOMContentLoaded', () => store.displayBooks());      
// Event Listener
document.getElementById('book-form').addEventListener('submit', e => {
  e.preventDefault();
  // Get input values
  let titleValue = title.value,
      authorValue = author.value,
      isbnValue = isbn.value;
  const ui = new UI();    
  // Validation
  if (titleValue === '' || authorValue === '' || isbnValue === '') {    
    ui.showAlert('Please complete all fields!', 'error');
  } else {
    // Create book object
    const book = new Book(titleValue, authorValue, isbnValue);
    // Add to localStorage
    store.saveBook(book);
    // UI creation
    ui.addBookToList(book);
    ui.showAlert('Book Added Correctly!', 'success');
    ui.clearFields();
 }
});

// Delete Event Listener (event delegation)
document.getElementById('book-list').addEventListener('click', e => {
  e.preventDefault();
  const ui = new UI();
  // remove from localStorage
  store.removeBook(e.target.parentElement.previousElementSibling.innerText)
  ui.deleteBook(e.target);
  ui.showAlert('Book Removed!', 'success');
}); 