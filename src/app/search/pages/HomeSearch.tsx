import { InputDemo } from "../components/SearchBar";
import { SearchButton } from "../components/SearchButton";

export default function HomeSearch() {
  return (
    <main
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ marginBottom: 20, fontSize: "2.2rem", fontFamily: "Roboto, Arial, sans-serif", fontWeight: "bold",lineHeight: 0.8 }}>
        Encuentra el profesional perfecto
      </h1>
      <h2 style={{ marginBottom: 18, textAlign: "center", fontFamily: "Roboto, Arial, sans-serif", lineHeight: 0.05 }}>
        Conecta con expertos verificados. Más de 1000 
      </h2>
      <h2 style={{ marginBottom: 18, textAlign: "center", fontFamily: "Roboto, Arial, sans-serif", lineHeight: 0.5 }}>
        profesionales listos para ayudarte.
      </h2>
      <div
        style={{
          width: 780,
          display: "flex",
          alignItems: "flex-start",
          gap: 5,
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <InputDemo
            placeholder="¿Qué servicio necesitas?"
          />
        </div>
        <div style={{ marginTop: 1.5 }}>
          <SearchButton
            style={{
              backgroundColor: "#0833a2",
              color: "#fff",
              border: "none",
              padding: "10px 10px",
              borderRadius: "9px",
              cursor: "pointer",
              paddingLeft: 10,
              paddingRight: 10,
              fontFamily: "Roboto, Arial, sans-serif",
            }}
          />
        </div>
      </div>
    </main>
  );
}
