
const express = require('express')
const middlewareRouter = require('./routes/middlewareRouter')
const bookRouter = require('./routes/bookRouter')

const app = express()

app.use(express.json())
app.use('/myUploads', express.static(__dirname+'routes/myUploads'))
app.use('/api', bookRouter)
app.use('/middlewareLoadBook', middlewareRouter)

const PORT = process.env.PORT || 3002
app.listen(PORT)

