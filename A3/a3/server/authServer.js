
const express = require("express")
const { handleError } = require("./errorHandler.js")
const dotenv = require("dotenv")
dotenv.config();
const pokeUser = require('./pokeUser.js')
const { connectDB } = require("./connectDB.js")
const cors = require('cors')

const {
  PokemonBadRequest,
  PokemonDbError,
} = require("./errors.js")

const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const app = express()
dotenv.config();
app.use(express.json())
app.use(cors({
  exposedHeaders: ['auth-token-access', 'auth-token-refresh', 'username']
}))

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

  const accessToken = jwt.sign({ user: user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' })
  const refreshToken = jwt.sign({ user: user }, process.env.REFRESH_TOKEN_SECRET)
  refreshTokens.push(refreshToken)

  res.header('auth-token-access', accessToken)
  res.header('auth-token-refresh', refreshToken)
  res.header('username', user.username)

  res.send(user)
}))

app.post('/logout', asyncWrapper(async (req, res) => {
  await pokeUser.findOneAndUpdate({ username: req.body.username }, { active: false })
  res.clearCookie('admin')
  res.send("User Logged Out")
}))


app.use(handleError)

let refreshTokens = []
app.post('/requestNewAccessToken', asyncWrapper(async (req, res) => {
  const refreshToken = req.header('auth-token-refresh')
  if (!refreshToken) {
    throw new PokemonBadRequest("No Token: Please provide a token.")
  }
  if (!refreshTokens.includes(refreshToken)) { // replaced a db access
    console.log("token: ", refreshToken);
    console.log("refreshTokens", refreshTokens);
    throw new PokemonAuthError("Invalid Token: Please provide a valid token.")
  }
  try {
    const payload = await jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    const accessToken = jwt.sign({ user: payload.user }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '120s' })
    res.header('auth-token-access', accessToken)
    res.send("Success")
  } catch (error) {
    throw new PokemonBadRequest("Invalid Token: Please provide a valid token.")
  }
}))
module.export = { asyncWrapper }



