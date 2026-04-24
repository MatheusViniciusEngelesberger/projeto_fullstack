import { useQuote } from "../contexts/QuoteContext";
import QuoteCard from "./QuoteCard";

const QuoteList = () => {
  const { state } = useQuote();

  if (!state.searched) {
    return (
      <section className="results-section empty-state">
        <p className="empty-text">Use o formulário acima para buscar frases de animes.</p>
      </section>
    )
  }

  if (state.loading) {
    return <p>Carregando...</p>;
  }

  if (state.error) {
    return <p>{state.error}</p>;
  }
  if (state.quotes.length === 0) {
    <section className="results-section empty-state">
      <div className="empty-icon">🔍</div>
      <p className="empty-text">Nenhuma frase encontrada.</p>
    </section>
  }

  return (
    <section className="results-section">
      <p className="results-count">
        {quotes.length} frase{quotes.length !== 1 ? 's' : ''} encontrada{quotes.length !== 1 ? 's' : ''}
      </p>
      <div className="quote-grid">
        {state.quotes.map((quote, index) => (
          <QuoteCard key={index} quote={quote} />
        ))}
      </div>
    </section>
  );
};

export default QuoteList;