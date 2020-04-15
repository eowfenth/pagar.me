const controllers = require('./controllers');

const app = (req, res) => {
    switch (req.method) {
        case 'OPTIONS':
            controllers.optionsController(req, res);
            break;
        case 'POST':
            controllers.postController(req, res);
            break
        default:
            controllers.errorController(req, res);
            break;
    }
};

module.exports = app;