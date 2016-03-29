var users = require('../controllers/usersCtrl');

module.exports = function(app) {
	// Server API Routes
	app.param('userId', users.user);
 
	app.post('/api/users', users.create);
	app.post('/api/users/setup/', users.setup);
	app.get('/api/users', users.query);
	app.get('/api/users/:userId', users.show);
	app.put('/api/users/:userId', users.update);
	app.delete('/api/users/:userId', users.remove);

    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('*', function(req, res) {
        res.sendfile('./public/views/pages/login.html'); // load our public/index.html file
    });
}
