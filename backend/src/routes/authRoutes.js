const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");

const User = require("../models/User");
const Log = require("../models/Log");

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    error: "Muitas tentativas de login. Tente novamente mais tarde."
  }
});

router.post(
  "/login",
  loginLimiter,
  [
    body("email")
      .notEmpty()
      .withMessage("O email é obrigatório.")
      .isEmail()
      .withMessage("Informe um email válido.")
      .normalizeEmail(),

    body("password")
      .notEmpty()
      .withMessage("A senha é obrigatória.")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: "Erro de validação.",
          details: errors.array()
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        await Log.create({
          action: "LOGIN_ERROR",
          description: `Tentativa de login com email inexistente: ${email}`
        });

        return res.status(401).json({
          error: "Email ou senha inválidos."
        });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        await Log.create({
          action: "LOGIN_ERROR",
          description: `Tentativa de login com senha incorreta: ${email}`,
          userId: user._id
        });

        return res.status(401).json({
          error: "Email ou senha inválidos."
        });
      }

      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN
        }
      );

      await Log.create({
        action: "LOGIN_SUCCESS",
        description: `Login realizado com sucesso: ${email}`,
        userId: user._id
      });

      return res.json({
        message: "Login realizado com sucesso.",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error("Erro no login:", error);

      return res.status(500).json({
        error: "Erro interno no servidor."
      });
    }
  }
);

module.exports = router;