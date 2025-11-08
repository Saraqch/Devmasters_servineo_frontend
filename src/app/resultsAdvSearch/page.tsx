import React from 'react';
import Header from './components_RAS/Header';
import Footer from './components_RAS/Footer';

// Página mínima de resultados para la Búsqueda Avanzada
export default function ResultsAdvSearchPage() {
	return (
		<>
			<Header />
			<main className="pt-20 lg:pt-24 px-4 sm:px-6 md:px-12 lg:px-24 pb-12">
				<h1 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-8 mt-4">
					Resultados de Búsqueda Avanzada
				</h1>
			</main>
			<Footer />
		</>
	);
}

export const runtime = 'edge';
