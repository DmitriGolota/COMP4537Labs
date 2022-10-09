const express = require('express')
const mongoose = require('mongoose')
const pokemonSchema = require('./pokemon-schema')
const cors = require('cors')


const app = express()
const port = 8000

// URLs
const POKEDEX_URL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json'
const POKEMON_TYPES_URL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json'
const MONGODB = 'mongodb+srv://root:G3YrA9HKolMud0m5@cluster0.fha6ifp.mongodb.net/A1-Pokedex?retryWrites=true&w=majority'

app.use(express.json())
app.use(cors())

// Data processing
async function getPokemonData() {
    let data = await fetch(POKEDEX_URL)
    return data.json()
}

async function getTypes() {
    let data = await fetch(POKEMON_TYPES_URL)
    return data.json()
}

async function getImageURLString(pokemonID) {
    console.log((typeof (pokemonID) === "string"))
    console.log(pokemonID)
    if ((pokemonID < 1 || 809 < pokemonID) || (typeof (pokemonID) !== "string")) {
        return { URL: null }
    }
    // Append to string decimal places
    if (pokemonID.length == 1) {
        pokemonID = '00' + pokemonID
    } else if (pokemonID.length == 2) {
        pokemonID = '0' + pokemonID
    }

    return `https://github.com/fanzeyi/pokemon.json/blob/master/images/${pokemonID}.png`
}

async function populateDatabase() {
    let pokemonData = await getPokemonData()
    
    for (let i = 0; i < pokemonData.length; i++) {
        let newPokemon = new pokemonSchema({
            id: pokemonData[i].id,
            name: pokemonData[i].name,
            type: pokemonData[i].type,
            base: pokemonData[i].base
        })
        newPokemon.save().then(newPokemonEntry => {
            // console.log(newPokemonEntry)
        }).catch(err => {
            console.log(err)
        })
    }

}

app.listen(process.env.PORT || 8000, async function (err) {
    try {
        await mongoose.connect(MONGODB, { dbName: 'A1-Pokedex' })
        console.log("Connected to DB Successfully!")
        // Reset DB
        await pokemonSchema.deleteMany()
        populateDatabase()
        console.log("Database Reloaded")

    } catch (error) {
        console.log('db error');
    }
    console.log(`Example app listening on port ${port}`)
})

app.get('/', async (req, res) => {
    res.json('Welcome to Dmitri\'s Pokemon API Server')
})


app.get('/api/v1/pokemons', async (req, res) => {
    var count = parseInt(req.query.count)
    var after = parseInt(req.query.after)
    await pokemonSchema.find({ id: { $gt: after, $lte: (after + count) } }).sort('id')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error(err);
            res.json('Error Reading Database');
        })
})
// create new pokemon
app.post('/api/v1/pokemon', (req, res) => {
    pokemonSchema.find({id: req.body.id})
    .then(data => {
        if (data.length == 0) {
            pokemonSchema.create(req.body, function (err, result) {
                if (err) {
                    console.log(err)
                    res.json({errMsg: 'ValidationError: check your ...'})
                } else {
                    console.log(result)
                    console.log('New Pokemon Saved Successfully')
                    res.json({success: 'New Pokemon Saved Successfully' })
                }
            })
        } else {
            res.json({errMsg : {
                code: "11000"
            }});
        }
    })
    .catch(err => {
        console.error(err);
        res.json({errMsg: "Cast Error: pass pokemon id between 1 and 811"})
    })

})

// - get a pokemon
app.get('/api/v1/pokemon/:id', async (req, res) => {
    pokemonSchema.find({ id: req.params.id })
        .then(data => {
            if (data.length == 0) {
                res.json({ Error: 'Pokemon Not Found' })
            } else {
                res.json(data);
            }
        })
        .catch(err => {
            console.error(err);
            res.json({errMsg: "Cast Error: pass pokemon id between 1 and 811"})
        })

})

// - get a pokemon Image URL
app.get('/api/v1/pokemonImage/:id', async (req, res) => {
    let imageURL = await getImageURLString(req.params.id)
    res.json({ URL: imageURL })
})

// - insert a whole pokemon document
// update if pokemon found, if pokemon not found, insert into db
app.put('/api/v1/pokemon/:id', (req, res) => {
    const { _id, ...rest } = req.body;
    pokemonSchema.updateOne({ id: req.params.id }, { $set: { ...rest } }, { upsert: true, runValidators: true }, function (err, result) {
        if (err) {
            console.log('not found')
            console.log(err)
            res.json({errMsg: "ValidationError: check your ..."})
            return
        } else {
            console.log('found, insert here')
            console.log(result)
        }
    })
    res.json({
        msg: 'Updated successfully'
    })
})

// - patch a pokemon document or a portion of the pokemon document
app.patch('/api/v1/pokemon/:id', (req, res) => {
    const { _id, ...rest } = req.body;
    pokemonSchema.updateOne({ id: req.params.id }, { $set: { ...rest } }, { runValidators: true }, function (err, res) {
        if (err) {
            console.log(err)
        } else {

        }
    })
    res.json()

})

// - delete a  pokemon 
app.delete('/api/v1/pokemon/:id', (req, res) => {
    let response = null
    pokemonSchema.deleteOne({ id: req.params.id }, function (err, result) {
        if (err) {
            console.log(err);
            response = { errMsg: err }
        } else {
            if (result.deletedCount === 0) {
                response = { errMsg: "Pokemon not found" }

            } else {
                response = { msg: 'Deleted Successfully' }

            }
            console.log(result)
        }
        res.json(response)
    })
    return
})              