const axios = require("axios");

const charge = async (card, value, capture = true) => {
    const {
        card_number,
        card_holder_name,
        card_expiration_date,
        card_cvv
    } = card;

    const data = {
        amount: value,
        card_number,
        card_holder_name,
        card_expiration_date,
        card_cvv,
        capture,
    };

    return call("/transactions", 'post', data);
};

const capture = async (id, value) => {
    const data = {
        amount: value,
    };
    return call(`/transactions/${id}/capture`, 'post', data);
};

const refund = async (id, value) => {
    const data = {
        amount: value,
    };
    return call(`/transactions/${id}/refund`, 'post', data);
};

const call = async (url, method, data) => {
    const api_key = "ak_test_UmTegBDBoqn6Bbmjahxb5OUR5k1hWq";
    const options = {
        baseURL: "https://api.pagar.me/1",
        url: url,
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        data: {
            ...data,
            api_key,
        },
    };

    try {
        const response = await axios.request(options);
    } catch (err) {
        console.log(JSON.stringify(err));
    }

    if (response.status !== 200) {
        return {
            error: response.status,
            data: {
                message: response.message,
            },
        }
    };

    return {
        data: response.data,
        error: null,
    };
}

module.exports = {
    capture, charge, refund,
};