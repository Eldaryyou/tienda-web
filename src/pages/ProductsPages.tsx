import React from "react";
import { useState } from "react";
import "../styles/Products.css";
import { replace, useNavigate } from "react-router-dom";

const ProductosPages = () => {
  const [name, setName] = useState("");
  const [cantidad, setCantidad] = useState("");

  const [precio, setPrecio] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    if (name.trim().length <= 3) {
      return;
    }
    if (cantidad.trim().length <= 0) {
      return;
    }
    if (precio.trim().length <= 1) {
      return;
    }

    e.preventDefault();
    const inventario = JSON.parse(localStorage.getItem("inventario") || "[]");
    const existeProducto = inventario.find((item) => item.name === name);

    if (existeProducto) {
      existeProducto.cantidad += parseInt(cantidad);
    } else {
      inventario.push({
        name,
        cantidad: parseInt(cantidad),
        precio: parseFloat(precio),
      });
    }

    localStorage.setItem("inventario", JSON.stringify(inventario));
    setName("");
    setCantidad("");
    setPrecio("");
    navigate("/reportes");
  };

  return (
    <section className="p-6 shadow-lg bg-dark rounded-xl">
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre del Producto"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          min="1"
          onChange={(e) => setCantidad(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          min="1"
          onChange={(e) => setPrecio(e.target.value)}
          required
        />
        <button className="btnn" type="submit">
          Agregar Producto
        </button>
      </form>
    </section>
  );
};

export default ProductosPages;
