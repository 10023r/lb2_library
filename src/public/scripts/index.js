console.log('hello world')
const booksURL = 'http://localhost:3000/lib/books'


function sendRequest(url, params= {}) {
    return fetch(url, params)
        .then(data => data.json())
        .catch(err => console.error(err))
}

function changeBookDisplay(param) {
    let ul = document.getElementById('book_list')
    const bookList = ul.children
    for (let i = 0; i < bookList.length; ++i) {
        bookList[i].style.display = param
    }
}

function filterByAllBooks(data) {
    let books = Object.values(data).sort((a, b) => parseInt(b.id) - parseInt(a.id))
    if (books.length < 2) changeBookDisplay('block')
    else filterHTMLTags(books)
}

document.getElementById('allBooks').addEventListener('change', () => {
        sendRequest(booksURL)
            .then(filterByAllBooks)
            .catch(err => console.error(err))
})

function filterByAvailable(data) {
    filterByAllBooks(data)
    const ul = document.getElementById('book_list')
    const bookList = ul.children
    const books = Object.values(data).filter(book => book.owner)
    for (let i = 0; i < books.length; ++i) {
        const book = books[i]
        for (let j = 0; j < bookList.length; ++j) {
            if (bookList[j].id === book.id) {
                bookList[j].style.display = 'none'
                break
            }
        }
    }
}

document.getElementById('available').addEventListener('change', () => {
        sendRequest(booksURL)
            .then(filterByAvailable)
            .catch(err => console.error(err))
})

function filterHTMLTags(sortedBookArray) {
    changeBookDisplay('none')
    let ul = document.getElementById('book_list')
    const bookList = ul.children
    for (let i = 0; i < sortedBookArray.length - 1; ++i) {
        let a = undefined, b = undefined
        for (let j = 0; j < bookList.length; ++j) {
            if (bookList[j].id === sortedBookArray[i].id) {
                a = bookList[j]
            } else if (bookList[j].id === sortedBookArray[i + 1].id) {
                b = bookList[j]
            }
            if (a && b) {
                a.style.display = b.style.display = 'block'
                ul.insertBefore(b, a)
                break
            }
        }
    }
}

function filterByReturnDate(data) {
    let arrayOfBooks = Object.values(data)
    arrayOfBooks = arrayOfBooks.filter(book => book.owner) // отбираем книги, которые были взяты для чтения
    console.log(arrayOfBooks)
    if (arrayOfBooks.length) {
        arrayOfBooks.sort((a, b) => {
                if (a['return_date'] > b['return_date'])
                    return -1
                if (a['return_date'] < b['return_date'])
                    return 1
                return 0
            })
        if (arrayOfBooks.length === 1) {
            changeBookDisplay('none')
            for (let i of document.getElementById('book_list').children) {
                if (i.id === arrayOfBooks[0].id) {
                    i.style.display = 'block'
                }
            }
            return
        }
        filterHTMLTags(arrayOfBooks)
    } else changeBookDisplay('none')
}

document.getElementById('returnDate').addEventListener('click', () => {
    sendRequest(booksURL)
        .then(filterByReturnDate)
        .catch(err => console.error(err))
})


for (let book of document.getElementsByClassName('deleteBook')) {
    book.addEventListener('click', () => {
        let el = document.getElementById(book.parentNode.id)
        const owner = document.getElementsByClassName(`owned${el.id}`)[0]
        console.log(owner)
        if (owner === undefined) {
            if (confirm('Are you sure you want to delete this book?')) {
                el.style.display = 'none'
                el.parentNode.removeChild(el)
                sendRequest(`${booksURL}/${book.parentNode.id}`, {method: 'DELETE'})
                    .then((data) => console.log(data.isDeleted ? 'book was deleted' : 'something went wrong during deleting'))
                    .catch(err => console.error(err))

            }
        }else {
            alert("Книга выдана")
            console.log('cant delete')
        }
    })
}

