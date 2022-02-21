const {
   selectUsers,
   selectTopics,
   selectArticles,
   selectArticleByID,
   selectComments,
   updateArticleVotesByID,
   removeComment,
   insertTopic,
} = require('../models/app.model')

// -----------~~~=:%$}> USERS <{$%:=~~~-----------
exports.getUsers = (req, res, next) => {
   selectUsers().then(users => res.status(200).send(users))
   .catch(error => next(error))
}

// -----------~~~=:%$}> TOPICS <{$%:=~~~-----------
// GET Topics
exports.getTopics = (req, res, next) => {
   selectTopics().then((result) => res.status(200).send(result))
   .catch((error) => next(error)); 
}

// POST New Topic
exports.postTopic = (req, res, next) => {
   const { slug, description } = req.body
   insertTopic(slug, description).then((topics) => res.status(201).send({ topics }))
   .catch((error) => next(error));
}

// -----------~~~=:%$}> ARTICLES <{$%:=~~~-----------
// GET Articles
exports.getArticles = (req, res, next) => {
   selectArticles().then((result) => res.status(200).send(result))
   .catch((error) => next(error))
}

// GET Article By ID
exports.getArticleByID = (req, res, next) => {
   const { id }  = req.params
   selectArticleByID(id).then((result) => res.status(200).send(result))
   .catch((error) => next(error))
}

// Patch Article By ID
exports.patchArticleVotesByID = (req, res, next) => {
   const { id } = req.params
   const { inc_votes } = req.body
   updateArticleVotesByID(id, inc_votes).then((result) => res.status(201).send(result))
   .catch((error) => next(error))
}


// -----------~~~=:%$}> COMMENTS <{$%:=~~~-----------

// GET Comments By Article ID
exports.getCommentsByArticle = (req, res, next) => {
   const { id } = req.params
   selectComments(id).then((result) => res.status(200).send(result))
}

// DELETE comment by ID
exports.deleteComment = (req, res, next) => {
   const { id } = req.params
   removeComment(id).then((result) => res.status(204).send(result))
   .catch((error) => next(error))
}