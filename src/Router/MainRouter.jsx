import React from "react";
import { Route, Routes } from "react-router";
import { Main } from "../Pages/mainPage";
import { Tablo } from "../Pages/Tablo";

function MainRouter() {
  return (
    <Routes>
      <Route path="/" element={<Main/>}/>
      <Route path="/:id" element={<Tablo />} />
    </Routes>
  );
}

export default MainRouter;
