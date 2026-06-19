import { createContext, useContext, useReducer } from "react";

const BASE_URL = "http://localhost:3001/api";

const QuoteContext = createContext();

const initialState = {
    quotes: [],
    loading: false,
    error: null,
    searched: false,
};

function reducer(state, action) {
    switch (action.type) {
        case "FETCH_START":
            return { ...state, loading: true, error: null, quotes: [], searched: true };

        case "FETCH_SUCCESS":
            return { ...state, loading: false, quotes: action.payload };

        case "FETCH_ERROR":
            return { ...state, loading: false, error: action.payload, quotes: [] };

        case "CLEAR_RESULTS":
            return { ...initialState };

        default:
            return state;
    }
}

export const QuoteProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchByAnime = async (anime) => {
        dispatch({ type: "FETCH_START" });

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${BASE_URL}/quotes?anime=${encodeURIComponent(anime)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Erro HTTP ${res.status}`);
            }

            const result = data.data || [];

            if (result.length === 0) {
                throw new Error("Nenhuma frase encontrada para este anime.");
            }

            dispatch({ type: "FETCH_SUCCESS", payload: result });
        } catch (err) {
            dispatch({ type: "FETCH_ERROR", payload: err.message });
        }
    };

    const fetchByCharacter = async (character) => {
        dispatch({ type: "FETCH_START" });

        try {
            const token = localStorage.getItem("token");

            const res = await fetch(
                `${BASE_URL}/quotes?character=${encodeURIComponent(character)}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || `Erro HTTP ${res.status}`);
            }

            const result = data.data || [];

            if (result.length === 0) {
                throw new Error("Nenhuma frase encontrada para este personagem.");
            }

            dispatch({ type: "FETCH_SUCCESS", payload: result });
        } catch (err) {
            dispatch({ type: "FETCH_ERROR", payload: err.message });
        }
    };

    const clearResults = () => {
        dispatch({ type: "CLEAR_RESULTS" });
    };

    return (
        <QuoteContext.Provider value={{ state, fetchByAnime, fetchByCharacter, clearResults }}>
            {children}
        </QuoteContext.Provider>
    );
};

export const useQuote = () => useContext(QuoteContext);