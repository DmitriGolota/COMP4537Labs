const { AccessLog } = require('./logServerAccessModel.js')
const { PokemonBadRequest } = require('./errors')


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

const ignoredRoutes = ['/report']

const routeLogger = asyncWrapper( async (req, res, next) => {
    try {
        if (!ignoredRoutes.includes(req.path)) {
            const newLog = await AccessLog.create({
                username: req.header('username')? req.header('username') : 'xxxxxxx',
                endpoint: req.path,
                method: req.method,
            })
            res.locals.log = newLog
            next()
        } else {
            next()
        }
    } catch (error) {
        throw new PokemonBadRequest("Error occured while logging route")
        
    }
})

module.exports = { routeLogger }