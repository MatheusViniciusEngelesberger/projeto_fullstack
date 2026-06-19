import { useState } from "react";

const InsertQuoteForm = () => {
  const [anime, setAnime] = useState("");
  const [character, setCharacter] = useState("");
  const [quote, setQuote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!anime.trim() || !character.trim() || !quote.trim()) {
      setError("Preencha todos os campos para cadastrar a citação.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3001/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          anime,
          character,
          quote
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao cadastrar citação.");
      }

      setMessage("Citação cadastrada com sucesso.");
      setAnime("");
      setCharacter("");
      setQuote("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="insert-section">
      <form className="search-form" onSubmit={handleSubmit}>
        <div className="insert-heading">
          <h2>Cadastrar citação</h2>
          <p>Adicione uma nova frase ao banco de dados local.</p>
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="insert-anime">
            Anime
          </label>

          <input
            className="field-input"
            id="insert-anime"
            type="text"
            value={anime}
            onChange={(event) => setAnime(event.target.value)}
            placeholder="Ex: Naruto"
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="insert-character">
            Personagem
          </label>

          <input
            className="field-input"
            id="insert-character"
            type="text"
            value={character}
            onChange={(event) => setCharacter(event.target.value)}
            placeholder="Ex: Madara Uchiha"
          />
        </div>

        <div className="field-group">
          <label className="field-label" htmlFor="insert-quote">
            Citação
          </label>

          <textarea
            className="field-input quote-textarea"
            id="insert-quote"
            value={quote}
            onChange={(event) => setQuote(event.target.value)}
            placeholder="Digite a citação"
          />
        </div>

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}

        <button className="btn-buscar" type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>
    </section>
  );
};

export default InsertQuoteForm;