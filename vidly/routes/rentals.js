const express = require('express')
const { Rentals, validate } = require('../models/rentals')
const { Customers } = require('../models/customers')
const { Movies } = require('../models/movies')
const router = express.Router()

//get rentals
router.get('/', async (req, res) => {
  const rentals = await Rentals.find().sort('dateOut')
  return res.send(rentals)
})

//add rentals
router.post('/', async (req, res) => {
  //validate the rental object
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //find the customer
  const customer = await Customers.findById(req.body.customerId)
  if (!customer) return res.status(400).send('Invalid customer')

  //find the movie
  const movie = await Movies.findById(req.body.movieId)
  if (!movie) return res.status(400).send('Invalid movie')

  //before renting, find if there are enoughh movies
  if (movie.numberInStock === 0) return res.send('Movie is out of stock')

  //create a rental object
  let rental = new Rentals({
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
  })

  //save the movie
  rental = await rental.save()

  //decrement the movie in stock
  await Movies.update(
    { _id: movie.id },
    {
      $inc: {
        numberInStock: -1,
      },
    }
  )

  return res.send(rental)
})

//get a rental
router.get('/:id', async (req, res) => {
  const { id } = req.params
  //find the rental
  const rental = await Rentals.findById(id)
  if (!rental) return res.status(400).send('Rental not found')

  return res.send(rental)
})

//delete a rental
router.delete('/:id', async (req, res) => {
  const { id } = req.params
  //find the rental
  const rental = await Rentals.findByIdAndRemove(id)
  if (!rental) return res.status(400).send('Rental not found')

  return res.send(rental)
})

//update a rental
router.put('/:id', async (req, res) => {
  //validate the rental object
  const {id} = req.params
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  //find the rental
  let rental = await Rentals.findById(id)
  if(!rental) return res.status(400).send("Rental data not found")


  //find the customer
  const customer = await Customers.findById(req.body.customerId)
  if (!customer) return res.status(400).send('Invalid customer')

  //find the movie
  const movie = await Movies.findById(req.body.movieId)
  if (!movie) return res.status(400).send('Invalid movie')

  //before renting, find if there are enoughh movies
  if (movie.numberInStock === 0) return res.send('Movie is out of stock')

//   //create a rental object
//   let rental = new Rentals({
//     movie: {
//       _id: movie._id,
//       title: movie.title,
//       dailyRentalRate: movie.dailyRentalRate,
//     },
//     customer: {
//       _id: customer._id,
//       name: customer.name,
//       phone: customer.phone,
//     },
//   })

//update the rental
rental.movie._id = movie._id
rental.movie.title = movie.title
rental.movie.dailyRentalRate = movie.dailyRentalRate
rental.customer.name = customer.name
rental.customer.phone = customer.phone



  //save the movie
  rental = await rental.save()

  //decrement the movie in stock
  await Movies.update(
    { _id: movie.id },
    {
      $inc: {
        numberInStock: -1,
      },
    }
  )

  return res.send(rental)
})

module.exports = router
