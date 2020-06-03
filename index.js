const axios = require("axios");
const config = require("./config");

const client = (api_key) => {
    if (!api_key) {
        throw 'You need an api key!';
    };

    const pagarme_client = axios.create({
        auth: {
            username: api_key,
            password: 'x',
        },
        baseURL: config.PAGARME_BASE_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const call = async (url, method, data) => {
        const options = {
            url,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            data,
        };
    
        let response = null;
        try {
            response = await pagarme_client.request(options);
        } catch (err) {
            if (err.response) {
                console.error(err.response.data);
                const { status, statusText } = err.response;
                return {
                    error: status,
                    data: {
                        message: statusText,
                    },
                };
            }
    
            return {
                error: 502,
                data: {
                    message: "Bad Gateway",
                },
            };
        }
    
        if (response.status !== 200) {
            return {
                error: response.status,
                data: {
                    message: response.message,
                },
            };
        };
    
        return {
            data: response.data,
            error: null,
        };
    }

    const charge = async (card, value, capture = true) => {
        return call("/transactions", 'post', { ...card, capture, amount: value });
    };
    
    const capture = async (id, value) => {
        return call(`/transactions/${id}/capture`, 'post', { amount : value });
    };
    
    const refund = async (id, value) => {
        return call(`/transactions/${id}/refund`, 'post', { amount: value });
    };

    
    return {
        charge,
        refund,
        capture,
    };
};

module.exports = client;