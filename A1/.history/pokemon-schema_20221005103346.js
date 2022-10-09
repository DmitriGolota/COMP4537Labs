const mongoose = require('mongoose')
let pokemonSchema = new mongoose.Schema({
    id: Number,
    name: Object,
    type: Array,
    base: Object
})

module.exports = mongoose.model('pokemon', pokemonSchema)