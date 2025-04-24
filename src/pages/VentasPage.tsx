import React from "react";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/Ventas.css";

const VentasPage = () => {
  const [ventas, setVentas] = useState(
    JSON.parse(localStorage.getItem("ventas") || "[]")
  );
  const [inventario, setInventario] = useState(
    JSON.parse(localStorage.getItem("inventario") || "[]")
  );

  const [dailyTotal, setDailyTotal] = useState(0);
  const [name, setName] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [error, setError] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCantidad, setEditCantidad] = useState("");
  const [confirmarDelete, setConfirmarDelete] = useState(false);
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [success, setSuccess] = useState("");
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const handleStorageChange = () => {
      const loadedVentas = JSON.parse(localStorage.getItem("ventas") || "[]");
      const loadesInventario = JSON.parse(
        localStorage.getItem("inventario") || "[]"
      );
      setVentas(loadedVentas);
      setInventario(loadesInventario);
    };
    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const total = ventas
      .filter((venta) => venta.date === today)
      .reduce((sum, venta) => sum + Number(venta.total), 0);
    setDailyTotal(total);
  }, [ventas]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    // setSuccess("");

    const product = inventario.find((item) => item.name === name);
    if (!product) {
      setError("Produto no encontrado");
      toast.error("Producto no encontrado", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    const qty = parseInt(cantidad);
    if (isNaN(qty) || qty <= 0) {
      setError("La cantidad debe ser mayor a 0");
      toast.error("La cantidad debe ser mayor a 0", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    if (qty > product.cantidad) {
      setError(`Solo hay ${product.cantidad} unidades disponibles`);
      toast.error(`Solo hay ${product.cantidad} unidades disponibles`, {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    product.cantidad -= qty;
    const total = qty * product.precio;
    const newVenta = {
      name,
      cantidad: qty,
      total,
      date: today,
      history: [
        {
          action: "Creada",
          date: new Date().toISOString(),
          cantidad: qty,
          product: name,
        },
      ],
    };

    const updatedVentas = [...ventas, newVenta];
    setVentas(updatedVentas);
    setInventario([...inventario]);
    localStorage.setItem("inventario", JSON.stringify(inventario));
    localStorage.setItem("ventas", JSON.stringify(updatedVentas));
    setName("");
    setCantidad("");
    // setSuccess("Venta registrada con éxito");
    toast.success("Venta registrada con éxito", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };
  const handleEdit = (index) => {
    const venta = ventas[index];
    setEditIndex(index);
    setEditName(venta.name);
    setEditCantidad(venta.cantidad.toString());
    setEditModal(true);
    setConfirmEdit(false);
    setError("");
  };

  const handleSaveEdit = () => {
    setConfirmEdit(true);
  };
  const confirmSaveEdit = () => {
    const originalVenta = ventas[editIndex];
    const originalProduct = inventario.find(
      (item) => item.name === originalVenta.name
    );
    const newProduct = inventario.find((item) => item.name === editName);

    if (!newProduct) {
      setError("Producto seleccionado no encontrado");
      toast.error("Producto seleccionado no encontrado", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    const newQty = parseInt(editCantidad);
    if (isNaN(newQty) || newQty <= 0) {
      setError("La cantidad debe ser mayor a 0");
      toast.error("La cantidad debe ser mayor a 0", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    if (originalProduct) {
      originalProduct.cantidad += originalVenta.cantidad;
    }
    if (newQty > newProduct.cantidad) {
      setError(`Solo hay ${newProduct.cantidad} unidades diponibles`);
      if (originalProduct) {
        originalProduct.cantidad -= originalVenta.cantidad;
      }
      return;
    }
    newProduct.cantidad -= newQty;
    const updatedVentas = [...ventas];
    const updateHistory = originalVenta.history
      ? [...originalVenta.history]
      : [];
    updateHistory.push({
      action: "Editada",
      date: new Date().toISOString(),
      cantidad: newQty,
      product: editName,
    });
    updatedVentas[editIndex] = {
      name: editName,
      cantidad: newQty,
      total: newQty * newProduct.precio,
      date: today,
      history: updateHistory,
    };

    setVentas(updatedVentas);
    setInventario([...inventario]);
    localStorage.setItem("inventario", JSON.stringify(inventario));
    localStorage.setItem("ventas", JSON.stringify(updatedVentas));
    setEditModal(false);
    setEditIndex(null);
    setConfirmEdit(false);
    setError("");
    setSuccess("Venta editada con exito");
  };
  const handleDelete = (index) => {
    setEditIndex(index);
    setConfirmarDelete(true);
    setEditModal(true);
  };
  const confirmDelete = () => {
    const venta = ventas[editIndex];
    const product = inventario.find((item) => item.name === venta.name);
    if (product) {
      product.cantidad += venta.cantidad;
    }
    const updateVentas = ventas.filter((_, i) => i !== editIndex);
    setVentas(updateVentas);
    setInventario([...inventario]);
    localStorage.setItem("inventario", JSON.stringify(inventario));
    localStorage.setItem("ventas", JSON.stringify(updateVentas));
    setEditModal(false);
    setEditIndex(null);
    setConfirmarDelete(false);
    setSuccess("Venta eliminada con éxito");
  };

  const handleCloseModal = () => {
    setEditModal(false);
    setEditIndex(null);
    setEditName("");
    setEditCantidad("");
    setConfirmEdit(false);

    setError("");
  };
  return (
    <section className="p-6 shadow-lg bg-dark rounded-xl">
      <h2>Ventas del día</h2>
      <form onSubmit={handleSubmit}>
        <select required value={name} onChange={(e) => setName(e.target.value)}>
          <option value="">Seleccionar un producto</option>
          {inventario.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name} (Disponibles: {item.cantidad})
            </option>
          ))}
        </select>
        <input
          className="cant"
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          min={1}
          required
        />
        <button type="submit" className="btnn registrar">
          Registrar Venta
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      {success && (
        <p style={{ color: "green", marginTop: "10px" }}>{success}</p>
      )}
      <p className="p list-group-item">
        Total vendido hoy: ${dailyTotal.toFixed(2)}
      </p>
      <div className="nombres_vent">
        <p>Producto</p>
        <p>Vendidos</p>
        <p>Total</p>
      </div>
      <ul className="ul_venta">
        {ventas
          .filter((venta) => venta.date === today)
          .map((venta, index) => (
            <>
              <li className="li d-flex justify-content-center " key={index}>
                {venta.name}
              </li>
              <li className="li d-flex justify-content-center" key={index}>
                {venta.cantidad}
              </li>
              <li
                className="li list-group-item d-flex justify-content-center"
                key={index}
              >
                ${venta.total}
              </li>
              <div className="editar_borrar">
                <button
                  className="btn btn-sm btn-primary "
                  // style={{ marginLeft: "10px", backgroundColor: "#007bff" }}
                  onClick={() => handleEdit(index)}
                  style={{
                    marginLeft: "7px",
                    cursor: "pointer",
                  }}
                >
                  <i className="fas fa-edit me-1"></i>
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(index)}
                  style={{ marginLeft: "8px", cursor: "pointer" }}
                >
                  <i className="fas fa-trash-alt me-1"></i>
                  Borrar
                </button>
              </div>
            </>
          ))}
      </ul>
      {editModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="border-0 shadow modal-content">
              <div className="text-white modal-header bg-primary">
                <h5 className="modal-title">
                  {confirmarDelete ? "Confirmar Eliminacion" : "Editar Venta"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {confirmarDelete ? (
                  <p>?Estás seguro de que quieres eliminar esta venta</p>
                ) : confirmEdit ? (
                  <p>?Confirmar los cambios en la venta</p>
                ) : (
                  <>
                    <div className="mb-3">
                      <label
                        htmlFor="editProduct"
                        className="form-label fw-bold"
                      >
                        Producto
                      </label>
                      <select
                        id="editProduct"
                        className="form-select"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                      >
                        <option value="">Seleccionar un producto</option>
                        {inventario.map((item, index) => (
                          <option key={index} value={item.name}>
                            {item.name} (Disp: {item.cantidad})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label
                        htmlFor="editCantidad"
                        className="form-label fw-bold"
                      >
                        Cantidad
                      </label>
                      <input
                        id="editCantidad"
                        type="number"
                        className="form-control"
                        value={editCantidad}
                        onChange={(e) => setEditCantidad(e.target.value)}
                        min={1}
                        required
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                {confirmarDelete ? (
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={confirmDelete}
                  >
                    Eliminar
                  </button>
                ) : confirmEdit ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={confirmSaveEdit}
                  >
                    Confirmar
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveEdit}
                  >
                    Guardar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {editModal && (
        <div
          className="modal-backdrop fade show"
          onClick={handleCloseModal}
        ></div>
      )}
    </section>
  );
};

export default VentasPage;
