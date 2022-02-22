const app = require("../app")
const db = require("../db/connection")
const request = require('supertest')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

beforeEach(() => seed(testData))

afterAll(() => {
   if (db.end) db.end()
})

describe('\nAPI Tests', () => {
   // -----------~~~=*%$}> USERS <{$%*=~~~-----------

   describe('\n/api/users TESTS --------->', () => {
      describe('\n1. USERS GET /api/users', () => {
         test('STATUS 200: responds with an array of USERS containing the valid properties and data types', () => {
            return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
               const users = body
               expect(users).toBeInstanceOf(Array)
            })
         })
      })
      describe('\n2. USERS GET BY USERNAME GET /api/users/:username', () => {
         test('STATUS 200: responds with a user object containing the correct properties', () => {
            return request(app)
            .get('/api/users/lurker')
            .expect(200)
            .then(({ body }) => {
               const user = body
               expect(body).toEqual(
                  expect.objectContaining({
                     username: expect.any(String),
                     avatar_url: expect.any(String),
                     name: expect.any(String)
                  })
               )
            })
         })
      })
      
   })

   // -----------~~~=*%$}> TOPICS <{$%*=~~~-----------

   describe('\n\n/api/topics TESTS --------->', () => {
      describe('\n1. TOPICS GET /api/topics', () => {
         test('STATUS 200: responds with an ARRAY of TOPIC objects each containing the properties; SLUG and DESCRIPTION', () => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
               const topics = body
               expect(body).toBeInstanceOf(Array)
               topics.forEach(topic => {
                  expect(topic).toEqual(
                     expect.objectContaining({
                        slug: expect.any(String),
                        description: expect.any(String)
                     })
                  )
               })
            })
         })
      }) 
      describe('\n2. TOPICS POST /api/topics', () => {
         test('STATUS 201: responds with newly added TOPIC to the database and CHECKS to see if the topics have INCREASED', () => {
            const newTopic = { slug: 'coding', description: 'Javascript 101!' }
            return request(app)
            .post('/api/topics')
            .send(newTopic)
            .expect(201)
            .then(({ body }) => {
               expect(body.topics).toEqual({
                  slug: 'coding',
                  description: 'Javascript 101!'
               })
            })
            .then(() => {
               return db.query(`SELECT * FROM topics`)
            })
            .then((result) => {
               expect(result.rows.length).toBe(4) 
            })
         })
      })
   })

   // -----------~~~=*%$}> ARTICLES <{$%*=~~~-----------
   
   describe('\n\n/api/articles TESTS --------->', () => {
      describe('\n1. ARTICLES GET /api/articles', () => {
         test('STATUS 200: responds with an ARRAY of ARTICLES each containing a USERNAME and all ARTICLE PROPERTIES', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
               const articles = body
               expect(body).toBeInstanceOf(Array)
               articles.forEach(article => {
                  expect(article).toEqual(
                     expect.objectContaining({
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                     })
                  )
               })
            })
         })
      })
      describe('\n2. ARTICLES BY ID GET /api/articles/:id', () => {
         test('STATUS 200: should RETURN the ARTICLE when given an ID', () => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((result) => {
               expect(result.body.article_id).toBe(1)
               expect(result.body).toEqual(
                  expect.objectContaining({
                     article_id: expect.any(Number),
                     title: expect.any(String),
                     topic: expect.any(String),
                     author: expect.any(String),
                     body: expect.any(String),
                     created_at: expect.any(String),
                     votes: expect.any(Number),
                     comment_count: expect.any(Number)
                  })
               );
            })
         })
      })
      describe('\n3. ARTICLES BY ID PATCH /api/articles/:id', () => {
         test('STATUS 201: RETURNS the article and INCREMENTS the article VOTES when given an ID and VALID body object', () => {
            const newVote = { inc_votes: 10 }
            return request(app)
            .patch('/api/articles/1')
            .send(newVote)
            .expect(201)
            .then((result) => {
               expect(result.body).toEqual(
                  expect.objectContaining({
                     article_id: expect.any(Number),
                     title: expect.any(String),
                     topic: expect.any(String),
                     author: expect.any(String),
                     body: expect.any(String),
                     created_at: expect.any(String),
                     votes: expect.any(Number),
                  })
               )
            })
            .then(() => {
               return request(app)
               .get('/api/articles/1')
               .expect(200)
               .then((result) => {
                  expect(result.body.votes).toEqual(110)
               })
            })
         })
         test('STATUS 201: RETURNS the article and DECREMENTS the article VOTES when given an ID and VALID body object', () => {
            const newVote = { inc_votes: -10 }
            return request(app)
            .patch('/api/articles/1')
            .send(newVote)
            .expect(201)
            .then((result) => {
               expect(result.body).toEqual(
                  expect.objectContaining({
                     article_id: expect.any(Number),
                     title: expect.any(String),
                     topic: expect.any(String),
                     author: expect.any(String),
                     body: expect.any(String),
                     created_at: expect.any(String),
                     votes: expect.any(Number),
                  })
               )
            })
            .then(() => {
               return request(app)
               .get('/api/articles/1')
               .expect(200)
               .then((result) => {
                  expect(result.body.votes).toEqual(90)
               })
            })
         })
      })
   })

   // -----------~~~=*%$}> COMMENTS <{$%*=~~~-----------

   describe('\n\n/api/comments TESTS --------->', () => {
      describe('\n1. COMMENTS GET/api/comments TESTS', () => {
         test('STATUS 200: should return an array of all comments', () => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((result) => {
               const comments = result.body
               expect(comments).toBeInstanceOf(Array)
               comments.forEach((comment) => {
                  expect(comment).toEqual(
                     expect.objectContaining({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                     })
                  )
               })
            
               
            })
   
         })
      })
      describe('\n2. COMMENTS PATCH /api/comments', () => {
         test('STATUS 204: should delete a comment that has the matching comment id', () => {
            return request(app)
            .delete('/api/comments/1')
            .expect(204)
         })
      })
      describe('\n3. COMMENTS POST /api/articles/:id/comments', () => {
         test('STATUS 201: should POST  a new comment to the given article ID', () => {
            const newComment = { username: 'lurker', body: 'This article does not use TDD....' }
            return request(app)
            .post('/api/articles/1/comments')
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
               expect(body).toEqual(
                  expect.objectContaining({
                     article_id: expect.any(Number),
                     comment_id: expect.any(Number),
                     votes: expect.any(Number),
                     created_at: expect.any(String),
                     author: expect.any(String),
                     body: expect.any(String),
                  })
               )
            })
         })
      })
   })
   
   // -----------~~~=*%$}> ERROS <{$%*=~~~-----------

   describe('\n\nGLOBAL ERROR TESTS --------->', () => {
      describe('\nSTATUS 404: tests for non existent paths', () => {
         const APIPaths = [
            ['/api/topicsBadPath', `path not found...`],
            ['/api/not-a-path', `path not found...`],
         ]
         test.concurrent.each(APIPaths)
         ('.get(%s)', (path, expected) => {
            return request(app)
            .get(path)
            .expect(404)
            .then(({ body: {message} }) => {
               expect(message).toBe(expected)
            })
         })
      })
      describe('\nSTATUS 404: tests parametric endpoints for GET requests that dont exist or are the incorrect format', () => {
         const parametricEndpoints = [
            // GET Testing
            [
               'START\n', '/GET ARTICLES TESTING --------->', 
               'path not found...'
            ],
            [
               'GET', '/api/articles/98765', 
               'Article id: \'98765\' either does not exist or cannot be found'
            ],
            [
               'GET', '/api/articles/BadID-Format', 
               'The request to Articles cannot be completed check for invalid data types, empty data or non existent endopints'
            ],
            [
               '^^END OF ABOVE^^', '/---------------------', 'path not found...'
            ],
            [
               'START\n', '/GET USERS TESTING --------->', 
               'path not found...'
            ],
            [
               'USERS', '/api/users/1',
               'Users id: \'1\' either does not exist or cannot be found'
            ],
            
         ]
         test.concurrent.each(parametricEndpoints)
         ('%s(%s)', (reqName, path, expected) => {
            return request(app)
            .get(path)
            .expect(404)
            .then(({ body: { message } }) => {
               expect(message).toBe(expected)
            })
         })
      })
      describe('\nSTATUS 404: tests parametric endpoints for PATCH requests that are incomplete or in the incorrect format', () => {
         const parametricEndpoints = [
            [
               'START', '/PATCH TESTING --------->', 
               'path not found...',
               { inc_votes: 0}
            ],
            [
               'PATCH BAD DATA TYPE', '/api/articles/1', 
               'The request to Articles cannot be completed check for invalid data types, empty data or non existent endopints',
               { inc_votes: 'hello'}
            ],
            [
               'PATCH ARTICLE ID', '/api/articles/hello', 
               'The request to Articles cannot be completed check for invalid data types, empty data or non existent endopints',
               { inc_votes: 10}
            ],
            [
               'PATCH', '/api/articles/98765', 
               'Article id: \'98765\' either does not exist or cannot be found',
               { inc_votes: 10}
            ],
            [
               '^^END OF ABOVE^^', '/---------------------', 'path not found...',
               { inc_votes: 0}
            ],
         ]
         test.concurrent.each(parametricEndpoints)
         ('%s(%s)', (reqName, path, expected, body) => {
            return request(app)
            .patch(path)
            .send(body)
            .expect(404)
            .then(({ body: { message } }) => {
               expect(message).toBe(expected)
            })
         })
      })
      describe('\nSTATUS 404: tests parametric endpoints for POST requests that are incomplete or in the incorrect format', () => {
         jest.setTimeout(500)
         const parametricEndpoints = [
            // TOPICS TESTS
            [
               'START API TOPICS POST TESTING --------->', '/api/topics', 
               'The request to Topic cannot be completed check for invalid data types, empty data or non existent endopints',
               { slug: 'test start' }
            ],
            [
               'POST Incomplete', '/api/topics', 
               'The request to Topic cannot be completed check for invalid data types, empty data or non existent endopints',
               { description: 'hello' }
            ],
            [
               'POST Bad Data Type', '/api/topics', 
               'The request to Topic cannot be completed check for invalid data types, empty data or non existent endopints',
               { slug: 'coding', description: 1001 }
            ],
            [
               'POST Empty Data', '/api/topics', 
               'The request to Topic cannot be completed check for invalid data types, empty data or non existent endopints',
               { slug: 'coding', description: '' }
            ],
            // COMMENTS TESTS
            [
               'START API COMMENTS POST TESTING --------->', '/api/articles/1/comments', 
               'The request to Comments cannot be completed check for invalid data types, empty data or non existent endopints',
               { username: 'lurker', body: ''}
            ],
            [
               'POST Empty Data', '/api/articles/1/comments', 
               'The request to Comments cannot be completed check for invalid data types, empty data or non existent endopints',
               { username: 'lurker', body: ''}
            ],
            [
               'POST Bad Data Type', '/api/articles/1/comments', 
               'The request to Comments cannot be completed check for invalid data types, empty data or non existent endopints',
               { username: 'lurker', body: 1234 }
            ],
            [
               'POST Incomplete', '/api/articles/1/comments', 
               'The request to Comments cannot be completed check for invalid data types, empty data or non existent endopints',
               { username: 'lurker'}
            ],
         ]
         test.concurrent.each(parametricEndpoints)
         ('%s(%s)', (reqName, path, expected, body) => {
            return request(app)
            .post(path)
            .send(body)
            .expect(404)
            .then(({ body: { message } }) => {
               expect(message).toBe(expected)
            })
         })
      })
   })
})

