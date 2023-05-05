const request = require('supertest')
const { Genre } = require('../../models/genres')
const { Users } = require('../../models/users')
let server

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../index')
  })
  afterEach(async () => {
    server.close()
    await Genre.remove({})
  })
  describe('GET /', () => {
    it('should return all genres', async () => {
      await Genre.collection.insertMany([
        { name: 'genre1' },
        { name: 'genre2' },
      ])

      const res = await request(server).get('/api/genres')

      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      expect(res.body.some((a) => a.name == 'genre1')).toBeTruthy()
      expect(res.body.some((a) => a.name == 'genre2')).toBeTruthy()
    })
  })

  describe('GET /:id', () => {
    it('should return a 404 if given id is invalid', async () => {
      const genreId = '1'
      const res = await request(server).get('/api/genre/' + genreId)

      expect(res.status).toBe(404)
    })
    it('should return a genre if id is valid', async () => {
      const genre = new Genre({ name: 'genre1' })
      await genre.save()

      const res = await request(server).get('/api/genres/' + genre._id)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', genre.name)
    })
  })

  describe('POST /', () => {
    it('should return a 401 if no authorization', async () => {
      const res = await request(server).post('/api/genres/').send({
        name: 'genre1',
      })

      expect(res.status).toBe(401)
    })
    it('should return error message when a genre name is less than 5 characters', async () => {
      const token = new Users().generateToken()
      const res = await request(server)
        .post('/api/genres/')
        .set('x-auth-token', token)
        .send({ name: '1234' })

      expect(res.status).toBe(400)
    })
    it('should return an error if genre name length is greater than 50 charachers', async () => {
      const token = new Users().generateToken()
      const name = new Array(52).join('a')
      const res = await request(server)
        .post('/api/genres/')
        .set('x-auth-token', token)
        .send({ name })

      expect(res.status).toBe(400)
    })
    it('should return the created genre with valid inputs', async () => {
      const token = new Users().generateToken()
       
      const res = await request(server)
        .post('/api/genres/')
        .set('x-auth-token', token)
        .send({ name:"genre1" })

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name','genre1')
    })
  })
})
