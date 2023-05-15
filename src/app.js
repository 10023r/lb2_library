const express = require('express')
const path = require('path')
const books = Object.values(require('./books.json'))
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000
const pathToTemplateCover = "./pictures/template_book_cover.jpg"

// load view engine
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, './public/views'))
app.set('view engine', 'pug')
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());
app.get('/lib', (req, res) => {
    // console.log(books)
    res.render('index', {books})
    // console.log('get /lib')
})

// app.post('/lib', (req, res) => {
//     const newData = req.body
//     console.log('/lib post')
//     console.log(newData)
//     for (let i = 0; i < books.length; ++i) {
//         if (newData.id === books[i].id) {
//             if (Object.keys(newData).length === 1) {
//                 books[i].owner = books[i].return_date = ""
//             } else {
//                 books[i].name = newData.name ? newData.name : books[i].name
//                 books[i].author = newData.author ? newData.author : books[i].author
//                 books[i].date = newData.date ? newData.date : books[i].date
//                 books[i].owner = newData.owner ? newData.owner : books[i].owner
//                 books[i].return_date = newData.return_date ? newData.return_date : books[i].return_date
//             }
//             break
//         }
//     }
//     res.redirect('/lib')
// })

app.get('/lib/books', (req, res) => {
    res.send(JSON.stringify(books))
    // console.log('/lib/books get')
})

app.post('/lib/books', (req, res) => {
    console.log('request to /lib/books POST', req.body)
    let newBook = req.body
    newBook.id = -1
    newBook.imgURL = pathToTemplateCover
    for (let book of books) {
        newBook.id = `${Math.max(newBook.id, book.id + 1)}`
    }
    // console.log('newBook ==========', newBook)
    newBook.owner = newBook.return_date = ""
    books.push(newBook)
    res.redirect('/lib')
})

app.delete('/lib/books/:num', (req, res) => {
    const delID = req.params.num
    let resObj = {"isDeleted": "false"}
    for (let i = 0; i < books.length; ++i) {
        if (books[i].id === delID) {
            books.splice(i, 1)
            resObj.isDeleted = 'true'
            break
        }
    }
    // console.log('/lib/books/:num=', delID, 'delete')
    res.send(JSON.stringify(resObj))
})

app.get('/lib/books/:num', (req, res) => {
    for (let i = 0; i < books.length; ++i) {
        if (books[i].id === req.params.num) {
            const book = books[i]
            res.render('getBook', {book})
            break
        }
    }
    // console.log('/lib/books/:num=', req.params.num, 'get')
})

app.get('/lib/books/edit/:num', (req, res) => {
    let book = {}
    for (let i = 0; i < books.length; ++i) {
        if (books[i].id === req.params.num) {
            book = books[i]
            // console.log('book found')
            break
        }
    }
    if (book) {
        res.render('edit', {book})
    } else {
        res.send('requesting wrong page')
        // console.log('wrong requesting book')
    }
    // console.log('/lib/books/edit/:num=', req.params.num, 'get')
})

app.get('/lib/add', (req, res) => {
    // console.log('get /lib/books/add')
    res.render('addBook')
})

app.put('/lib/books', (req, res) => {
    // console.log('put /lib/books')
    // console.log(req.body)
    const newData = req.body
    for (let i = 0; i < books.length; ++i) {
        if (newData.id === books[i].id) {
            if (Object.keys(newData).length === 1) {
                books[i].owner = books[i].return_date = ""
                // console.log('book returned to library')
            } else {
                books[i].name = newData.name ? newData.name : books[i].name
                books[i].author = newData.author ? newData.author : books[i].author
                books[i].date = newData.date ? newData.date : books[i].date
                books[i].owner = newData.owner ? newData.owner : books[i].owner
                books[i].return_date = newData.return_date ? newData.return_date : books[i].return_date
                // console.log('book was edited/taken')
            }
            break
        }
    }
    res.end()
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`)
})

