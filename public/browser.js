document.addEventListener('click', e => {
  // update feature
  if (e.target.classList.contains('edit-me')) {
    let userInput = prompt('Enter the new to-do', e.target.parentElement.parentElement.querySelector('.item-text').innerHTML)

    if (userInput) {
      axios
        .post('/update-item', { text: userInput, id: e.target.getAttribute('data-id') })
        .then(function () {
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
        .then(function () {
          e.target.parentElement.parentElement.remove()
        })
        .catch(e => console.log(e))
    }
  }
})
