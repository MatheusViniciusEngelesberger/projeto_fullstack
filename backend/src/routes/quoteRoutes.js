const express = require("express");
const jwt = require("jsonwebtoken");
const NodeCache = require("node-cache");
const { body, query, validationResult } = require("express-validator");

const Quote = require("../models/Quote");
const Log = require("../models/Log");

const router = express.Router();

const cache = new NodeCache({
  stdTTL: 3600,
  checkperiod: 600
});

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "Token não informado."
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({
      error: "Token inválido."
    });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({
      error: "Formato do token inválido."
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({
      error: "Token expirado ou inválido."
    });
  }
}

async function searchAnimeChan({ anime, character }) {
  try {
    const params = new URLSearchParams();

    if (anime) {
      params.append("anime", anime);
    } else if (character) {
      params.append("character", character);
    }

    const url = `https://api.animechan.io/v1/quotes/?${params.toString()}`;

    const response = await fetch(url);
    const text = await response.text();

    if (!response.ok) {
      if (response.status === 429) {
        console.error("Limite da AnimeChan atingido. Tente novamente depois de 1 hora.");
      } else {
        console.error("Erro na AnimeChan:", response.status, text);
      }

      return [];
    }

    const result = JSON.parse(text);

    const data = Array.isArray(result)
      ? result
      : Array.isArray(result.data)
        ? result.data
        : [];

    return data.map((item, index) => ({
      id: item.id ? `animechan-${item.id}` : `animechan-${index}`,
      anime: item.anime?.name || item.anime || "",
      characterName: item.character?.name || item.character || "",
      quote: item.content || item.quote || "",
      source: "animechan"
    }));
  } catch (error) {
    console.error("Erro ao buscar na AnimeChan:", error.message);
    return [];
  }
}

router.get(
  "/",
  authMiddleware,
  [
    query("anime")
      .optional()
      .trim()
      .escape(),

    query("character")
      .optional()
      .trim()
      .escape()
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

      const { anime, character } = req.query;

      if (!anime && !character) {
        return res.status(400).json({
          error: "Informe pelo menos um campo de busca: anime ou personagem."
        });
      }

      const cacheKey = `quotes:${anime || ""}:${character || ""}`;

      const cachedResult = cache.get(cacheKey);

      if (cachedResult) {
        await Log.create({
          action: "SEARCH_CACHE",
          description: `Busca em cache. Anime: ${anime || "-"} | Personagem: ${character || "-"}`,
          userId: req.user.id
        });

        return res.json(cachedResult);
      }

      const filters = [];

      if (anime) {
        filters.push({
          anime: {
            $regex: anime,
            $options: "i"
          }
        });
      }

      if (character) {
        filters.push({
          characterName: {
            $regex: character,
            $options: "i"
          }
        });
      }

      const quotes = await Quote.find({
        $and: filters
      }).sort({
        createdAt: -1
      });

      const formattedQuotes = quotes.map((item) => ({
        id: item._id,
        anime: item.anime,
        characterName: item.characterName,
        quote: item.quote,
        source: "mongodb",
        createdAt: item.createdAt
      }));

      const animeChanQuotes = await searchAnimeChan({
        anime,
        character
      });

      const result = {
        source: "mongodb_animechan",
        total: formattedQuotes.length + animeChanQuotes.length,
        mongodbTotal: formattedQuotes.length,
        animeChanTotal: animeChanQuotes.length,
        data: [...formattedQuotes, ...animeChanQuotes]
      };

      cache.set(cacheKey, result);

      await Log.create({
        action: "SEARCH",
        description: `Busca realizada no MongoDB e AnimeChan. Anime: ${anime || "-"} | Personagem: ${character || "-"}`,
        userId: req.user.id
      });

      return res.json(result);
    } catch (error) {
      console.error("Erro na busca:", error);

      return res.status(500).json({
        error: "Erro interno no servidor."
      });
    }
  }
);

router.post(
  "/",
  authMiddleware,
  [
    body("anime")
      .notEmpty()
      .withMessage("O anime é obrigatório.")
      .trim()
      .escape(),

    body("character")
      .notEmpty()
      .withMessage("O personagem é obrigatório.")
      .trim()
      .escape(),

    body("quote")
      .notEmpty()
      .withMessage("A citação é obrigatória.")
      .trim()
      .escape()
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

      const { anime, character, quote } = req.body;

      const createdQuote = await Quote.create({
        anime,
        characterName: character,
        quote
      });

      cache.flushAll();

      await Log.create({
        action: "INSERT",
        description: `Nova citação cadastrada. Anime: ${anime} | Personagem: ${character}`,
        userId: req.user.id
      });

      return res.status(201).json({
        message: "Citação cadastrada com sucesso.",
        data: {
          id: createdQuote._id,
          anime: createdQuote.anime,
          characterName: createdQuote.characterName,
          quote: createdQuote.quote,
          source: "mongodb",
          createdAt: createdQuote.createdAt
        }
      });
    } catch (error) {
      console.error("Erro na inserção:", error);

      return res.status(500).json({
        error: "Erro interno no servidor."
      });
    }
  }
);

module.exports = router;