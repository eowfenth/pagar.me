const axios = require("axios");
const config = require("./config");

const call = async (url, method, data) => {
    const options = {
        baseURL: config.PAGARME_BASE_URL,
        url: url,
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            ...data,
            api_key: config.API_KEY,
        },
    };

    let response = null;
    try {
        response = await axios.request(options);
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
    /**
     * Tratamento de erro;
     */

    if (!card || !value || value <= 100) {
        return {
            data: {
                message: 'Bad Request'
            },
            error: 400,
        };
    }

    const {
        card_number,
        card_holder_name,
        card_expiration_date,
        card_cvv,
    } = card;

    const data = {
        amount: value,
        card_number,
        card_holder_name,
        card_expiration_date,
        card_cvv,
        capture,
    };

    return call("/transactions", 'post', { ...card, capture, amount: value });
};

const capture = async (id, value) => {
    return call(`/transactions/${id}/capture`, 'post', { amount : value });
};

const refund = async (id, value) => {
    return call(`/transactions/${id}/refund`, 'post', { amount: value });
};

module.exports = {
    capture, charge, refund,
};