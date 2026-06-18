const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

const connectDatabase = require("./config/database");

const authRoutes = require("./routes/authRoutes");

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
    message: "Backend do Projeto 2 rodando."
  });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});