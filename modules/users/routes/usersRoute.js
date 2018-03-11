'use strict';
var bodyParser = require('body-parser')
/**
 * Module dependencies.
 */
module.exports = function (app, router) {
  // users Routes
  var users = require('../controllers/usersController');

  router.get('/users', users.getUsers);
  router.get('/users/:id', users.getUsers);
  router.post('/users', users.saveUsers);
  router.put('/users', users.saveUsers);
   router.delete('/users/:id', users.deleteUsers);
  // load the BOM router in the app
  app.use('/api/v1', router);
  app.use( bodyParser.text({
    type : 'application/text-enriched', 
    limit: '1mb'
}) ); 

};
