const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    anime: {
      type: String,
      required: [true, "O anime é obrigatório."],
      trim: true
    },
    characterName: {
      type: String,
      required: [true, "O personagem é obrigatório."],
      trim: true
    },
    quote: {
      type: String,
      required: [true, "A citação é obrigatória."],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Quote", quoteSchema);