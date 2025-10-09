"use client";

import React, { useState } from "react";
import HomeSearch from "./search/pages/HomeSearch";
import Paginacion from "./Pagination/Paginacion";

export default function Home() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="border rounded-lg p-4 bg-white shadow-sm">
        <HomeSearch />
      </div>
    </div>
  );
}
