const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    username: {
      type: String,
      required: false,
      trim: true,
      min: 3,
      max: 20
    },
    method: {
      type: String,
      required: true,
      enum: ['GET', 'POST', 'PUT', 'DELETE'],
      trim: true
    },
    endpoint: {
        type: String,
        required: true,
        unique: false,
    },
    responseStatus: {
        type: Number,
        required: true,
        unique: false,
        default: 200
    },
    date: {
      type: Date,
      default: Date.now
    },
  })
  
  module.exports.AccessLog = mongoose.model('accessLog', schema)