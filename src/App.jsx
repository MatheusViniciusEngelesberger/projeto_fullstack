import { useState } from 'react'
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import QuoteList from './components/QuoteList';

function App() {
  return (
    <div>
      <Header />
      <SearchForm />
      <QuoteList />
    </div>
  );
}

export default App
