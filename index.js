'use strict'

/******************************************************************************\
  Module imports
\******************************************************************************/

let bodyBuilder = require('./middleware/bodyBuilder')
let bodyParser = require('koa-bodyparser')
let compress = require('koa-compress')
let errorHandler = require('./middleware/errorHandler')
let getItemTemplates = require('./middleware/getItemTemplates')
let koa = require('koa')
let logger = require('koa-logger')
let login = require('./middleware/login')
let router = require('koa-router')()





/******************************************************************************\
  Route controllers
\******************************************************************************/

let inventory = require('./controllers/inventory')
let pokedex = require('./controllers/pokedex')
let pokemon = require('./controllers/pokemon')
let templates = require('./controllers/templates')
let config = require('./config.json')





/******************************************************************************\
  Initialize the app
\******************************************************************************/
let app = koa()





/******************************************************************************\
  Middleware
\******************************************************************************/

app.use(function * (next) {
  this.state = {
    password: config.password,
    username: config.username
  }

  yield next
})

app.use(compress())

app.use(errorHandler())

app.use(logger())

app.use(bodyParser())

app.use(bodyBuilder())

app.use(login())

app.use(getItemTemplates())







/******************************************************************************\
  Routes
\******************************************************************************/

router.post('/evolve', pokemon.evolve)

router.get('/inventory', inventory.inventory)

router.get('/candies', inventory.candies)

router.get('/items', inventory.items)

router.get('/pokedex/:no', pokedex)

router.get('/pokemon', inventory.pokemon)

router.post('/power-up', pokemon.powerUp)

router.get('/templates', templates.templates)

router.post('/transfer', pokemon.transfer)

app.use(router.routes())
app.use(router.allowedMethods())





/******************************************************************************\
  Start the app
\******************************************************************************/

console.log('Listening on port', process.env.PORT || 3001)
app.listen(process.env.PORT || 3001)
