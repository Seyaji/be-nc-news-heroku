exports.send404 = (req, res, next) => {
   res.status(404).send({ message: 'path not found...'})
}

exports.handleCustomErrors = (err, reg, res, next) => {
   if(err.status) res.status(err.status).send({ message: err.message })
   if(!err.status) next(err)
}

exports.handlePSQLErrors = (err, req, res, next) => {
   const errorCode = err.code === '22P02'
   if (errorCode) res.status(400).send({message: "bad request..."})
   if (!errorCode) next(err)
}
exports.handleServerErrors = (err, req, res, next) => {
   console.log(err)
   res.status(500).send({message: 'internal server error...'})
}