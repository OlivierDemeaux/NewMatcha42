const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./src/routes/config/database')
const session = require('express-session')
const cookieSession = require('cookie-session')
const fileUpload = require('express-fileupload')


mongoose.connect(config.database, {useNewUrlParser: true})
let db = mongoose.connection


// Check  connection
db.once('open', function () {
  console.log('Connected to MongoDB')
})

// Check for db errors
db.on('error', function () {
  console.log('error');
})

const app = express()

app.set('view engine', 'html');
// Bring in models
let User = require('./src/models/user')

app.use(express.static('./public'));

//app.use(morgan('combine'))
// Body-parser  middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
app.use(cookieSession({
  name: 'session',
  keys: ['ygtfdgtydfs'],
  maxAge: 24 * 60 * 60 * 1000 * 365
}))

app.use(fileUpload());
app.use('/users', require('./src/routes/users'));
app.use('/register', require('./src/routes/registerChecks'));
app.use('/updateUser', require('./src/routes/updateUser'));
app.use('/confirmation', require('./src/routes/confirmation'));
app.use('/getUser', require('./src/routes/getUser'));
app.use('/addDescription', require('./src/routes/addDescription'));
app.use('/messages', require('./src/routes/messages'));
app.use('/like', require('./src/routes/like'));
app.use('/block', require('./src/routes/block'));
app.use('/tag', require('./src/routes/tag'));
app.use('/position', require('./src/routes/position'));
app.use('/getSuggestions', require('./src/routes/getSuggestions'));
app.use('/getMatchs', require('./src/routes/getMatchs'));
app.use('/notification', require('./src/routes/notification'));

app.listen(process.env.PORT || 8081)
