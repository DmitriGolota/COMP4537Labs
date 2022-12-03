const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3,
    maxLength: 20
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6,
    maxLength: 1000
  },
  date: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minLength: 3
  },
  token: {
    type: String,
    required: false,
    unique: true,
    trim: true,
    minLength: 3
  },
  active: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('pokeUser', schema) //pokeUser is the name of the collection in the db