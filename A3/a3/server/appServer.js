const express = require('express')
const mongoose = require('mongoose')
const pokemonSchema = require('./pokemon-schema')
const cors = require('cors')
const fetch = require('node-fetch')
const dotenv = require("dotenv")
const { routeLogger } = require("./routeLogger.js")
const { adminAuth } = require('./auth')
const cookieParser = require('cookie-parser')
const { AccessLog } = require("./logServerAccessModel.js")


const app = express()

// URLs
const POKEDEX_URL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json'
const POKEMON_TYPES_URL = 'https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json'

const {
    PokemonBadRequest,
    PokemonBadRequestMissingID,
    PokemonBadRequestMissingAfter,
    PokemonDbError,
    PokemonNotFoundError,
    PokemonDuplicateError,
    PokemonNoSuchRouteError,
    PokemonCastError,
    PokemonValidationError
} = require("./errors.js");


dotenv.config();
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// Async Wrapper
const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            next(error)
        }
    }
}

const previousDate = () => {
    const dateLimit = 10;
    const date = new Date()
    date.setDate(date.getDate() - dateLimit)
    return date
}

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
        }).catch(err => {
            console.log(err)
        })
    }

}

app.listen(process.env.PORT, async function (err) {
    try {
        await mongoose.connect(process.env.DB_STRING, { dbName: 'A1-Pokedex' })
        console.log("Connected to DB Successfully!")
        // Reset DB
        await pokemonSchema.deleteMany()
        populateDatabase()
        console.log("Database Reloaded")

    } catch (error) {
        console.log('db error');
    }
    console.log(`Example app listening on port ${process.env.PORT}`)
})

app.use(routeLogger)
app.get("/api/v1/pokemonsAdvancedFiltering", asyncWrapper(async (req, res) => {
    const { id,
        base,
        "base.HP": baseHP,
        "base.Attack": baseAttack,
        "base.Defense": baseDefense,
        "base.Speed Attack": baseSpeedAttack,
        "base.Speed Defense": baseSpeedDefense,
        "base.Speed": baseSpeed,
        type,
        "name.english": nameEnglish,
        "name.japanese": nameJapanese,
        "name.chinese": nameChinese,
        "name.french": nameFrench,
        page,
        sort,
        filteredProperty,
        hitsPerPage
    } = req.query

    // Regex to split strings properly
    const elements = req.query.comparisonOperators.split(/,\s*/)

    function mapOperator(query) {
        const operatorMap = {
            '<': '$lt',
            '<=': '$lte',
            '>': '$gt',
            '>=': '$gte',
            '==': '$eq',
            '!=': '$ne'
        }
        return operatorMap[query]
    }

    queryBuild = []
    elements.forEach(element => {
        let splitted = element.split(/([!<>=|]=?)/g)
        let stat = splitted[0],
            mongooseOperator = splitted[1],
            value = splitted[2]
        mongooseOperator = mapOperator(mongooseOperator)
        query = {
            stat: stat,
            mongooseOperator: mongooseOperator,
            value: value
        }

        queryBuild.push(query)
    })


    console.log("Build:", ...queryBuild)

    // Query is built but object needs to be processed to accomplish query

    queryBuild.forEach(element => {
        queryItem = ("{" + element.stat + ":" + "{" + element.mongooseOperator + ":" + element.value + "}" + "}")
        queryItem = JSON.parse(queryItem)
        const mongooseQuery = pokemonSchema.find(queryItem)
        console.log(mongooseQuery)
    })

    // Query is built and ready to execute, just ran out of time with converting to the proper structure for the query

    const mongooseQuery = pokemonSchema.find(query)

    const pokemons = await mongooseQuery;
    console.log(pokemons)

    res.send({
        hits: pokemons,
        key: "asldkasdk"
    })
}))

app.patch("/api/v1/pokemonsAdvancedUpdate", asyncWrapper(async (req, res) => {
    const { _id, ...rest } = req.body;

    const pushOperator = req.query.pushOperator.split(',')

    typeParams = []
    pushOperator.forEach(element => {
        element = element.replace(/\s|\[|\]/g, '')
        typeParams.push(element)
    });

    // appends the types to the pokemon-> but not in an object that contains language version of it
    typeParams.forEach(element => {
        pokemonSchema.updateOne({ id: req.query.id }, { $push: { type: element } }, { runValidators: true }, function (err, result) {
            if (err) {
                console.log(err)
                return
            } else {
                if (result.modifiedCount == 0) {
                    return
                }
            }
        })
    })

    res.json({ successMsg: 'Updated Successfully' })
}))

app.get('/api/v1/pokemons', asyncWrapper(async (req, res, next) => {
    var count = parseInt(req.query.count)
    var after = parseInt(req.query.after)
    await pokemonSchema.find({ id: { $gt: after, $lte: (after + count) } }).sort('id')
        .then(data => {
            res.json(data);
        })
        .catch(err => {
            console.error(err);
            // res.status(422).json({ errMsg: 'Error Reading Database' });
            return (next(new PokemonDbError("Error Reading Database")))
        })
}))



app.get('/api/doc', (req, res) => {
    res.sendFile('/Users/dimagolota/Documents/Term 4/COMP 4537 - Internet Software Architecture/A1/APIDoc.md')
})



// Below are Admin routes
app.use(adminAuth);
// create new pokemon
app.post('/api/v1/pokemon', (req, res, next) => {
    if (!req.body.id) return (next(new PokemonBadRequestMissingID()))
    pokemonSchema.find({ id: req.body.id })
        .then(data => {
            if (poke.length != 0) return (next(new PokemonDuplicateError()));
            else if (data.length == 0) {
                pokemonSchema.create(req.body, function (err, result) {
                    if (err) {
                        return (next(new PokemonValidationError(err)))
                        // res.json({ errMsg: 'ValidationError: check your ...' })
                    } else {
                        console.log(result)
                        console.log('New Pokemon Saved Successfully')
                        res.json({ success: 'New Pokemon Saved Successfully' })
                    }
                })
            } else {
                res.json({
                    errMsg: {
                        code: "11000"
                    }
                });
            }
        })
        .catch(err => {
            return (next(new PokemonCastError()))
            // res.json({ errMsg: "Cast Error: pass pokemon id between 1 and 811" })
        })

})

// - get a pokemon
app.get('/api/v1/pokemon/:id', asyncWrapper(async (req, res, next) => {
    pokemonSchema.find({ id: req.params.id })
        .then(data => {
            if (data.length == 0) {
                return (next(new PokemonNotFoundError()))
                // res.status(404).json({ Error: 'Pokemon Not Found' })
            } else {
                res.json(data);
            }
        })
        .catch(err => {
            return (next(new PokemonCastError()))
            // res.status(422).json({ errMsg: "Cast Error: pass pokemon id between 1 and 811" })
        })

}))

// - get a pokemon Image URL
app.get('/api/v1/pokemonImage/:id', asyncWrapper(async (req, res) => {
    let imageURL = await getImageURLString(req.params.id)
    res.json({ URL: imageURL })
}))

// - insert a whole pokemon document
// update if pokemon found, if pokemon not found, insert into db
app.put('/api/v1/pokemon/:id', (req, res, next) => {
    const { _id, ...rest } = req.body;
    pokemonSchema.updateOne({ id: req.params.id }, { $set: { ...rest } }, { upsert: true, runValidators: true }, function (err, result) {
        if (err) {
            return (next(new PokemonValidationError()))
            // res.status(422).json({ errMsg: "ValidationError: check your ..." })
        } else {
            if (result.upsertedCount > 0) {
                return (next(new PokemonNotFoundError))
                // res.status(404).json({ msg: 'Not found' })
            }
        }
        res.json({
            msg: 'Updated Successfully'
        })
    })

})

// - patch a pokemon document or a portion of the pokemon document
app.patch('/api/v1/pokemon/:id', asyncWrapper(async (req, res, next) => {
    const { _id, ...rest } = req.body;
    pokemonSchema.updateOne({ id: req.params.id }, { $set: { ...rest } }, { runValidators: true }, function (err, result) {
        if (err) {
            console.log(err)
            return (next(new PokemonDbError(err)))
            // res.json({ errMsg: 'Dangerous operation' })
        } else {
            if (result.modifiedCount == 0) {
                return (next(new PokemonNotFoundError()))
                // res.status(404).json({ msg: 'pokemon not found' })
            }
        }
        res.json({
            msg: 'Updated successfully'
        })
        return
    })
}))

// - delete a  pokemon 
app.delete('/api/v1/pokemon/:id', asyncWrapper(async (req, res, next) => {
    console.log(req.params.id)
    pokemonSchema.deleteOne({ id: req.params.id }, function (err, result) {
        if (err) {
            console.log(err);
            return (next(new PokemonDbError(err)))
            // res.status(422).json({ errMsg: err })
        } else {
            if (result.deletedCount === 0) {
                return (next(new PokemonNotFoundError("")));
                // res.status(404).json({ errMsg: "Pokemon not found" })

            } else {
                res.json({ msg: 'Deleted Successfully' })
            }
        }
    })
    return
}))

app.get('/report', async (req, res) => {
    const id = req.query.id
    switch (id) {
        case "1":
            let usernames = new Set()
            AccessLog.find({ date: { $gte: previousDate() } }, (err, docs) => {
                if (err) {
                    console.log(err)
                    res.json({ msg: "Error" })
                } else {
                    docs.forEach(doc => {
                        usernames.add(doc.username)
                    })
                    res.json({ msg: "Success", report: [...usernames] })
                }
            })
            break;
        case "2":
            let userCount = {}
            AccessLog.find({ date: { $gte: previousDate() } }, (err, docs) => {
                if (err) {
                    console.log(err)
                    res.json({ msg: "Error" })
                } else {
                    docs.forEach(doc => {
                        if (userCount[doc.username]) {
                            userCount[doc.username] += 1
                        } else {
                            userCount[doc.username] = 1
                        }
                    })
                    res.json({ msg: "Success", report: userCount })
                }
            })
            break;
        case "3":
            let endpoint = {}
            AccessLog.find({ date: { $gte: previousDate() } }, (err, docs) => {
                if (err) {
                    console.log(err)
                    res.json({ msg: "Error" })
                } else {
                    docs.forEach(doc => {
                        if (endpoint[doc.endpoint]) {
                            if (endpoint[doc.endpoint][doc.username]) {
                                endpoint[doc.endpoint][doc.username] += 1
                            } else {
                                endpoint[doc.endpoint][doc.username] = 1
                            }
                        } else {
                            // need to add this bluff to do the second line
                            endpoint[doc.endpoint] = { "num": 1 }
                            endpoint[doc.endpoint][doc.username] = 1
                        }
                    })
                    console.log(delete endpoint["num"])
                }
                res.json({ msg: "Success", report: endpoint })
            })
            break;
        case "4":
            AccessLog.find({ responseStatus: { $gte: 400, $lt: 500 }, date: { $gte: previousDate() } }, (err, docs) => {
                if (err) {
                    console.log(err)
                    res.json({ msg: "Error" })
                } else {
                    res.json({ msg: "Success", report: docs })
                }
            })
            break
        case "5":
            AccessLog.find({ responseStatus: { $gte: 400, $lt: 600 }, date: { $gte: previousDate() } }, (err, docs) => {
                if (err) {
                    console.log(err)
                    res.json({ msg: "Error" })
                } else {
                    res.json({ msg: "Success", report: docs })
                }
            })
            break
        default:
            res.json({ msg: "Invalid report id" })
    }
})

