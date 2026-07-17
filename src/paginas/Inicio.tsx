// Hero Section
import { useState } from "react";
import { RedesSociais } from "../componentes/RedesSociais";

export function Inicio() {
	const [contador, setContador] = useState<number>(0);

	function incrementar() {
		setContador(contador + 1);
	}

	function decrementar() {
		setContador(contador - 1);
	}

	return (
		<>
			<h1>
				Desenvolvendo aplicações robustas e integrando ecossitemas de
				inteligência artificial
			</h1>
			<h2>
				Graduando em Ciência da Computação, focado em backend e automações
			</h2>
			<button onClick={incrementar}>Incrementar</button>
			<p>{contador} cliques!</p>
			<button onClick={decrementar}>Decrementar</button>
			<RedesSociais />
		</>
	);
}
