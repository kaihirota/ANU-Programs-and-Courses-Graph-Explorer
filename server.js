const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 5000
// import dotenv from "dotenv";
// dotenv.config();

const publicPath = path.join(__dirname, 'public')
app.use(express.static(publicPath))

app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'))
})

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`)
})
