import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Home from "./pages/Home/Index";
import Login from "./pages/Login/Index";
import Cadastro from "./pages/Cadastro/Index";
import Agendar from "./pages/Agendar/Index";
import Adm from "./pages/Adm/Index";
import Aprovados from "./pages/Adm/Aprovados";
function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/agendar" element={<Agendar />} />
          <Route path="/adm" element={<Adm />} />
          <Route path="/aprovados" element={<Aprovados />} />
      
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
