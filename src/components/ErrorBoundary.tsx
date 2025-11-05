"use client";
import React from "react";

interface State {
  hasError: boolean;
  error?: Error | null;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren<unknown>, State> {
  constructor(props: React.PropsWithChildren<unknown>) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Se produjo un error en la interfaz</h2>
          <p className="mb-4 text-sm text-gray-700">Revisa la consola del navegador para ver la traza completa del error.</p>
          <details className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
            <summary className="cursor-pointer">Mostrar error</summary>
            <pre className="text-xs mt-2">{this.state.error ? String(this.state.error.stack || this.state.error) : "Sin detalles"}</pre>
          </details>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

export default ErrorBoundary;
