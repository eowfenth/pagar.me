const { defaultHeaders: headers } = require('./config');
const { capture: pagarmeCapture , charge: pagarmeCharge, refund: pagarmeRefund } = require('../../index');

const optionsController = (req, res) => {
    res.writeHead(204, { ...headers });
    res.end();
};

const charge = async (req, res) => {
    const { card = null, value = null } = req.body;
    if (!card || !value) {
        return errorController(req, res, 400, "Bad Request");
    };

    const { card, value, capture = true } = req.body;
    const response = await pagarmeCharge(card, value, capture);

    const status = response.error || 201;
    res.status(status).json(response);
};

const capture = async (req, res) => {
    const { id = null, value = null } = req.body;

    if (!id || !value || value <= 100) {
        return errorController(req, res, 400, "Bad Request");
    }
    
    const response = await pagarmeCapture(id, value);

    const status = response.error || 200;

    res.status(status).json(response);
};

const refund = async (req, res) => {
    const { id, value } = req.body;

    const response = await pagarmeRefund(id, value);

    const status = response.error || 200;

    res.status(status).json(response);
};

const errorController = (req, res, status = 404, message = "Not Found") => {
    res.status(status).json({
        error: status,
        data: {
            message,
        },
    });
};

module.exports = { capture, charge, refund };