import { InputDemo as SearchBar } from "../components/SearchBar";
import { SearchButton } from "../components/SearchButton";

export default function SearchPage() {
	return (
		<main style={{ padding: 24 }}>
			<h1>Búsqueda de servicios</h1>
			<div style={{ display: 'flex', gap: 8 }}>
				<SearchBar
					value=""
					onChange={() => {}}
					onClear={() => {}}
				/>
				<SearchButton />
				
			</div>
		</main>
	);
}
//sldkflañkfldalñ