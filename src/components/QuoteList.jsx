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
    return(
    <section className="results-section empty-state">
      <p className="empty-text">Nenhuma frase encontrada.</p>
    </section>
    )
  }

  return (
    <section className="results-section">
      <p className="results-count">
        {state.quotes.length} frase{state.quotes.length !== 1 ? 's' : ''} encontrada{state.quotes.length !== 1 ? 's' : ''}
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