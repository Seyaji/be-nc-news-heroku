const db = require('../db/connection')

// -----------~~~=*%$}> UTILITY PROMISE REJECTS <{$%*=~~~-----------

// RETURNS a rejected promise for invalid PARAMETERS ---> this is to be wrapped in a if / logic block to function properly
const handleInvalid = (api) => {
   return Promise.reject({
      status: 404,
      message: `The request to ${api} cannot be completed check for invalid data types, empty data or non existent endopints`
   })
}


// RETURNS a rejected promise for non-existent IDs ---> this is to be wrapped in a if / logic block to function properly
const handleEmptyResult = (api, param, ) => {
   return Promise.reject({
      status: 404,
      message: `${api} id: \'${param}\' either does not exist or cannot be found`
   })
}


// -----------~~~=*%$}> UTILITY FUNCTIONS <{$%*=~~~-----------
const checkValidity = (array, type) => {
   return !type 
   ? array.some(item => !item)
   : array.some(item => typeof item !== type)

}


// -----------~~~=*%$}> USERS <{$%*=~~~-----------
exports.selectUsers = async () => {
   const result = await db.query('SELECT * FROM users;')
   return result.rows
}

// -----------~~~=*%$}> COMMENTS <{$%*=~~~-----------

// SELECT Comments
const selectComments = async (id, internal = false) => {
   // CATCH undefined/missing paramaters AND invalid data types
   if (!+id) { return handleInvalid('Comments')}

   // UPDATE DB using invoked paramaters
   const result = await db.query(`
   SELECT * FROM comments
   WHERE article_id = $1`,
   [id])

   // CATCH Empty Results
   if (!result.rows) { return handleEmptyResult('Comments', id) }

   // DETERMINE OUTPUT based on query
   if (internal) return result.rows.length
   if (!internal) return result.rows
}
exports.selectComments = (id) => selectComments(id)


// POST Comment
exports.insertComment = async (id, username, body) => {
   // CATCH Variables
   const params = [ username, body ]
   // CATCH undefined/missing paramaters AND invalid data types
   if (!body || ! username || !+id) { return handleInvalid('Comments') }
   if (checkValidity(params, 'string')) { return handleInvalid('Comments')}
   
   // CATCH 
   
   const result = await db.query(`
   INSERT INTO comments 
   (author, body, article_id)
   VALUES
   ($1, $2, $3)
   RETURNING *;`,
   [username, body, id])

   return result.rows[0]
}

// DELETE Comments
exports.removeComment = async (id) => {

   // CATCH undefined/missing paramaters AND invalid data types
   if (!+id) return handleInvalid('Comments')

   // UPDATE DB using invoked paramaters
   const result = await db.query(`
   DELETE FROM comments
   WHERE comment_id = $1
   RETURNING *;`,
   [id])
   return result
}

// -----------~~~=*%$}> TOPICS <{$%*=~~~-----------

// SELECT Topics
exports.selectTopics = async () => {

   // QUERY DB to return all items in topics table
   const result = await db.query('SELECT * FROM topics;')
   return result.rows

}

// INSERT Topics
exports.insertTopic = async (slug, description) => {
   const params = [ slug, description ]
   // CATCH undefined/missing paramaters AND invalid data types
   if (!slug || !description) return handleInvalid('Topic') 
   if (checkValidity(params, 'string')) return handleInvalid('Topic')
   

   // INSERT into DB with invoked paramaters
   const result = await db.query(`
   INSERT INTO topics 
   (slug, description)
   VALUES 
   ($1, $2)
   RETURNING *;`, 
   [slug, description])
   return result.rows[0]

}

// -----------~~~=*%$}> ARTICLES <{$%*=~~~-----------

// SELECT Articles
exports.selectArticles = async () => {

   // QUERY DB for articles
   const result = await db.query(`
   SELECT * FROM articles;
   `)

   return result.rows
}

// SELECT Articles By ID
exports.selectArticleByID = async (id) => {

   // CATCH Invalid Paramater Formats
   if(!+id) { return handleInvalid('Articles') }

   // QUERY DB to find article by ID
   const result = await db.query(`
   SELECT * FROM articles
   WHERE article_id = ${id};
   `)

   // CATCH Empty Results
   if (!result.rows[0]) { return handleEmptyResult('Article', id) }

   // APPEND Comment Count
   const {...rest} = result.rows[0]
   rest.comment_count = await selectComments(id, true)

   return rest

}

//  UPDATE Article By ID 
exports.updateArticleVotesByID = async (id, voteCount) => {

   // CATCH Invalid Paramater Formats
   if (!+id || !+voteCount) { return handleInvalid('Articles') }


   // UPDATE DB using invoked paramaters
   const result = await db.query(`
   UPDATE articles 
   SET votes = votes + $1
   WHERE article_id = $2
   RETURNING *;`,
   [voteCount, id])

   // CATCH Empty Results
   if (!result.rows[0]) { return handleEmptyResult('Article', id) }

   return result.rows[0]

}

