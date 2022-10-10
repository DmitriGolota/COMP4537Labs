const express = require('express')
const mongoose = require('mongoose')
const pokemonSchema = require('./pokemon-schema')
const cors = require('cors')
const { default: axios } = require('axios');


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
    axios.get(POKEDEX_URL)
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
    let types = await getTypes()
    
    for (let i = 0; i < pokemonData.length; i++) {
        currentPokemonTypes = [];
        pokemonData[i].type.forEach(element => {
            currentPokemonTypes.push((types.find(({ english }) => english == element)))
        });

        let newPokemon = new pokemonSchema({
            id: pokemonData[i].id,
            name: pokemonData[i].name,
            type: currentPokemonTypes,
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


app.get('/api/v1/pokemons', async (req, res) => {
    var count = parseInt(req.query.count)
    var after = parseInt(req.query.after)
    await pokemonSchema.find({ id: { $gt: after, $lte: (after + count) } }).sort('id')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error(err);
            res.status(422).json({errMsg:'Error Reading Database'});
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
                    res.status(422).json({errMsg: 'ValidationError: check your ...'})
                } else {
                    console.log(result)
                    console.log('New Pokemon Saved Successfully')
                    res.json({success: 'New Pokemon Saved Successfully' })
                }
            })
        } else {
            res.status(422).json({errMsg : {
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
                res.status(404).json({ Error: 'Pokemon Not Found' })
            } else {
                res.json(data);
            }
        })
        .catch(err => {
            console.error(err);
            res.status(422).json({errMsg: "Cast Error: pass pokemon id between 1 and 811"})
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
            res.status(422).json({errMsg: "ValidationError: check your ..."})
            return
        } else {
            if(result.upsertedCount > 0) {
                res.status(404).json({msg: 'Not found'})
                return
            }
        }
        res.json({
            msg: 'Updated successfully'
        })
    })
    
})

// - patch a pokemon document or a portion of the pokemon document
app.patch('/api/v1/pokemon/:id', (req, res) => {
    const { _id, ...rest } = req.body;
    pokemonSchema.updateOne({ id: req.params.id }, { $set: { ...rest } }, { runValidators: true }, function (err, result) {
        if (err) {
            console.log(err)
            res.status(422).json({errMsg: 'Dangerous operation'})
            return
        } else {
            if(result.modifiedCount == 0) {
                res.status(404).json({msg: 'pokemon not found'})
                return
            }
        }
        res.json({
            msg: 'Updated successfully'
        })
        return
    })
})

// - delete a  pokemon 
app.delete('/api/v1/pokemon/:id', (req, res) => {
    pokemonSchema.deleteOne({ id: req.params.id }, function (err, result) {
        if (err) {
            console.log(err);
            res.status(422).json({ errMsg: err })
        } else {
            if (result.deletedCount === 0) {
                res.status(404).json({ errMsg: "Pokemon not found" })

            } else {
                res.json({ msg: 'Deleted Successfully' })
            }
        }
    })
    return
})   

app.get('/api/doc', (req, res) => {
    res.sendFile('/Users/dimagolota/Documents/Term 4/COMP 4537 - Internet Software Architecture/A1/APIDoc.md')
})

app.get('/*', async (req, res) => {
    res.status(404).json({msg: 'Improper route. Check API docs plz.'})
})
