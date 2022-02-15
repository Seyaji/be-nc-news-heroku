const {getTopics} = require('./controllers/topics.controller')
const {send404, handleCustomErrors, handlePSQLErrors, handleServerErrors} = require('./errors')
const express = require('express')
const app = express()

// Get Requests
app.get('/api/topics', getTopics)





// Error Handling
app.all('/*', send404)

app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handleServerErrors) 


module.exports = app