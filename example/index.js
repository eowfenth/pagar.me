const http = require("http");
const app  = require("./src/app");
const { config: { PORT }} = require("./src/config");

const server = http.createServer(app);

server.listen(PORT);