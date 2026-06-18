const QuoteCard = ({ quote }) => {
  return (
    <div className="quote-card">
      <p className="quote-text">"{quote.content}"</p>
      <small>
        {quote.character?.name} — {quote.anime?.name}
      </small>
    </div>
  );
};

export default QuoteCard;