const express = require('express')
const router = express.Router()
const { Genre, validate } = require('../models/genres')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateId = require('../middleware/validateId')
//Routes for genre

//create a function to handle the exception for every route

//Get all genres
router.get('/', async (req, res, next) => {
  const genres = await Genre.find()
  res.send(genres)
})

//Get a single course

router.get('/:id', validateId, async (req, res) => {
  const { id } = req.params
  const genre = await Genre.findById(id)

  if (!genre) return res.status(404).send('Could not find genre with given ID')
  return res.send(genre)
})

//Create a genre

router.post('/', auth, async (req, res) => {
  //First validate
  const { error } = validate(req.body)

  if (error) {
    return res.status(400).send(error.details[0].message)
  }

  //If everything is okay, add new record
  const genre = new Genre({ name: req.body.name })
  await genre.save()
  res.status(200).send(genre)
})

//Delete record

router.delete('/:id', [auth, admin, validateId], async (req, res) => {
  const { id } = req.params
  const genre = await Genre.findByIdAndRemove(id)
  res.send(genre)
})

//update genre

router.put('/:id', [auth,admin,validateId], async (req, res) => {
  const { id } = req.params
  //First validate
  const { error } = validate(req.body)
  if (error) {
    return new Error(error.details[0].message)
  }
  const genre = await Genre.findByIdAndUpdate(
    id,
    { name: req.body.name },
    { new: true }
  )
  res.send(genre)
})

module.exports = router
