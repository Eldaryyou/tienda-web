import "../styles/footer.css";
import * as Icons from "../assets/svgs";
const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="footer__main">
          <a href="#" className="footer__logo-link">
            <img
              src={Icons.myLogo}
              className="footer__logo w-25 rounded-bottom-circle"
            />
          </a>

          <nav className="footer__links">
            <a href="/" className="footer__link">
              Sobre Mí
            </a>
            <a href="/reportes" className="footer__link">
              Inventario
            </a>
            <a href={"/ventas"} className="footer__link">
              Ventas
            </a>
            <a href={"/estadisticas"} className="footer__link">
              Estadísticas
            </a>
            <a href={"/graficos"} className="footer__link">
              Gráficos
            </a>
          </nav>
          <article className="footer__contact">
            <h4 className="footer__copy">Contáctame:</h4>

            <p className="footer__info">
              <i className=""></i>
              Email: darienbolanoarrio20@gmail.com
            </p>

            <p className="footer__info">
              <i className=""></i>
              Teléfono: 55419355
            </p>

            <p className="footer__info">
              Dirección: Calle central sfsfsdfsdfsdffds.
            </p>
          </article>

          <form className="footer__newsletter">
            <input type="email" placeholder="Email" className="footer__email" />
            <input
              type="submit"
              value="Suscribete "
              className="footer__submit"
            />
          </form>

          <nav className="footer__social">
            <a href="#" className="footer__social-links">
              <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
            </a>

            <a href="#" className="footer__social-links">
              <i className="fa-brands fa-facebook" aria-hidden="true"></i>
            </a>

            <a href="#" className="footer__social-links">
              <i className="fa-brands fa-instagram"></i>
            </a>
          </nav>
        </div>

        <div className="footer__copyright">
          <p className="footer__copyright-text">
            &copy; DarienBT Design - Derechos reservados.
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
