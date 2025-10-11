import React from "react";

export default function JobOffersLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <div style={{ fontFamily: "Roboto" }}>
                {children}
            </div>
        </>
    );
}
