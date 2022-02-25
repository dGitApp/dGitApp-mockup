// Server for GunDB database - this has been set to localhost: 3030

const express = require('express')
const Gun = require('gun');
const app = express()
const port = 3030
app.use(Gun.serve);

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

Gun({ web: server });