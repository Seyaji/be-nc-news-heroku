const {getTopics, postTopic} = require('./controllers/topics.controller')
const {send404, handleCustomErrors, handlePSQLErrors, handleServerErrors} = require('./errors')
const express = require('express')
const app = express()

app.use(express.json())

// Get Requests
app.get('/api/topics', getTopics)

// Post Requests
app.post('/api/topics', postTopic)



// Error Handling
app.all('/*', send404)

app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handleServerErrors) 


module.exports = app