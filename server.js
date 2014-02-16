var path = require('path'),
  express = require('express'),
  derby = require('derby'),
  racerBrowserChannel = require('racer-browserchannel'),
  liveDbMongo = require('livedb-mongo'),
  app = require(path.join(__dirname, 'app.js')),
  expressApp = module.exports = express(),
  redis = require('redis').createClient(),
  mongoUrl = 'mongodb://localhost:27017/editor'


var store = derby.createStore({
  db: liveDbMongo(mongoUrl + '?auto_reconnect', {
    safe: true
  }),
  redis: redis
})

var publicDir = path.join(__dirname, 'public')


expressApp
  .use(express.favicon())
  .use(express.compress())
  .use(app.scripts(store))
  .use(racerBrowserChannel(store))
  .use(store.modelMiddleware())
  .use(app.router())
  .use(expressApp.router)

expressApp.all('*', function(req, res, next) {
  return next('404: ' + req.url)
})