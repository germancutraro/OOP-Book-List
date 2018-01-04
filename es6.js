class Book {
  constructor (title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

class UI {
  addBookToList (book) {
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
  
  clearFields() {
    title.value = '';
    author.value = '';
    isbn.value = '';
  }
  
  showAlert (message, className) {
    let classes = [className, 'show'];
    alertWrapper.classList.add(...classes);
    alertMessage.innerText = message;
    setTimeout(() => {
      alertWrapper.classList = '';
      alertWrapper.classList.add('output');
    }, 2500);
  }
  
  deleteBook (target) {
    target.className === 'delete' ? target.parentElement.parentElement.remove() : false;
  }
}

class Store {
  static getBooks () {
    let books;
    localStorage.getItem('books') === null ? books = [] : books = JSON.parse(localStorage.getItem('books'));
    return books;    
  }
  static displayBooks () {
    const books = Store.getBooks();
    // create ui instance
    const ui = new UI();
    books.map(book => ui.addBookToList(book));
  }
  static saveBook (book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books));
  }
  static removeBook (isbn) {
    const books = Store.getBooks();
    books.map((book, i) => book.isbn === isbn ? books.splice(i, 1) : false);
    localStorage.setItem('books', JSON.stringify(books));
  }
}


// UI
const title = document.getElementById('title'),
      author = document.getElementById('author'),
      isbn = document.getElementById('isbn');
const alertWrapper = document.getElementById('output'),
      alertMessage = document.querySelector('.message');

// DOM LOAD EVENT
document.addEventListener('DOMContentLoaded', () => Store.displayBooks());      
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
    // UI creation
    ui.addBookToList(book);
    // Add to localStorage
    Store.saveBook(book);
    // Ui actions
    ui.showAlert('Book Added Correctly!', 'success');
    ui.clearFields();
 }
});

// Delete Event Listener (event delegation)
document.getElementById('book-list').addEventListener('click', e => {
  e.preventDefault();
  const ui = new UI();
  // remove from localStorage
  Store.removeBook(e.target.parentElement.previousElementSibling.innerText);
  // dom ui
  ui.deleteBook(e.target);
  ui.showAlert('Book Removed!', 'success');
}); 


