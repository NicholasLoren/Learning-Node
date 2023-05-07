const request = require('supertest')
const { Rentals } = require('../../../models/rentals')
const { Users } = require('../../../models/users')
const mongoose = require('mongoose')
const { Movies } = require('../../../models/movies')
let server

describe('POST /returns', () => {
  let movieId
  let customerId
  let rental
  let token
  let payload

  const exec = () => {
    return request(server)
      .post('/api/returns/')
      .set('x-auth-token', token)
      .send(payload)
  }

  beforeEach(async () => {
    server = require('../../../index')
    token = new Users().generateToken()
    movieId = mongoose.Types.ObjectId()
    customerId = mongoose.Types.ObjectId()

    payload = { movieId, customerId }

    rental = new Rentals({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2,
      },
    })

    await rental.save()
  })

  afterEach(async () => {
    await Rentals.remove({})
    await Movies.remove({})
    await server.close()
  })

  it('should return 401 if user is not logged in', async () => {
    token = ''

    const res = await exec()

    expect(res.status).toBe(401)
  })

  it('should return 400 if customerId is not provided', async () => {
    delete payload.customerId

    const res = await exec()

    expect(res.status).toBe(400)
  })

  it('should return 400 if movieId is not provided', async () => {
    delete payload.movieId

    const res = await exec()

    expect(res.status).toBe(400)
  })

  it('should return 404 if rental is not found', async () => {
    await Rentals.remove({})

    const res = await exec()

    expect(res.status).toBe(404)
  })

  it('should return 400 if rental is already processed', async () => {
    rental.returnDate = new Date()
    await rental.save()

    const res = await exec()

    expect(res.status).toBe(400)
  })

  it('should return 200 if request is valid', async () => {
    const res = await exec()

    expect(res.status).toBe(200)
  })

  it('should check if date returned is defined', async () => {
    await exec()
    const rentalInDb = await Rentals.findById(rental._id)
    const diff = new Date() - rentalInDb.returnDate

    expect(rentalInDb.returnDate).toBeDefined()
    expect(diff).toBeLessThan(10 * 1000)
  })

  it('should check if rental fee is defined', async () => {
    await exec()

    const rentalInDb = await Rentals.findById(rental._id)

    expect(rentalInDb.rentalFee).toBeDefined()
  })

  it('should check if movies in stock have be increased', async () => {
    const movie = new Movies({
      _id: movieId,
      title: 'movie1',
      genre: { _id: mongoose.Types.ObjectId(), name: 'genre1' },
      dailyRentalRate: 2,
      numberInStock: 10,
    })
    await movie.save()

    await exec()

    const movieReturned = await Movies.findById(movieId)

    expect(movie.numberInStock).toBeLessThan(movieReturned.numberInStock)
  })
})
