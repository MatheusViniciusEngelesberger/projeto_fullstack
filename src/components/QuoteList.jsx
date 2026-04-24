import { useQuote } from "../contexts/QuoteContext";
import QuoteCard from "./QuoteCard";

const QuoteList = () => {
  const { state } = useQuote();

  if (state.loading) {
    return <p>Carregando...</p>;
  }

  if (state.error) {
    return <p>{state.error}</p>;
  }

  return (
    <div>
      {state.quotes.map((quote, index) => (
        <QuoteCard key={index} quote={quote} />
      ))}
    </div>
  );
};

export default QuoteList;