const db = require('../db/connection')
const { forEach } = require('../db/data/test-data/articles')

// -----------======> UTILITY PROMISE REJECTS <======--------------

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


// -----------======> SELECT TOPICS <======--------------
exports.selectTopics = async () => {
   try {
      // QUERY DB to return all items in topics table
      const result = await db.query('SELECT * FROM topics;')
      return result.rows
   }
   catch (error) {
      next(error)
   }
}

// -----------======> INSERT TOPICS <======--------------
exports.insertTopic = async (slug, description) => {
   try {
      
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
   catch (error) {
      next(error)
   }
}

// -----------======> SELECT ARTICLE BY ID <======--------------
exports.selectArticleByID = async (id) => {
   try {
      // CATCH Invalid Paramater Formats
      if(!+id) { return handleInvalid('Articles') }

      // QUERY DB to find article by ID
      const result = await db.query(`
      SELECT * FROM articles
      WHERE article_id = ${id};
      `)

      // CATCH Empty Results
      if (!result.rows[0]) { return handleEmptyResult('Article', id) }

      return result.rows[0]
   }
   catch (error) {
      next(error)
   }
}

// -----------======> UPDATE ARTICLE BY ID <======--------------
exports.updateArticleVotesByID = async (id, voteCount) => {
   try {
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
   catch {
      next(error)
   }
}


