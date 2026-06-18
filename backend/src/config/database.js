const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10
    });

    console.log("MongoDB conectado com sucesso.");

    await createInitialData();
  } catch (error) {
    console.error("Erro ao conectar ao MongoDB:", error.message);
    process.exit(1);
  }
}

async function createInitialData() {

  const adminExists = await User.findOne({
    email: "admin@email.com"
  });

  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Administrador",
      email: "admin@email.com",
      password: hashedPassword
    });

    console.log("Usuário padrão criado: admin@email.com / 123456");
  }
}


module.exports = connectDatabase;