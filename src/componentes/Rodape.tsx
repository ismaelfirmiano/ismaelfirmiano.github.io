import { RedesSociais } from "./RedesSociais";
import "./Rodape.css";

export function Rodape() {
	return (
		<footer>
			<div id="rodape-1">
				<RedesSociais />
				<div>
					<h4>Contato</h4>
					<p></p>
					<p>Niteroi - RJ</p>
				</div>
			</div>
			<div>Desenvolvido por Ismael Firmiano. Código disponível no GitHub.</div>
		</footer>
	);
}
