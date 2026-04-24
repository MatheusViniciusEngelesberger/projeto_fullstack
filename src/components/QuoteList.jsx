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
        return <p>Nenhum resultado encontrado</p>;
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