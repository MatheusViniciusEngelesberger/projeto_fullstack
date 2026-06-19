const QuoteCard = ({ quote }) => {
  const quoteText = quote.quote || quote.content || "";
  const characterName = quote.characterName || quote.character?.name || "Personagem desconhecido";
  const animeName = quote.anime?.name || quote.anime || "Anime desconhecido";

  const sourceLabel =
    quote.source === "mongodb"
      ? "Banco de dados"
      : quote.source === "animechan"
        ? "AnimeChan"
        : "Desconhecida";

  return (
    <div className="quote-card">
      <p className="quote-text">"{quoteText}"</p>

      <small className="quote-meta">
        {characterName} — {animeName}
      </small>

      {quote.source && (
        <small className="quote-source">
          Origem: {sourceLabel}
        </small>
      )}
    </div>
  );
};

export default QuoteCard;