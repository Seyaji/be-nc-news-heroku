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
const checkValid = (array, type) => {
   return !type 
   ? array.some(item => !item)
   : array.some(item => typeof item !== type)

}

// -----------~~~=*%$}> USERS <{$%*=~~~-----------
// SELECT Users
exports.selectUsers = async () => {
   const result = await db.query('SELECT * FROM users;')
   return result.rows
}

// SELECT Users By Username
exports.selectUserByUsername = async (username) => {

   // CATCH undefined/missing paramaters AND invalid data types
   if (typeof username !== 'string') { return handleInvalid('Users') }

   // QUERY DB to return user by username
   const result = await db.query(`
   SELECT * FROM users
   WHERE username = $1`,
   [username])

   // CATCH Empty Results
   if (!result.rows[0]) { return handleEmptyResult('Users', username) }

   return result.rows[0]
}

// -----------~~~=*%$}> COMMENTS <{$%*=~~~-----------

// SELECT Comments
const selectComments = async (id, internal = false) => {

   // CATCH undefined/missing paramaters AND invalid data types
   if (!+id) { return handleInvalid('Comments') }

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
   if (checkValid(params, 'string')) { return handleInvalid('Comments') }
   
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
   if (!+id) { return handleInvalid('Comments') }

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

   // CATCH undefined/missing paramaters AND invalid data types
   if (!slug || !description) { return handleInvalid('Topic') }
   if (checkValid([ slug, description ], 'string')) { return handleInvalid('Topic') }

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
exports.selectArticles = async (sortBy, ascOrDesc, topic) => {

   // QUERY DB for articles
   const result = await db.query(`SELECT * FROM articles;`)

   // SORTS the RESULT of the query
   const sorter = (array, sortBy, sortOrder) => {

      // Determine the default sort query
      if (!sortBy) sortBy = 'created_at'
      return array.sort((a, b) => {

         // Store sorting variables in an array and reverse the order for descending results 
         let order = [a, b]
         if (sortOrder === 'desc') order = order.reverse()

         // Sort dates by getting a numerical value from the string date value
         if (sortBy === 'created_at') {
            const dateA = new Date(order[0].created_at).getTime().toString()
            const dateB = new Date(order[1].created_at).getTime().toString()
            return dateB.localeCompare(dateA, undefined, { numeric: true })
         }
         // Default return for anything thats not the created_at value
         return order[0][sortBy].localeCompare(order[1][sortBy])
         }
      )
   }

   // STORED  sorted results in a variable for improved readability
   const sorted = sorter(result.rows, sortBy, ascOrDesc)

   // FILTERS the sorted results by TOPIC, if there is no TOPIC it returns the sorted results
   const filterByTopic = (array) => {
      if (!topic) { return array }
      return array.filter((item) => item.topic === topic)
   }

   return filterByTopic(sorted, topic)
}

// SELECT Articles By ID
exports.selectArticleByID = async (id) => {

   // CATCH Invalid Paramater Formats
   if(!+id) { return handleInvalid('Articles') }

   // QUERY DB to find article by ID
   const result = await db.query(`
   SELECT * FROM articles
   WHERE article_id = ${id};`)

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

