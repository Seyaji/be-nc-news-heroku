const {
   getTopics,
   postTopic,
   getArticles,
   getArticleByID,
   patchArticleVotesByID,
   getUsers,
   getUserByUsername,
   getCommentsByArticle,
   patchCommentByID,
   postComment,
   deleteComment,
} = require('./controllers/app.controller')

const {
   send404,
   handleCustomErrors,
   handlePSQLErrors,
   handleServerErrors
} = require('./errors')

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

// -----------~~~=*%$}> GET REQUESTS <{$%*=~~~-----------
// TOPICS
app.get('/api/topics', getTopics)

// ARTICLES
app.get('/api/articles', getArticles)
app.get('/api/articles/:id', getArticleByID)
app.get('/api/articles/:id/comments', getCommentsByArticle)

// USERS
app.get('/api/users', getUsers)
app.get('/api/users/:username', getUserByUsername)


// -----------~~~=*%$}> PATCH REQUESTS <{$%*=~~~-----------
// ARTICLES
app.patch('/api/articles/:id', patchArticleVotesByID)

// COMMENTS
app.patch('/api/comments/:id', patchCommentByID)


// -----------~~~=*%$}> POST REQUESTS <{$%*=~~~-----------
// TOPICS
app.post('/api/topics', postTopic)

// COMMENTS
app.post('/api/articles/:id/comments', postComment)


// -----------~~~=*%$}> DELETE REQUESTS <{$%*=~~~-----------
// COMMENTS
app.delete('/api/comments/:id', deleteComment)


// -----------~~~=*%$}> ERROR HANDLING <{$%*=~~~-----------
app.all('/*', send404)
app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handleServerErrors) 


module.exports = app