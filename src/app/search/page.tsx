"use client";

import { InputDemo as SearchBar } from "./components/SearchBar";
import { SearchButton } from "./components/SearchButton";
import React, { useState } from "react";

export default function SearchPage() {
	const [query, setQuery] = useState("");
	const minChars = 2;

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && query.trim().length >= minChars) {
			// TODO: trigger search action (navigate or fetch)
			console.log("Search for:", query);
		}
	};

	const canSearch = query.trim().length >= minChars;

	return (
		<main style={{ padding: 24 }}>
			<h1>Búsqueda de servicios</h1>
			<div style={{ display: "flex", gap: 8 }}>
				<SearchBar
					value={query}
					onChange={handleChange}
					onClear={() => setQuery("")}
				/>
				<SearchButton disabled={!canSearch} onClick={() => console.log("Search clicked:", query)} />
			</div>
			{query && !canSearch && (
				<p style={{ color: "#666", marginTop: 8 }}>Introduce al menos {minChars} caracteres para buscar.</p>
			)}
		</main>
	);
}