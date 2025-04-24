import React, { useEffect, useState } from "react";
import "../styles/Estadisticas.css";

const Estadisticas = () => {
  const [ventas, setVentas] = useState(
    JSON.parse(localStorage.getItem("ventas") || "[]")
  );

  useEffect(() => {
    const loadVentas = () => {
      const loadedVnetas = JSON.parse(localStorage.getItem("ventas") || "[]");
      console.log("ventas cargadas:", JSON.stringify(loadedVnetas, null, 2));
      setVentas(loadedVnetas);
    };
    loadVentas();

    window.addEventListener("storage", loadVentas);
    return () => {
      window.removeEventListener("storage", loadVentas);
    };
  }, []);

  const getWeeklyTotal = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    console.log(`fecha weekAgo:`, weekAgo.toDateString());

    const filteredSales = ventas.filter((venta) => {
      const ventaDate = new Date(venta.date);
      const isValidDate = ventaDate !== null;
      const isRecent = isValidDate && ventaDate >= weekAgo;
      console.log(
        `venta-nombre ${venta.name}, fecha ${venta.date}, total: ${venta.total}, incluida en semana ${isRecent}`
      );
      return isRecent;
    });
    const total = filteredSales.reduce((sum, venta) => {
      const ventaTotal = Number(venta.total) || 0;
      console.log(`sumando venta ${venta.name}, total: ${venta.total}`);
      return sum + ventaTotal;
    }, 0);
    console.log(`total semanal:`, total);
    return total;
  };

  const getMonthlyTotal = () => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const filteresVentas = ventas.filter((venta) => {
      const ventaDate = new Date(venta.date);
      const isValidDate = ventaDate !== null;
      const isRecent = isValidDate && ventaDate >= monthAgo;
      return isRecent;
    });
    const total = filteresVentas.reduce((sum, venta) => {
      const ventaTotal = Number(venta.total) || 0;
      return sum + ventaTotal;
    }, 0);

    return total;
  };

  return (
    <section className="p-6 shadow-lg bg-dark rounded-xl">
      <h2>Estadísticas</h2>

      <p className="p">
        Total vendido esta semana: ${getWeeklyTotal().toFixed(2)}
      </p>
      <p className="p">
        Total vendido este mes: ${getMonthlyTotal().toFixed(2)}
      </p>
      <h3> Historial de ventas</h3>
      <div className="nombres_est">
        <p>Fecha</p>
        <p>Producto</p>
        <p>Cantidad</p>
        <p>Total</p>
      </div>
      {ventas.length === 0 ? (
        <p>No hay ventas registradas.</p>
      ) : (
        <ul className="ul_est list-group">
          {ventas.map((venta, index) => (
            <>
              <li className="li" key={index}>
                {venta.date}
              </li>
              <li className="li" key={index}>
                {venta.name}
              </li>
              <li className="li" key={index}>
                {venta.cantidad}
              </li>
              <li className="li" key={index}>
                ${venta.total}
              </li>
            </>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Estadisticas;
