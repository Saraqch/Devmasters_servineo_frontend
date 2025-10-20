import React from "react";
import { roboto } from "@/app/fonts";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={roboto.className}>
			{children}
		</div>
	);
}
