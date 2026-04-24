import { createContext, useContext, useReducer } from "react";

const BASE_URL = 'https://api.animechan.io/v1'

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
            return { ...state, loading: true, error: null, quotes: [] };

        case "FETCH_SUCCESS":
            return { ...state, loading: false, quotes: action.payload };

        case "FETCH_ERROR":
            return { ...state, loading: false, error: action.payload, quotes: [] };
        case "CLEAR_RESULTS":
            return { ...initialState }
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
            if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
            const data = await res.json();
            const result = data.data || data;
            if (result.length === 0) throw new Error('Nenhuma frase encontrada para este anime.')
            dispatch({ type: "FETCH_SUCCESS", payload: data.data || data });
        } catch (err) {
            dispatch({ type: "FETCH_ERROR", payload: err.message });
        }
    };

    const fetchByCharacter = async (character) => {
        dispatch({ type: "FETCH_START" });

        try {
            const res = await fetch(
                `${BASE_URL}/quotes?character=${encodeURIComponent(character)}`
            );
            if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
            const data = await res.json();
            const result = data.data || data;
            if (result.length === 0) throw new Error('Nenhuma frase encontrada para este personagem.')
            dispatch({ type: "FETCH_SUCCESS", payload: data.data || data });
        } catch (err) {
            dispatch({ type: "FETCH_ERROR", payload: err.message });
        }
    };

    return (
        <QuoteContext.Provider value={{ state, fetchByAnime, fetchByCharacter }}>
            {children}
        </QuoteContext.Provider>
    );
};

export const useQuote = () => useContext(QuoteContext);