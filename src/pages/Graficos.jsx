import { useEffect, useState, useRef } from "react";
import "../styles/Estadisticas.css";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Graficos = () => {
  const [ventas, setVentas] = useState(
    JSON.parse(localStorage.getItem("ventas") || "[]")
  );

  const [filterProduct, setFilterProduct] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterMinQty, setFilterMinQty] = useState("");
  const dailyChartRef = useRef(null);
  const productChartRef = useRef(null);
  const trendChartRef = useRef(null);

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

  const filteredVentas = ventas.filter((venta) => {
    const ventaDate = new Date(venta.date);
    const startDate = filterStartDate ? new Date(filterStartDate) : null;
    const endDate = filterEndDate ? new Date(filterEndDate) : null;
    const minQty = parseInt(filterMinQty) || 0;

    return (
      (!filterProduct ||
        venta.name.toLowerCase().includes(filterProduct.toLowerCase())) &&
      (!startDate || (ventaDate && ventaDate >= startDate)) &&
      (!endDate || (ventaDate && ventaDate <= endDate)) &&
      venta.cantidad >= minQty
    );
  });

  const getDailySalesData = () => {
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const totals = last7Days.map((date) => {
      const dailySales = filteredVentas.filter(
        (venta) => new Date(venta.date)?.toISOString().split("T")[0] === date
      );
      return dailySales.reduce((sum, venta) => sum + Number(venta.total), 0);
    });
    return {
      labels: last7Days.map((date) => date.split("-").slice(1).join("/")),
      datasets: [
        {
          label: "Ventas diarias",
          data: totals,
          backgroundColor: "rgba(78, 205, 196, 0.6)",
          borderColor: "rgba(78, 205, 196, 1)",
          borderWidth: 2,
          hoverBackgroundColor: "rgba(78, 205, 196, 1)",
        },
      ],
    };
  };

  const getProductSalesData = () => {
    const productTotals = {};
    filteredVentas.forEach((venta) => {
      productTotals[venta.name] =
        (productTotals[venta.name] || 0) + Number(venta.total);
    });

    const labels = Object.keys(productTotals);
    const data = Object.values(productTotals);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: [
            "#FF6B6B",
            "#4ECDC4",
            "#45B7D1",
            "#96CEB4",
            "#FFEEAD",
          ],
          hoverBackgroundColor: [
            "#FF8787",
            "#66E0D8",
            "#60C7E0",
            "#A8D8C1",
            "#FFF5C2",
          ],
        },
      ],
    };
  };

  const getMonthlyTrendData = () => {
    const now = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    const totals = last30Days.map((date) => {
      const dailySales = filteredVentas.filter(
        (venta) => new Date(venta.date)?.toISOString().split("T")[0] === date
      );
      return dailySales.reduce((sum, venta) => sum + Number(venta.total), 0);
    });
    return {
      labels: last30Days.map((date) => date.split("-").slice(1).join("/")),
      datasets: [
        {
          label: "Tendencia mensual",
          data: totals,
          fill: false,
          borderColor: "#FF6B6B",
          tension: 0.4,
          pointBackgroundColor: "#FF6B6B",
          pointHoverBackgroundColor: "#FF8787",
        },
      ],
    };
  };

  const exportChart = async (chartRef, title) => {
    if (!chartRef.current) return;
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.text(title, 10, 10);
    pdf.addImage(imgData, "PNG", 10, 20, 190, 100);
    pdf.save(`${title}.pdf`);
    toast.success(`Gráfico "${title}" exportado como PDF`, {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#fff",
          font: { size: 14 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
      },
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "#fff" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = e.chart.data.labels[index];
        toast.info(`Seleccionado: ${label}`, {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    },
  };

  return (
    <section className="p-6 shadow-lg bg-dark rounded-xl">
      <h2 className="mb-4 text-2xl font-bold text-neon">Gráficos</h2>
      <ToastContainer />
      <div className="p-4 mb-6 bg-gray-800 rounded-lg">
        <h3 className="mb-2 text-lg font-bold text-neon">Filtrar Ventas</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="block mb-1 text-neon">Producto</label>
            <input
              type="text"
              value={filterProduct}
              onChange={(e) => setFilterProduct(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full p-2 text-white bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 text-neon">Fecha Inicio</label>
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="w-full p-2 text-white bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 text-neon">Fecha Fin</label>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="w-full p-2 text-white bg-gray-700 rounded"
            />
          </div>
          <div>
            <label className="block mb-1 text-neon">Cantidad Mínima</label>
            <input
              type="number"
              value={filterMinQty}
              onChange={(e) => setFilterMinQty(e.target.value)}
              placeholder="0"
              min={0}
              className="w-full p-2 text-white bg-gray-700 rounded"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 bg-gray-800 rounded-lg" ref={dailyChartRef}>
          <h3 className="mb-2 text-lg font-bold text-neon">
            Ventas diarias (7 días)
          </h3>
          <Bar data={getDailySalesData()} options={chartOptions} />
          <button
            onClick={() => exportChart(dailyChartRef, "Ventas Diarias")}
            className="px-4 py-2 mt-2 rounded-lg bg-neon text-dark hover:bg-accent"
          >
            Exportar PDF
          </button>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg" ref={productChartRef}>
          <h3 className="mb-2 text-lg font-bold text-neon">
            Ventas por producto
          </h3>
          <Pie data={getProductSalesData()} options={chartOptions} />
          <button
            onClick={() => exportChart(productChartRef, "Ventas por Producto")}
            className="px-4 py-2 mt-2 rounded-lg bg-neon text-dark hover:bg-accent"
          >
            Exportar PDF
          </button>
        </div>
        <div className="p-4 bg-gray-800 rounded-lg" ref={trendChartRef}>
          <h3 className="mb-2 text-lg font-bold text-neon">
            Tendencia mensual
          </h3>
          <Line data={getMonthlyTrendData()} options={chartOptions} />
          <button
            onClick={() => exportChart(trendChartRef, "Tendencia Mensual")}
            className="px-4 py-2 mt-2 rounded-lg bg-neon text-dark hover:bg-accent"
          >
            Exportar PDF
          </button>
        </div>
      </div>
    </section>
  );
};

export default Graficos;
