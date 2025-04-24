import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import "../styles/Reportes.css";
// import { useNavigate } from "react-router-dom";

const ReportesPage = () => {
  // const navigate = useNavigate();
  const [inventario, setInventario] = useState(
    JSON.parse(localStorage.getItem("inventario") || "[]")
  );

  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [confirmEditModal, setConfirmEditModal] = useState(false);
  //abrir el modal
  // const handleOpenModal = () => setShowModal(true);
  //cerrar el modal
  // const handleCloseModal = () => setShowModal(false);

  const [editIndex, setEditIndex] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrecio, setEditPrecio] = useState("");
  const [editCantidad, setEditCantida] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const handleStorageChange = () => {
      setInventario(JSON.parse(localStorage.getItem("inventario") || "[]"));
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleEdit = (index) => {
    setEditModal(true);
    const item = inventario[index];
    setEditIndex(index);
    setEditName(item.name);
    setEditPrecio(item.precio.toString());
    setEditCantida(item.cantidad.toString());
    setError("");
  };
  const handleSaveEdit = () => {
    const precio = parseFloat(editPrecio);
    const cantidad = parseInt(editCantidad);
    if (
      !editName ||
      isNaN(precio) ||
      precio <= 0 ||
      isNaN(cantidad) ||
      cantidad < 0 ||
      cantidad > 10000
    ) {
      setError(
        "Valores incorrectos: nombre no vacío, precio mayor a 0, cantidad no negativa, cantidad entre 0 y 10,000."
      );
      toast.error("Valores incorrectos", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }
    const existingNames = inventario
      .filter((_, i) => i !== editIndex)
      .map((item) => item.name);
    if (existingNames.includes(editName)) {
      setError("El nombre ya existe,elige otro.");
      return;
    }

    const originalItem = inventario[editIndex];
    if (originalItem.precio !== precio || originalItem.name !== editName) {
      setConfirmEditModal(true);
    } else {
      const updatedInventario = [...inventario];
      updatedInventario[editIndex] = {
        name: editName,
        precio,
        cantidad,
        history: originalItem.history
          ? [
              ...originalItem.history,
              {
                action: "Editado",
                date: new Date().toISOString(),
                name: editName,
                precio,
                cantidad,
              },
            ]
          : [
              {
                action: "Editado",
                date: new Date().toISOString(),
                name: editName,
                precio,
                cantidad,
              },
            ],
      };

      setInventario(updatedInventario);
      localStorage.setItem("inventario", JSON.stringify(updatedInventario));
      setEditModal(false);
      setSuccess("Producto y venta actualizados.");
      setEditIndex(null);
      setEditName("");
      setEditPrecio("");
      setEditCantida("");
      setError("");
      // setConfirmEditModal(false);
      toast.success("Producto editado correctamente", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };
  const handleConfirmEdit = () => {
    const precio = parseFloat(editPrecio);
    const cantidad = parseInt(editCantidad);
    const originalUtem = inventario[editIndex];

    const updatedInventario = [...inventario];
    updatedInventario[editIndex] = {
      name: editName,
      precio,
      cantidad,
      history: originalUtem.history
        ? [
            ...originalUtem.history,
            {
              action: "Editado",
              date: new Date().toISOString(),
              name: editName,
              precio,
              cantidad,
            },
          ]
        : [
            {
              action: "Editado",
              date: new Date().toISOString(),
              name: editName,
              precio,
              cantidad,
            },
          ],
    };
    const today = new Date().toISOString().split("T")[0];
    let ventas = JSON.parse(localStorage.getItem("ventas") || "[]");
    ventas = ventas.map((venta) => {
      if (venta.name === originalUtem.name) {
        const newTotal = Number(venta.cantidad) * Number(precio);
        return {
          ...venta,
          name: editName,
          total: newTotal,
          //aqui
          date: today,
        };
      }
      return venta;
    });
    setInventario(updatedInventario);
    localStorage.setItem("inventario", JSON.stringify(updatedInventario));
    localStorage.setItem("ventas", JSON.stringify(ventas));
    window.dispatchEvent(new Event("storage"));
    setEditModal(false);
    setConfirmEditModal(false);
    setEditIndex(null);
    setEditName("");
    setEditPrecio("");
    setEditCantida("");
    setError("");
    toast.success("Producto y ventas actualizados", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };
  const handlDelete = (index) => {
    setEditIndex(index);
    setDeleteModal(true);
    setError("");
  };

  const confirmDelete = () => {
    const updateInventario = inventario.filter((_, i) => i !== editIndex);
    setInventario(updateInventario);
    localStorage.setItem("inventario", JSON.stringify(updateInventario));
    setDeleteModal(false);
    setEditIndex(null);
    toast.success("Producto eliminado correctamente", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const handleCloseModal = () => {
    setEditModal(false);
    setDeleteModal(false);
    setConfirmEditModal(false);
    setEditIndex(null);
    setEditName("");
    setEditPrecio("");
    setEditCantida("");
    setError("");
  };

  const handleExport = () => {
    const data = {
      inventario,
      ventas: JSON.parse(localStorage.getItem("ventas") || "[]"),
    };
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "backup.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Datos exportados correctamente", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const handleImport = (e) => {
    const files = e.target.files[0];
    if (!files) return;
    const reafer = new FileReader();
    reafer.onload = (e) => {
      try {
        if (typeof e.target?.result === "string") {
          const data = JSON.parse(e.target.result);
          if (data.inventario) {
            setInventario(data.inventario);
            localStorage.setItem("inventario", JSON.stringify(data.inventario));
          }
          if (data.ventas) {
            localStorage.setItem("ventas", JSON.stringify(data.ventas));
            window.dispatchEvent(new Event("storage"));
          }
          toast.success("Datos importados correctamente", {
            position: "bottom-right",
            autoClose: 3000,
          });
        }
      } catch {
        toast.error("Error al importar el archivo", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    };
    reafer.readAsText(files);
  };

  return (
    <section className="p-6 shadow-lg bg-dark rounded-xl">
      <h2 className="mb-4">Inventario</h2>
      <ToastContainer />
      {/* {success && (
        <div className="bottom-0 p-3 toast-container position-fixed end-0">
          <div className="toast show" role="alert">
            <div className="text-white toast-header bg-success">
              <strong className="me-auto">Éxito</strong>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={() => setSuccess("")}
              ></button>
            </div>
            <div className="toast-body">{success}</div>
          </div>
        </div>
      )} */}
      <div className="mb-4">
        <button className="btn btn-sm btn-success me-2" onClick={handleExport}>
          <i className="fas fa-upload me-1"></i>Exportar Datos
        </button>
        <label className="btn btn-sm btn-secondary">
          <i className="fas fa-download me-1"></i>Importar Datos
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            style={{ display: "none" }}
          />
        </label>
      </div>
      <div className="nombres">
        <p>Producto</p>
        <p>Cantidad</p>
        <p>Precio</p>
      </div>
      {inventario.length === 0 ? (
        <p>No hay productos en el inventario.</p>
      ) : (
        <ul className="ul_in">
          {inventario.map((item, index) => (
            <>
              <li key={index} className="li">
                <span
                  className={
                    item.cantidad === 0
                      ? "text-decoration-line-through position-relative"
                      : "text-white"
                  }
                  data-bs-toglle="tooltip"
                  title={item.cantidad === 0 ? "Producto agotado" : ""}
                >
                  {item.name}
                </span>
              </li>
              <li key={index} className="li">
                {item.cantidad}
                {item.cantidad === 0 && (
                  <i className="fas fa-exclamation-circle text-danger ms-2"></i>
                )}
                {item.cantidad <= 5 && item.cantidad > 0 && (
                  <i className="fas fa-exclamation-triangle text-warning ms-2"></i>
                )}
              </li>
              <li key={index} className="li">
                ${item.precio}
              </li>
              <div className="editar_borrar">
                <button
                  className="btn btn-primary "
                  // style={{ marginLeft: "10px", backgroundColor: "#007bff" }}
                  onClick={() => handleEdit(index)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fas fa-edit me-1"></i>
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  style={{ cursor: "pointer" }}
                  // style={{ marginLeft: "10px", backgroundColor: "#de3545" }}
                  onClick={() => handlDelete(index)}
                >
                  <i className="fas fa-trash-alt me-1"></i>
                  Borrar
                </button>
              </div>
            </>
          ))}
        </ul>
      )}
      {editModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="border-0 shadow modal-content">
              <div className="text-white modal-header bg-primary">
                <h5>Editar Producto</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                  <label htmlFor="editName" className="form-label fw-bold">
                    Nombre
                  </label>
                  <input
                    id="editName"
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editCantidad" className="form-label fw-bold">
                    Cantidad
                  </label>
                  <input
                    id="editCantidad"
                    type="number"
                    className="form-control"
                    value={editCantidad}
                    onChange={(e) => setEditCantida(e.target.value)}
                    min={0}
                    max={10000}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="editPrecio" className="form-label fw-bold">
                    Precio
                  </label>
                  <input
                    id="editPrecio"
                    type="number"
                    className="form-control"
                    value={editPrecio}
                    onChange={(e) => setEditPrecio(e.target.value)}
                    min={0.01}
                    step={0.01}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveEdit}
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {confirmEditModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <div className="shadow modal-content botder-0">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">Confirmar Cambios</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Cambiar el nombre o precio afectara los totales de las ventas
                  asociadas.?Desea Continuar?
                </p>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleConfirmEdit}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {deleteModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="border-0 shadow modal-content">
              <div className="text-white modal-header bg-danger">
                <h5 className="modal-title">Confirmar Eliminación</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  ?Estas seguro de que quieres eliminar el producto "
                  {inventario[editIndex]?.name}"
                </p>
              </div>
              <div className="modal-footer bg-light">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {(editModal || deleteModal || confirmEditModal) && (
        <div
          className="modal-backdrop fade show"
          onClick={handleCloseModal}
        ></div>
      )}
    </section>
  );
};

export default ReportesPage;
