const http = require("http");
const { capture , charge, refund } = require('../index');

const server = http.createServer(async (req, res) => {
    if (req.method === "POST") {
        let body = "";
        
        req.on('data', (chunk) => {
            body += chunk;
        });

        req.on('end', async () => {
            const request = JSON.parse(body);

            if (req.url === "/charge") {
                const card = request.card;
                const value = request.value;
                const response = await charge(card, value, true);

                res.write(JSON.stringify(response));
                res.end();
                return;
            }
    
            if (req.url === "/capture") {}
    
            if (req.url === "refund") {}
        });
    }
});

server.listen(8081);