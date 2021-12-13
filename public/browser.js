const itemTemplate = item => {
  return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
  <span class="item-text">${item.text}</span>
  <div>
    <button data-id='${item._id}' class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
    <button data-id='${item._id}' class="delete-me btn btn-danger btn-sm">Delete</button>
  </div>
</li>`
}

// initial page load
const html = items.map(item => itemTemplate(item)).join('') //join will convert the array into a string of text
document.getElementById('item-list').insertAdjacentHTML('afterbegin', html)

// create-feature
const createTask = document.getElementById('create-task')

document.getElementById('create-form').addEventListener('submit', e => {
  e.preventDefault()

  axios
    .post('/create-item', { text: createTask.value })
    .then(response => {
      // new html
      document.getElementById('item-list').insertAdjacentHTML('afterbegin', itemTemplate(response.data))
      createTask.value = ''
      createTask.focus()
    })
    .catch(e => console.log(e))
})

document.addEventListener('click', e => {
  // update feature
  if (e.target.classList.contains('edit-me')) {
    let userInput = prompt('Enter the new to-do', e.target.parentElement.parentElement.querySelector('.item-text').innerHTML)

    if (userInput) {
      axios
        .post('/update-item', { text: userInput, id: e.target.getAttribute('data-id') })
        .then(() => {
          e.target.parentElement.parentElement.querySelector('.item-text').innerHTML = userInput
        })
        .catch(e => console.log(e))
    }
  }

  // delete feature
  if (e.target.classList.contains('delete-me')) {
    if (confirm('Are you sure to delete this task?')) {
      axios
        .post('/delete-item', { id: e.target.getAttribute('data-id') })
        .then(() => {
          e.target.parentElement.parentElement.remove()
        })
        .catch(e => console.log(e))
    }
  }
})
