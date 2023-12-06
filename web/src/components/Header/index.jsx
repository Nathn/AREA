import { Link } from "react-router-dom";

function Header() {
  return (
    <nav>
      <Link to="/">
        <h3>Accueil</h3>
      </Link>
      <Link to="/login">
        <h3>Connexion / Inscription</h3>
      </Link>
    </nav>
  );
}

export default Header;
