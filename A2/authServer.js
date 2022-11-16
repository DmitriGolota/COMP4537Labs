
const express = require("express")
const { handleError } = require("./errorHandler.js")
const dotenv = require("dotenv")
dotenv.config();
const pokeUser = require('./pokeUser.js')
const {connectDB} = require("./connectDB.js")
const {
  PokemonBadRequest,
  PokemonDbError,
} = require("./errors.js")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const app = express()
dotenv.config();
app.use(express.json())

// Async Wrapper
const asyncWrapper = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            console.log(error)
        }
    }
}

const startAuthServer = asyncWrapper(async () => {
  await connectDB();

  app.listen(process.env.AUTH_SERVER_PORT, (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${process.env.AUTH_SERVER_PORT}`);
  })
})

startAuthServer()

// Register User
app.post('/register', asyncWrapper(async (req, res) => {
    const { username, password, email } = req.body
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const userWithHashedPassword = { ...req.body, password: hashedPassword }

    const user = await pokeUser.create(userWithHashedPassword)
    res.send(user)
}))

// Login User
app.post('/login', asyncWrapper(async (req, res) => {
    const { username, password } = req.body
    const user = await pokeUser.findOne({ username: username })
    if (!user) {
        throw new PokemonBadRequest("User not found")
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
        throw new PokemonBadRequest("Password is incorrect")
    }

    await pokeUser.findOneAndUpdate({username: username}, {active: true})

    // Create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token)

    res.send(user)
}))

app.post('/logout', asyncWrapper(async (req, res) => {
    await pokeUser.findOneAndUpdate({username: req.body.username}, {active: false})
    res.clearCookie('admin')
    res.send("User Logged Out")
  }))

  app.use(handleError)

module.export  = {asyncWrapper}



