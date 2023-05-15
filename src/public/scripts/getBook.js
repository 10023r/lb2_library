console.log('hello')
const url = 'http://localhost:3000/lib/books'
let options = {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    },
    body: ''
}
let curBookId = undefined


const takeBtn = document.getElementById('take-btn')
const returnBtn = document.getElementById('return-btn')
if (takeBtn) {
    const dialog = document.getElementsByTagName('dialog')[0]
    takeBtn.addEventListener('click', () => {
        console.log('click')
        dialog.open = true
        takeBtn.disabled = true
    })
    curBookId = takeBtn.value
} else {
    curBookId = returnBtn.value
    returnBtn.addEventListener('click', () => {
        options.body = JSON.stringify({id: returnBtn.value})
        fetch(url, options).then(data => {
            console.log('book has been returned')
        })
            .catch(err => console.error(err))
    })
}

const takeBtnSubmit = document.getElementById('takeBtn')
takeBtnSubmit.addEventListener('click', () => {
    const username = document.getElementById('username').value
    const returnDate = document.getElementById('returnDate').value
    options.body = JSON.stringify({
        owner: username,
        return_date: returnDate,
        id: curBookId
    })
    fetch(url, options)
        .then(data => console.log("book has been taken"))
        .catch(err => console.error(err))
})