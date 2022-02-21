const db = require('../db/connection')

// -----------~~~=:%$}> UTILITY PROMISE REJECTS <{$%:=~~~-----------

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

// -----------~~~=:%$}> USERS <{$%:=~~~-----------
exports.selectUsers = async () => {
   const result = await db.query('SELECT * FROM users;')
   return result.rows
}

// -----------~~~=:%$}> COMMENTS <{$%:=~~~-----------

// SELECT Comments
const selectCommentsInternal = async (id, internal = false) => {
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
exports.selectComments = (id) => selectCommentsInternal(id)

// DELETE Comments
exports.removeComment = async (id) => {

   // CATCH Invalid Paramater Formats
   if (!+id) return handleInvalid('Comments')

   // UPDATE DB using invoked paramaters
   const result = await db.query(`
   DELETE FROM comments
   WHERE comment_id = $1
   RETURNING *;`,
   [id])
   return result
}

// -----------~~~=:%$}> TOPICS <{$%:=~~~-----------

// SELECT Topics
exports.selectTopics = async () => {

   // QUERY DB to return all items in topics table
   const result = await db.query('SELECT * FROM topics;')
   return result.rows

}

// INSERT Topics
exports.insertTopic = async (slug, description) => {

   // CATCH undefined/missing paramaters AND invalid data types
   if (!slug || !description) { return handleInvalid('Topic') }
   if (typeof slug !== 'string') { return handleInvalid('Topic')}
   if (typeof description !== 'string') { return handleInvalid('Topic')}
   

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

// -----------~~~=:%$}> ARTICLES <{$%:=~~~-----------

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
   rest.comment_count = await selectCommentsInternal(id, true)
   


   return rest

}

//  UPDATE Article By ID 
exports.updateArticleVotesByID = async (id, voteCount) => {

   // CATCH Invalid Paramater Formats
   if (!+id) { return handleInvalid('Articles')}
   if (!+voteCount) { return handleInvalid('Articles')}

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

