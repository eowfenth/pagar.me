const { config: { PORT }} = require("./src/config");
const Controller = require("./src/controllers");

const express = require("express");
const server = express();

server.use(express.json());

server.post("/charge", Controller.charge);
server.post("/capture", Controller.capture);
server.post("/refund", Controller.refund);

server.listen(PORT);
