const app = require("../app")
const db = require("../db/connection")
const request = require('supertest')
const testData = require('../db/data/test-data')
const seed = require('../db/seeds/seed')

beforeEach(() => seed(testData))

afterAll(() => {
   if (db.end) db.end()
})

describe('API tests', () => {
   describe('/api/topics tests', () => {
      describe('1. GET /api/topics', () => {
         test('status 200: responds with an array of topic objects each containing the properties slug and description', () => {
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
      }) // end of 1. GET /api/topics test
   }) // end of api topics tests
   describe('global error tests', () => {
      describe('status 404: tests API paths for 400 error handling', () => {
         const badPath = (path) => path.replace(/[a-z]$/i, 'badPath')
         const APIPaths = [
            [badPath('/api/topics'), `path not found...`]
         ]
         test.concurrent.each(APIPaths)('.get(%s)', (path, expected) => {
            return request(app)
            .get(path)
            .expect(404)
            .then(({body}) => {
               console.log(body)
               expect(body.message).toBe(expected)
            })
         })
      })
      // describe('status 400: tests bad request paths for API', () => {
      //    const badRequest = (request) => request.replace(/[a-z]$/i, 'badRequest')
      //    const requestPaths = [
      //       ['placeholderInput', 'placeholderExpected']
      //    ]
      //    test.concurrent.each(requestPaths)('.get(%s)', async (path, expected) => {
      //       return request(app)
      //       .get(path)
      //       .expect(400)
      //       .then(({ body: { message } }) => {
      //          expect(message).toBe(expected)
      //       })
      //    })
      // })
      // describe('status 500: internat server error', async () => {
      //    test ('500: server error test', () => {
      //       const server500Mock = jest.fn().mockRejectedValue(new Error('internal server error...'))
      //       await server500Mock()
      //    })
      // })
   })
})

