const request = require('supertest')
const { Genre } = require('../../../models/genres')
const { Users } = require('../../../models/users')
const mongoose = require('mongoose')
let server

describe('/api/genres', () => {
  beforeEach(() => {
    server = require('../../../index')
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
    let token
    let name
    const exec = () => {
      return request(server)
        .post('/api/genres/')
        .set('x-auth-token', token)
        .send({ name })
    }

    beforeEach(() => {
      token = new Users().generateToken()
      name = 'genre1'
    })

    it('should return a 401 if no authorization', async () => {
      const res = await request(server).post('/api/genres/').send({
        name: 'genre1',
      })

      expect(res.status).toBe(401)
    })
    it('should return error message when a genre name is less than 5 characters', async () => {
      name = '1234'
      const res = await exec()

      expect(res.status).toBe(400)
    })
    it('should return an error if genre name length is greater than 50 charachers', async () => {
      name = new Array(52).join('a')
      const res = await exec()

      expect(res.status).toBe(400)
    })
    it('should return the created genre with valid inputs', async () => {
      const res = await exec()

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', 'genre1')
    })
    it('should save genre', async () => {
      const res = await exec()

      const genre = await Genre.findById(res.body._id)

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', genre.name)
    })
  })

  describe('DELETE /:id', () => {
    let token
    let id
    const user = { _id: mongoose.Types.ObjectId(), isAdmin: true }
    beforeEach(() => {
      token = new Users(user).generateToken()
      id = 1
    })
    const exec = () => {
      return request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)
    }
    it('should return a 404 if invalid id is passed', async () => {
      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should return removed genre if a valid id is passed', async () => {
      const genre = Genre({ name: 'genre1' })
      await genre.save()
      id = genre._id

      const res = await exec()

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('_id')
    })

    //test admin
  })

  describe('PUT /:id', () => {
    let token
    let name
    let id
    let user = { _id: mongoose.Types.ObjectId(), isAdmin: true }

    const exec = () => {
      return request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send({ name })
    }

    beforeEach(async () => {
      token = new Users(user).generateToken()
      name = 'genre1'

      const genre = new Genre({ name })
      await genre.save()

      id = genre._id
    })

    afterEach(async () => {
      await Genre.remove({})
    })
    it('should return 401 if no auth token is provided', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('should return 403 if user is not admin', async () => {
      user = {}
      token = new Users(user).generateToken()
      const res = await exec()
      expect(res.status).toBe(403)
    })

    it('should return 400 if id is not a valid', async () => {
      id = '1'
      const res = await exec()
      expect(res.status).toBe(400)
    })
  })
})
