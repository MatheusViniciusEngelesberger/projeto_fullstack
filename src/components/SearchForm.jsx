import { useForm } from "react-hook-form";
import { useQuote } from "../contexts/QuoteContext";

const SearchForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { fetchByAnime, fetchByCharacter, clearResults, state } = useQuote();

  const onSubmit = (data) => {
    const { anime, character } = data;

    if (anime) {
      fetchByAnime(anime);
    } else {
      fetchByCharacter(character);
    }
  };
  return (
    <section className="search-section">
      <form className="search-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="field-group">
          <label className="field-label">Nome do Anime</label>
          <input
            className="field-input"
            type="text"
            placeholder="Ex: Naruto, One Piece..."
            {...register("anime", {
              validate: (value, formValues) => {
                if (!value && !formValues.character) {
                  return "Preencha pelo menos um campo";
                }
                return true;
              },
            })}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Nome do Personagem</label>
          <input
            className="field-input"
            type="text"
            placeholder="Ex: Naruto Uzumaki, Luffy..."
            {...register("character", {
              validate: (value, formValues) => {
                if (!value && !formValues.anime) {
                  return "Preencha pelo menos um campo";
                }
                return true;
              },
            })}
          />
        </div>

        {(errors.anime || errors.character) && (
          <p className="form-error">
            {errors.anime?.message || errors.character?.message}
          </p>
        )}

        {state.error && (
          <p className="error-msg api-error" role="alert">
            ✖ {state.error}
          </p>
        )}

        <button className="btn-buscar" type="submit">Buscar</button>

        {state.searched && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClear}
          >Limpar
          </button>
        )}
      </form>
    </section>
  );
};

export default SearchForm;