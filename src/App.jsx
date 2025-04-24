import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductosPages from "./pages/ProductsPages";

import Navbar from "./navbar/Navbar";
import VentasPage from "./pages/VentasPage";
import ReportesPage from "./pages/ReportesPage";
// import Home from "./pages/Home/Home";
import "./App.css";
import Estadisticas from "./pages/Estadisticas";
import Footer from "./footer/Footer";
import Graficos from "./pages/Graficos";

function App() {
  return (
    <>
      <Router basename="/tienda-web">
        <Navbar />
        <div className="container min-vh-100">
          <Routes>
            <Route path="/productos" Component={ProductosPages} />
            <Route path="/ventas" Component={VentasPage} />
            <Route path="/reportes" Component={ReportesPage} />
            <Route path="/estadisticas" Component={Estadisticas} />
            <Route path="/graficos" Component={Graficos} />

            <Route path="/" Component={ProductosPages} />
            <Route path="/*" Component={ProductosPages} />
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
