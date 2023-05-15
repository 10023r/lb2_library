const url = 'http://localhost:3000/lib/books'
const button = document.getElementById('submitBtn')
button.addEventListener('click', () => {
    const nameInp = document.getElementById('name')
    const authorInp = document.getElementById('author')
    const dateInp = document.getElementById('date')
    if (nameInp.value && authorInp.value && dateInp.value) {
        console.log('button pressd')
        const data = {
            'id': button.value,
            'name': nameInp.value,
            'author': authorInp.value,
            'date': dateInp.value
        }
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(data => {
                console.log('book has been updated')
            })
            .catch(err => console.error(err))
    }

})