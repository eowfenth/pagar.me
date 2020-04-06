const { defaultHeaders: headers } = require('./config');
const { capture , charge, refund } = require('../../index');

const optionsController = (req, res) => {
    res.writeHead(204, { ...headers });
    res.end();
};

const chargeController = async (req, res, request) => {
    console.log(request);
    if (!request || !request.card || !request.value) {
        return errorController(req, res, 400, "Bad Request");
    };

    const { card, value } = request;
    const response = await charge(card, value, true);

    const status = response.error || 201;
    res.writeHead(status, {
        ...headers,
        'Content-Type' : 'application/json'
    });
    res.write(JSON.stringify(response));
    res.end();
};

const captureController = async (req, res, request) => {
    const { id, value } = request;
    
    const response = await capture(id, value);

    const status = response.error || 200;
    res.writeHead(status, {
        ...headers,
        'Content-Type' : 'application/json'
    });
    res.write(JSON.stringify(response));
    res.end();
};

const refundController = async (req, res, request) => {
    const { id, value } = request;
    const response = await refund(id, value);

    const status = response.error || 200;
    res.writeHead(status, {
        ...headers,
        'Content-Type' : 'application/json'
    });
    res.write(JSON.stringify(response));
    res.end();
};

const postController = (req, res) => {
    let body = "";
    let request = null;
        
    req.on('data', (chunk) => {
        console.log(chunk);
        body += chunk;
    });

    req.on('end', async () => {
        if (!body) {
            return errorController(req, res, 400, "Bad Request");
        }

        request = JSON.parse(body);

        switch (req.url) {
            case "/charge":
                return chargeController(req, res, request);
            case "/capture":
                return captureController(req, res, request);
            case "/refund":
                return refundController(req, res, request);
            default:
                return errorController(req, res);
        }
    });

};

const errorController = (req, res, status = 404, message = "Not Found") => {
    res.writeHead(status, {
        ...headers,
        'Content-Type' : 'application/json'
    });

    res.write(JSON.stringify({
        error: status,
        data: {
            message,
        },
    }));
    res.end();
};

module.exports = { errorController, postController, optionsController };