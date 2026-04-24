import { useForm } from "react-hook-form";
import { useQuote } from "../contexts/QuoteContext";

const SearchForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { fetchByAnime, fetchByCharacter } = useQuote();

  const onSubmit = (data) => {
    const { anime, character } = data;

    if (anime) {
      fetchByAnime(anime);
    } else {
      fetchByCharacter(character);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Nome do Anime</label>
        <input
          type="text"
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

      <div>
        <label>Nome do Personagem</label>
        <input
          type="text"
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
        <p>
          {errors.anime?.message || errors.character?.message}
        </p>
      )}

      <button type="submit">Buscar</button>
    </form>
  );
};

export default SearchForm;