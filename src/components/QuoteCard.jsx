const QuoteCard = ({ quote }) => {
  return (
    <div>
      <p>"{quote.content}"</p>
      <small>
        {quote.character?.name} — {quote.anime?.name}
      </small>
    </div>
  );
};

export default QuoteCard;