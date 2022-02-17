const {selectTopics, selectArticleByID, insertTopic,} = require('../models/topics.model')

exports.getTopics = (req, res, next) => {
   selectTopics().then((result) => res.status(200).send(result))
   .catch((err) => next(err));
}

exports.getArticleByID = (req, res, next) => {
   const {id} = req.params
   selectArticleByID(id).then((result) => res.status(200).send(result))
   .catch((err) => next(err))
}

exports.postTopic = (req, res, next) => {
   insertTopic(req.body).then((topics) => res.status(201).send({ topics }))
   .catch((err) => next(err));
}