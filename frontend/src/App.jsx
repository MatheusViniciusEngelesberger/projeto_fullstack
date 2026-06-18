import { useState } from 'react'
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import QuoteList from './components/QuoteList';
import { QuoteProvider } from './contexts/QuoteContext';

function App() {
  return (
    <QuoteProvider>
      <div className="app">
        <Header />
        <main className="main">
          <SearchForm />
          <QuoteList />
        </main>
        <footer className="footer">
          <span>AnimeChan Explorer · Programação Web Fullstack</span>
        </footer>
      </div>
    </QuoteProvider>
  );
}

export default App
