const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
require("dotenv").config();

const connectDatabase = require("./config/database");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.use(compression());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "API do Projeto 2 rodando com MongoDB."
  });
});

const PORT = process.env.PORT || 3001;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});