import React, { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Link, useNavigate, replace } from "react-router-dom";

import * as Icons from "../assets/svgs";
const Navbar = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const navbarRef = useRef<HTMLDivElement | null>(null);

  const abrirMenu = () => setExpanded(!expanded);
  const cerrarMenu = () => setExpanded(false);

  //abrir el modal
  const handleOpenModal = () => setShowModal(true);
  //cerrar el modal
  const handleCloseModal = () => setShowModal(false);

  //Limpiar datos del local Storage
  const handleClearData = () => {
    navigate("/productos");
    localStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        expanded &&
        navbarRef.current &&
        !navbarRef.current.contains(e.target) &&
        !e.target.closest(".navbar-toggler")
      ) {
        cerrarMenu();
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [expanded]);

  // para utilizar con el hook
  // useClickOutside(navbarRef, () => {
  //   if (expanded) setExpanded(false);
  // });

  //sin el hook
  // useEffect(() => {
  //   const handleClickOutside = (e) => {
  //     if (navbarRef.current && !navbarRef.current.contains(e.target)) {
  //       setExpanded(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    const redirect = sessionStorage.redirect;
    if (redirect) {
      delete sessionStorage.redirect;
      if (redirect !== window.location.href) {
        navigate(redirect.replace(window.location.origin, ""));
      }
    }
  }, [navigate]);

  return (
    <>
      <nav
        className="shadow-sm navbar navbar-expand-lg navbar-dark bg-light"
        ref={navbarRef}
      >
        <div className="container-fluid">
          <Link
            className="flex navbar-brand justify-content-center align-items-center ms-5"
            onClick={cerrarMenu}
            to={"/"}
          >
            <img
              className="logo rounded-1"
              src={Icons.myLogo}
              style={{ width: "35px" }}
            />{" "}
            Tienda
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
            aria-controls="navbarContent"
            aria-expanded={expanded}
            aria-label="Toggle navigation"
            onClick={abrirMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className={`collapse navbar-collapse justify-content-end pe-3 ${
              expanded ? "show" : ""
            }`}
            id="navbarContent"
          >
            <ul className="mb-2 navbar-nav mb-lg-0 ">
              <li className="nav-item active">
                <Link
                  onClick={cerrarMenu}
                  className="px-4 py-2 nav-link"
                  to={"/productos"}
                >
                  Add Productos
                </Link>
              </li>
              <li onClick={cerrarMenu} className="nav-item ">
                <Link className="px-4 py-2 nav-link" to={"/reportes"}>
                  Productos
                </Link>
              </li>
              <li onClick={cerrarMenu} className="nav-item">
                <Link className="px-4 py-2 nav-link" to={"/ventas"}>
                  Ventas
                </Link>
              </li>
              <li onClick={cerrarMenu} className="nav-item">
                <Link className="px-4 py-2 nav-link" to={"/estadisticas"}>
                  Estadísticas
                </Link>
              </li>
              <li onClick={cerrarMenu} className="nav-item me-3">
                <Link className="px-4 py-2 nav-link" to={"/graficos"}>
                  Gráficos
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* <button
        className="borrar-btn"
        // style={{
        //   backgroundColor: "#dc3545",
        //   margin: "10px 0",
        // }}
        onClick={handleClearData}
      >
        Limpiar Datos
      </button> */}

      <button className="borrar-btn" onClick={handleOpenModal}>
        Limpiar Datos
      </button>

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Confirmar eliminación</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <p>?Estas seguro de que quieres borrar todos los datos?</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button className="btn btn-danger" onClick={handleClearData}>
                  Borrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
