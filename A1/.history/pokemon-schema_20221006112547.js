const mongoose = require('mongoose')
let pokemonSchema = new mongoose.Schema({
    id: Number,
    name: names,
    type: Array,
    base: Object
})

let names = {
    english: {type: String, required: true, maxLength: 20},
    japanese: {type: String, required: true, maxLength: 20},
    chinese: {type: String, required: true, maxLength: 20},
    french: {type: String, required: true, maxLength: 20}
}

module.exports = mongoose.model('pokemon', pokemonSchema)