import Header from "./components/Header";
import SearchForm from "./components/SearchForm";
import QuoteList from "./components/QuoteList";
import Login from "./components/Login";
import InsertQuoteForm from "./components/InsertQuoteForm";
import { QuoteProvider } from "./contexts/QuoteContext";
import { AuthProvider } from "./contexts/AuthProvider";
import { useAuth } from "./contexts/useAuth";

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <QuoteProvider>
      <div className="app">
        <Header />

        <main className="main">
          <SearchForm />
          <InsertQuoteForm />
          <QuoteList />
        </main>

        <footer className="footer">
          <span>AnimeChan Explorer · Programação Web Fullstack</span>
        </footer>
      </div>
    </QuoteProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;