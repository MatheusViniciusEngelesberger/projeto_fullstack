import { useAuth } from "../contexts/useAuth";

const Header = () => {
  const { logout } = useAuth();

  return (
    <header className="header">
      <div className="header-text">
        <h1 className="header-title">⛩ Anime Quotes</h1>
        <p className="header-sub">Frases icônicas do universo anime</p>
      </div>

      <button className="header-logout btn-secondary" type="button" onClick={logout}>
        Sair
      </button>
    </header>
  );
};

export default Header;