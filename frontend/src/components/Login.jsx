import { useState } from "react";
import { useAuth } from "../contexts/useAuth";

function Login() {
  const { login } = useAuth();

  const [email, setEmail] = useState("admin@email.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="header-title">⛩ Anime Quotes</h1>
        <p className="header-sub">Frases icônicas do universo anime</p>
      </header>

      <main className="main">
        <section className="search-section">
          <form className="search-form login-form" onSubmit={handleSubmit}>
            <div className="login-heading">
              <h2>Login</h2>
              <p>Entre para buscar e cadastrar citações de anime.</p>
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="email">
                Email
              </label>

              <input
                className="field-input"
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="password">
                Senha
              </label>

              <input
                className="field-input"
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button className="btn-buscar btn-login" type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </section>
      </main>

      <footer className="footer">
        <span>AnimeChan Explorer · Programação Web Fullstack</span>
      </footer>
    </div>
  );
}

export default Login;