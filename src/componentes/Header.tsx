import "./Header.css";
import { Link } from "react-router";

export function Header() {
	return (
		<header>
			<Link to="/" className="logo">
				Firmiano
			</Link>
			<nav>
				<Link to="/sobre" className="item-menu">
					Sobre
				</Link>
				<Link to="/stack" className="item-menu">
					Stack
				</Link>
				<Link to="/projetos" className="item-menu">
					Projetos
				</Link>
				<Link to="/playground" className="item-menu">
					Playground
				</Link>
				<Link to="/contato" className="item-menu">
					Contato
				</Link>
			</nav>
		</header>
	);
}
