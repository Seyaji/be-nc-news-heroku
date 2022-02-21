const {
   getTopics,
   postTopic,
   getArticles,
   getArticleByID,
   patchArticleVotesByID,
   getUsers,
   getCommentsByArticle,
   deleteComment,
} = require('./controllers/app.controller')

const {
   send404,
   handleCustomErrors,
   handlePSQLErrors,
   handleServerErrors
} = require('./errors')

const express = require('express')
const app = express()

app.use(express.json())

// -----------~~~=:%$}> GET REQUEST <{$%:=~~~-----------
// TOPICS
app.get('/api/topics', getTopics)
app.get('/api/articles', getArticles)

// ARTICLES
app.get('/api/articles/:id', getArticleByID)
app.get('/api/articles/:id/comments', getCommentsByArticle)

// USERS
app.get('/api/users', getUsers)


// -----------~~~=:%$}> PATCH REQUESTS <{$%:=~~~-----------
// ARTICLES
app.patch('/api/articles/:id', patchArticleVotesByID)


// -----------~~~=:%$}> POST REQUESTS <{$%:=~~~-----------
// TOPICS
app.post('/api/topics', postTopic)


// -----------~~~=:%$}> DELETE REQUESTS <{$%:=~~~-----------
// COMMENTS
app.delete('/api/comments/:id', deleteComment)


// -----------~~~=:%$}> ERROR HANDLING <{$%:=~~~-----------
app.all('/*', send404)
app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handleServerErrors) 


module.exports = app