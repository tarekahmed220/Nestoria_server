import express from 'express'
import app from './app.js'

const port = 5000 //process.env.PORT || 5000

app.listen(port, () => console.log(` app listening on port ${port}!`))
/**
  nodemon server.js
 */