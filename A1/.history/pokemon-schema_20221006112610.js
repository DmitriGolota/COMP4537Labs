const mongoose = require('mongoose')

let names = {
    english: {type: String, required: true, maxLength: 20},
    japanese: {type: String, required: true, maxLength: 20},
    chinese: {type: String, required: true, maxLength: 20},
    french: {type: String, required: true, maxLength: 20}
}

let pokemonSchema = new mongoose.Schema({
    id: Number,
    name: names,
    type: Array,
    base: Object
})



module.exports = mongoose.model('pokemon', pokemonSchema)