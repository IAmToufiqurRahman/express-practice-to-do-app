const express = require('express')
const mongodb = require('mongodb')
const path = require('path')

const app = express()
let db

app.use(express.static('public'))

const connectionString = 'mongodb+srv://todoapp:aws1jio00321&@cluster0.rbtac.mongodb.net/todoapp?retryWrites=true&w=majority'

mongodb.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
  // this function will be called by the connect method after it had a chance to open a connection
  db = client.db() // client has the info of the mongodb environment
  app.listen(8080)
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', function (req, res) {
  db.collection('items')
    .find()
    .toArray((err, items) => {
      res.send(`<!DOCTYPE html>

      <html>
      
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Simple To-Do App</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
          integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
      </head>
      
      <body>
        <div class="container">
          <h1 class="display-4 text-center py-1">To-Do App</h1>
      
          <div class="jumbotron p-3 shadow-sm">
            <form action='/create-item' method="POST">
              <div class="d-flex align-items-center">
                <input name='item' autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
              </div>
            </form>
          </div>
      
          <ul class="list-group pb-5">
           ${items
             .map(
               item => `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
           <span class="item-text">${item.text}</span>
           <div>
             <button data-id='${item._id}' class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
             <button data-id='${item._id}' class="delete-me btn btn-danger btn-sm">Delete</button>
           </div>
         </li>`
             )
             .join('')}
          </ul>
      
        </div>
      
        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

        <script src='/browser.js'> </script>

      </body>
      
      </html>`)
    })
  // res.sendFile(path.join(__dirname, '/index.html'))
})

app.post('/create-item', (req, res) => {
  console.log(req.body.item)
  db.collection('items').insertOne({ text: req.body.item }, () => {
    res.redirect('/')
  })
})
// this .insertOne({ text: req.body.item }) will create a new document/ entry in the database, next it expects a function as the second argument which will be called when the item will be created on the database.

app.post('/update-item', (req, res) => {
  db.collection('items').findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.id) }, { $set: { text: req.body.text } }, () => {
    res.send('Success')
  })
})

app.post('/delete-item', (req, res) => {
  db.collection('items').deleteOne({ _id: new mongodb.ObjectId(req.body.id) }, () => res.send('Success'))
})
