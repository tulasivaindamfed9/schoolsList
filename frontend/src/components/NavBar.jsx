// frontend/src/components/NavBar.jsx
import { Link, NavLink } from "react-router-dom";
// import "./NavBar.css"; // optional external css if you like
import "../styles/navbar.css"

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg bg-light border-bottom">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">School Portal</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="nav" className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto gap-2">
            <li className="nav-item">
              <NavLink className="nav-link" to="/add">Add School</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/schools">Show Schools</NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
