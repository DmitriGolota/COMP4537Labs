const handleError = (err, req, res, next) => {
  if (err.pokeErrCode)
    res.status(err.pokeErrCode)
  else
    res.status(500)
  console.log(err)
  res.send(err.message)
}

module.exports = { handleError }