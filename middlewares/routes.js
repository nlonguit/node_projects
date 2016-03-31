var users = require('../controllers/usersCtrl');
var authentication = require('./authentication');

module.exports = function(app) {
	// Server API Routes
	app.param('userId', users.user);
 
	app.post('/api/users', authentication.verifyToken, requireAuth, users.create);
	app.post('/api/users/setup/', authentication.verifyToken, requireAuth, users.setup);
	app.get('/api/users', authentication.verifyToken, requireAuth, users.query);
	app.get('/api/users/:userId', authentication.verifyToken, requireAuth, users.show);
	app.put('/api/users/:userId', authentication.verifyToken, requireAuth, users.update);
	app.delete('/api/users/:userId', authentication.verifyToken, requireAuth, users.remove);

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('/', function(req, res) {
        res.sendFile('blank.html', {root: './public/views/pages'}); // load our public/index.html file
    });

    var requireAuth = function(req, res, next) {
        if (!req.user) {
            res.status(401).send({success: false, message: 'Not Authorized.'});
        } else {
            next();
        }
    }
}
