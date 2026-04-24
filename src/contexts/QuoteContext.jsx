import { createContext, useContext, useReducer } from "react";

const BASE_URL = 'https://api.animechan.io/v1'

const QuoteContext = createContext();

const initialState = {
  quotes: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null, quotes: [] };

    case "FETCH_SUCCESS":
      return { ...state, loading: false, quotes: action.payload };

    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
}

export const QuoteProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchByAnime = async (anime) => {
    dispatch({ type: "FETCH_START" });

    try {
      const res = await fetch(
        `${BASE_URL}/quotes?anime=${encodeURIComponent(anime)}`
      );
      const data = await res.json();

      dispatch({ type: "FETCH_SUCCESS", payload: data.data || data });
    } catch {
      dispatch({ type: "FETCH_ERROR", payload: "Erro ao buscar anime" });
    }
  };

  const fetchByCharacter = async (character) => {
    dispatch({ type: "FETCH_START" });

    try {
      const res = await fetch(
        `${BASE_URL}/quotes?character=${encodeURIComponent(character)}`
      );
      const data = await res.json();

      dispatch({ type: "FETCH_SUCCESS", payload: data.data || data });
    } catch {
      dispatch({ type: "FETCH_ERROR", payload: "Erro ao buscar personagem" });
    }
  };

  return (
    <QuoteContext.Provider value={{ state, fetchByAnime, fetchByCharacter }}>
      {children}
    </QuoteContext.Provider>
  );
};

export const useQuote = () => useContext(QuoteContext);