const { PokemonBadRequest } = require('./errors')
const jwt = require('jsonwebtoken')
const pokeUser = require('./pokeUser')

const auth = (req, res, next) => {
  let token = req.query['appid']
  const user = pokeUser.findOne({ token: token }).then((user) => {
    if (user.active === true && user.token) {
      jwt.verify(user.token, process.env.TOKEN_SECRET)
      console.log(`authenticated user`)
      next()
    } else {
      next(new PokemonBadRequest("Access denied. Either you are not logged in or your token is invalid"))
    }
  }).catch((err) => {
    console.log(err)
    next(new PokemonBadRequest("Token is incorrect or missing"))
  })
}

const adminAuth = (req, res, next) => {
  pokeUser.findOne({ username: "admin" }).then((user) => {
    if (user.active === true && user.token) {
      jwt.verify(user.token, process.env.ACCESS_TOKEN_SECRET)
      console.log(`authenticated admin`)
      next()
    } else {
      next(new PokemonBadRequest("Access denied."))
    }
  }).catch((err) => {
    console.log(err)
    next(new PokemonBadRequest("Token is incorrect or missing"))
  })
}



module.exports = { auth, adminAuth }