const express = require('express')
const mongodb = require('mongodb')
const path = require('path')
const sanitizeHtml = require('sanitize-html')

const app = express()
let db

// Express, by default does not allow you to serve static files. You need to enable it using the following built-in middleware.
app.use(express.static('public'))

const connectionString = 'mongodb+srv://todoapp:aws1jio00321&@cluster0.rbtac.mongodb.net/todoapp?retryWrites=true&w=majority'

mongodb.connect(connectionString, { useNewUrlParser: true }, (err, client) => {
  // this function will be called by the connect method after it had a chance to open a connection
  db = client.db() // client has the info of the mongodb environment
  app.listen(8080)
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// security
function passwordProtected(req, res, next) {
  res.set('WWW-Authenticate', 'Basic realm="Simple Todo App"')

  // console.log(req.headers.authorization)
  if (req.headers.authorization === 'Basic ZXhwcmVzczptb25nb2Ri') {
    next()
  } else {
    res.status(401).send('Authorization required')
  }
}

app.use(passwordProtected)

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
            <form id='create-form' action='/create-item' method="POST">
              <div class="d-flex align-items-center">
                <input id='create-task' name='item' autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                <button class="btn btn-primary">Add New Item</button>
              </div>
            </form>
          </div>
      
          <ul id='item-list' class="list-group pb-5">
          </ul>
      
        </div>
        
        <script>
          let items = ${JSON.stringify(items)}
        </script>

        <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

        <script src='/browser.js'> </script>

      </body>
      </html>`)
    })
  // res.sendFile(path.join(__dirname, '/index.html'))
})

app.post('/create-item', (req, res) => {
  const safeText = sanitizeHtml(req.body.text, { allowedTags: [], allowedAttributes: {} })

  db.collection('items').insertOne({ text: safeText }, (err, info) => {
    res.json(info.ops[0])
  })
})
// this .insertOne({ text: req.body.item }) will create a new document/ entry in the database, next it expects a function as the second argument which will be called when the item will be created on the database.

app.post('/update-item', (req, res) => {
  const safeText = sanitizeHtml(req.body.text, { allowedTags: [], allowedAttributes: {} })

  db.collection('items').findOneAndUpdate({ _id: new mongodb.ObjectId(req.body.id) }, { $set: { text: safeText } }, () => {
    res.send('Success')
  })
})

app.post('/delete-item', (req, res) => {
  db.collection('items').deleteOne({ _id: new mongodb.ObjectId(req.body.id) }, () => res.send('Success'))
})
