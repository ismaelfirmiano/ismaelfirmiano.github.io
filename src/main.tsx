import { BrowserRouter, Routes, Route } from "react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Inicio } from "./paginas/Inicio.tsx";
import { Sobre } from "./paginas/Sobre.tsx";
import { Stack } from "./paginas/Stack.tsx";
import { Projetos } from "./paginas/Projetos.tsx";
import { Playground } from "./paginas/Playground";
import { Contato } from "./paginas/Contato.tsx";
import { Header } from "./componentes/Header.tsx";
import { Rodape } from "./componentes/Rodape.tsx";
import "./main.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<BrowserRouter>
			<div className="app-container">
				<Header />
				<main className="conteudo-principal">
					<Routes>
						<Route path="/" element={<Inicio />} />
						<Route path="/sobre" element={<Sobre />} />
						<Route path="/stack" element={<Stack />} />
						<Route path="/projetos" element={<Projetos />} />
						<Route path="/playground" element={<Playground />} />
						<Route path="/contato" element={<Contato />} />
					</Routes>
				</main>
				<Rodape />
			</div>
		</BrowserRouter>
	</StrictMode>,
);
