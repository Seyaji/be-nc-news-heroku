const db = require('../db/connection')

exports.selectTopics = async () => {
   try {
      const result = await db.query('SELECT * FROM topics;')
      return result.rows
   }
   catch (error) {
      next(error)
   }
}
exports.selectArticleByID = async (id) => {
   // console.log(id)
   try {
      
      if(!+id) {
         return Promise.reject({
            status: 404,
            message: `id ${id} is not in a valid format, it should be a number`
         })
      }
      const result = await db.query(`
      SELECT * FROM articles
      WHERE article_id = ${id};
      `)
     
      if (!result.rows[0]) {
         return Promise.reject({
            status: 404,
            message: `Article ${id} either does not exist or cannot be found`
         })
      }
      return result.rows[0]
   }
   catch (error) {
      next(error)
   }
}

exports.insertTopic = async (topic) => {
   try {
      const { slug, description } = topic
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
