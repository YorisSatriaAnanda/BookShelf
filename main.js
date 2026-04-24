// Celestial Bookshelf Logic
let books = [];

const ICONS = {
    check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    undo: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-undo-2"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>',
    arrowRight: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>'
};

document.addEventListener('DOMContentLoaded', () => {
    const bookForm = document.getElementById('bookForm');
    const searchForm = document.getElementById('searchBook');

    loadBooksFromStorage();
    renderBooks();

    bookForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = +new Date();
        const title = document.getElementById('bookFormTitle').value;
        const author = document.getElementById('bookFormAuthor').value;
        const year = parseInt(document.getElementById('bookFormYear').value);
        const isComplete = document.getElementById('bookFormIsComplete').checked;

        books.push({ id, title, author, year, isComplete });

        saveBooksToStorage();
        renderBooks();
        bookForm.reset();
        updateSubmitButton();
    });

    searchForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const query = document.getElementById('searchBookTitle').value.toLowerCase();
        renderBooks(query);
    });

    const isCompleteCheckbox = document.getElementById('bookFormIsComplete');
    isCompleteCheckbox.addEventListener('change', updateSubmitButton);
});

function updateSubmitButton() {
    const isComplete = document.getElementById('bookFormIsComplete').checked;
    const btnSpan = document.querySelector('#bookFormSubmit span');
    btnSpan.innerText = isComplete ? 'Simpan ke Rak Selesai' : 'Simpan ke Rak Belum Selesai';
}

function saveBooksToStorage() {
    localStorage.setItem('BOOKS_DATA', JSON.stringify(books));
}

function loadBooksFromStorage() {
    const data = localStorage.getItem('BOOKS_DATA');
    if (data) books = JSON.parse(data);
}

function renderBooks(query = '') {
    const incompleteShelf = document.getElementById('incompleteBookList');
    const completeShelf = document.getElementById('completeBookList');
    incompleteShelf.innerHTML = '';
    completeShelf.innerHTML = '';

    const filteredBooks = query 
        ? books.filter(book => book.title.toLowerCase().includes(query))
        : books;

    for (const book of filteredBooks) {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeShelf.appendChild(bookElement);
        } else {
            incompleteShelf.appendChild(bookElement);
        }
    }
}

function createBookElement(book) {
    const bookContainer = document.createElement('div');
    bookContainer.setAttribute('data-bookid', book.id);
    bookContainer.setAttribute('data-testid', 'bookItem');
    bookContainer.className = 'book-item';

    const title = document.createElement('h3');
    title.innerText = book.title;
    title.setAttribute('data-testid', 'bookItemTitle');

    const author = document.createElement('p');
    author.innerText = `Oleh: ${book.author}`;
    author.setAttribute('data-testid', 'bookItemAuthor');

    const year = document.createElement('p');
    year.className = 'book-year';
    year.innerText = book.year;
    year.setAttribute('data-testid', 'bookItemYear');

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'book-action';

    const toggleButton = document.createElement('button');
    toggleButton.innerHTML = book.isComplete 
        ? `${ICONS.undo} Belum Selesai` 
        : `${ICONS.check} Selesai`;
    toggleButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
    toggleButton.addEventListener('click', () => {
        book.isComplete = !book.isComplete;
        saveBooksToStorage();
        renderBooks();
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = `${ICONS.trash} Hapus`;
    deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
    deleteButton.addEventListener('click', () => {
        if (confirm('Yakin ingin menghapus buku ini?')) {
            books = books.filter((b) => b.id !== book.id);
            saveBooksToStorage();
            renderBooks();
        }
    });

    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(deleteButton);

    bookContainer.appendChild(title);
    bookContainer.appendChild(author);
    bookContainer.appendChild(year);
    bookContainer.appendChild(buttonContainer);

    return bookContainer;
}