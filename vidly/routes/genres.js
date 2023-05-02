const express = require('express')
const router = express.Router()
const { Genre, validate } = require('../models/genres')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
//Routes for genre

//create a function to handle the exception for every route



//Get all genres
router.get('/', async (req, res, next) => {
  throw new Error("Could not find genres")
    const genres = await Genre.find()
    res.send(genres) 
})

//Get a single course

router.get('/:id', (req, res) => {
  const getGenre = async () => {
    const { id } = req.params
    const genre = await Genre.find({ _id: id })

    return genre
  }
  getGenre()
    .then((genre) => res.send(genre))
    .catch((err) => {
      console.log(err.message)
      return res.status(404).send('OOPS! genre not found.')
    })
})

//Create a genre

router.post('/', auth, (req, res) => {
  const createGenre = async () => {
    //First validate
    const { error } = validate(req.body)

    if (error) {
      return res.status(400).send(error.details[0].message)
    }

    //If everything is okay, add new record

    const genre = new Genre({ name: req.body.name })

    try {
      return await genre.save()
    } catch (err) {
      throw new Error(err)
    }
  }

  createGenre()
    .then((genre) => res.send(genre))
    .catch((err) => {
      console.log(err.message)
      return res.status(404).send('Could not create new genre')
    })
})

//Delete record

router.delete('/:id', [auth, admin], (req, res) => {
  const removeGenre = async () => {
    //Find the genre

    try {
      const { id } = req.params
      return await Genre.findByIdAndRemove(id)
    } catch (err) {
      return err
    }
  }

  removeGenre()
    .then((genre) => res.send(genre))
    .catch((err) => {
      console.log(er)
      res.status(404).send(err)
    })
})

//update genre

router.put('/:id', auth, (req, res) => {
  const updateGenre = async () => {
    //Find the genre
    const { id } = req.params

    //First validate
    const { error } = validate(req.body)

    if (error) {
      return new Error(error.details[0].message)
    }

    return await Genre.findByIdAndUpdate(
      id,
      { name: req.body.name },
      { new: true }
    )
  }

  updateGenre()
    .then((genre) => res.send(genre))
    .catch((err) => res.status(400).send(err.message))
})

module.exports = router
