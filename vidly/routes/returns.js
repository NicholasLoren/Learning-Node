const express = require('express')
const auth = require('../middleware/auth')
const Joi = require('joi')
const validator = require("../middleware/validator")
const router = express.Router()
const { Rentals } = require('../models/rentals')
const { Movies } = require('../models/movies')



function validateReturn (rental) {
    const schema = Joi.object({
      movieId: Joi.objectId().required(),
      customerId: Joi.objectId().required(),
    })
  
    return schema.validate(rental)
  }

router.post('/', [auth,validator(validateReturn)], async (req, res) => {
  const { movieId, customerId } = req.body

  const rental = await Rentals.findOne({
    'movie._id': movieId,
    'customer._id': customerId,
  })

  if (!rental) return res.status(404).send('Rental not found')

  if (rental.returnDate)
    return res.status(400).send('Rental is already processed')

  rental.returnDate = new Date()
  const duration = rental.returnDate - rental.dateOut

  rental.rentalFee =
    duration >= 24 * 60 * 60 * 60 * 1000
      ? (duration / (24 * 60 * 60 * 60 * 1000)) * rental.movie.dailyRentalRate
      : rental.movie.dailyRentalRate

  await rental.save()

  //increment the number in stock
  await Movies.findByIdAndUpdate(movieId, { $inc: { numberInStock: 1 } })

  return res.status(200).send(rental)
})



module.exports = router
