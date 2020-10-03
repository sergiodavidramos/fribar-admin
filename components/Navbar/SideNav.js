import Link from 'next/link'
import { withRouter } from 'next/router'
const SideNav = (props) => (
  <div id="layoutSidenav_nav">
    <nav
      className="sb-sidenav accordion sb-sidenav-dark"
      id="sidenavAccordion"
    >
      <div className="sb-sidenav-menu">
        <div className="nav">
          <Link href="/">
            <a
              className={`nav-link ${
                props.router.pathname === '/' ? 'active' : ''
              }`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-tachometer-alt"></i>
              </div>
              Dashboard
            </a>
          </Link>
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseLayouts"
            aria-expanded="false"
            aria-controls="collapseLayouts"
          >
            <div className="sb-nav-link-icon">
              <i className="fas fa-newspaper"></i>
            </div>
            Posts
            <div className="sb-sidenav-collapse-arrow">
              <i className="fas fa-angle-down"></i>
            </div>
          </a>
          <div
            className="collapse"
            id="collapseLayouts"
            aria-labelledby="headingOne"
            data-parent="#sidenavAccordion"
          >
            <nav className="sb-sidenav-menu-nested nav">
              <a className="nav-link sub_nav_link" href="posts.html">
                All Posts
              </a>
              <a className="nav-link sub_nav_link" href="add_post.html">
                Add New
              </a>
              <a
                className="nav-link sub_nav_link"
                href="post_categories.html"
              >
                Categories
              </a>
              <a className="nav-link sub_nav_link" href="post_tags.html">
                Tags
              </a>
            </nav>
          </div>
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseLocations"
            aria-expanded="false"
            aria-controls="collapseLocations"
          >
            <div className="sb-nav-link-icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            Locations
            <div className="sb-sidenav-collapse-arrow">
              <i className="fas fa-angle-down"></i>
            </div>
          </a>
          <div
            className="collapse"
            id="collapseLocations"
            aria-labelledby="headingTwo"
            data-parent="#sidenavAccordion"
          >
            <nav className="sb-sidenav-menu-nested nav">
              <a className="nav-link sub_nav_link" href="locations.html">
                All Locations
              </a>
              <a
                className="nav-link sub_nav_link"
                href="add_location.html"
              >
                Add Location
              </a>
            </nav>
          </div>
          <a
            className="nav-link collapsed"
            href="#"
            data-toggle="collapse"
            data-target="#collapseAreas"
            aria-expanded="false"
            aria-controls="collapseAreas"
          >
            <div className="sb-nav-link-icon">
              <i className="fas fa-map-marked-alt"></i>
            </div>
            Areas
            <div className="sb-sidenav-collapse-arrow">
              <i className="fas fa-angle-down"></i>
            </div>
          </a>
          <div
            className="collapse"
            id="collapseAreas"
            aria-labelledby="headingTwo"
            data-parent="#sidenavAccordion"
          >
            <nav className="sb-sidenav-menu-nested nav">
              <a className="nav-link sub_nav_link" href="areas.html">
                All Areas
              </a>
              <a className="nav-link sub_nav_link" href="add_area.html">
                Add Area
              </a>
            </nav>
          </div>
          <Link href="/categorias">
            <a
              className={`nav-link ${
                props.router.pathname.split('/')[1] === 'categorias'
                  ? 'active'
                  : 'collapsed'
              }`}
              data-toggle="collapse"
              data-target="#collapseCategories"
              aria-expanded="false"
              aria-controls="collapseCategories"
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-list"></i>
              </div>
              Categorias
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
          </Link>
          <div
            className={`collapse ${
              props.router.pathname.split('/')[1] === 'categorias'
                ? 'show'
                : ''
            }`}
            id="collapseCategories"
            aria-labelledby="headingTwo"
            data-parent="#sidenavAccordion"
          >
            <nav className="sb-sidenav-menu-nested nav">
              <Link href="/categorias">
                <a
                  className={`nav-link sub_nav_link ${
                    props.router.pathname === '/categorias' ? 'active' : ''
                  }`}
                >
                  Todas las Categorias
                </a>
              </Link>
              <Link href="/categorias/nuevo">
                <a
                  className={`nav-link sub_nav_link ${
                    props.router.pathname === '/categorias/nuevo'
                      ? 'active'
                      : ''
                  }`}
                >
                  Agregar Categoria
                </a>
              </Link>
            </nav>
          </div>
          <Link href="/productos">
            <a
              className={`nav-link ${
                props.router.pathname.split('/')[1] === 'productos'
                  ? 'active'
                  : 'collapsed'
              }`}
              data-toggle="collapse"
              data-target="#collapseProducts"
              aria-expanded="false"
              aria-controls="collapseProducts"
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-box"></i>
              </div>
              Productos
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
          </Link>

          <div
            className={`collapse ${
              props.router.pathname.split('/')[1] === 'productos'
                ? 'show'
                : ''
            }`}
            id="collapseProducts"
            aria-labelledby="headingTwo"
            data-parent="#sidenavAccordion"
          >
            <nav className="sb-sidenav-menu-nested nav">
              <Link href="/productos">
                <a
                  className={`nav-link sub_nav_link ${
                    props.router.pathname === '/productos' ? 'active' : ''
                  }`}
                >
                  Todos los Productos
                </a>
              </Link>
              <Link href="/productos/nuevo">
                <a
                  className={`nav-link sub_nav_link ${
                    props.router.pathname === '/productos/nuevo'
                      ? 'active'
                      : ''
                  }`}
                >
                  Agregar Producto
                </a>
              </Link>
            </nav>
          </div>
          <Link href="/pedidos">
            <a
              className={`nav-link sub_nav_link ${
                props.router.pathname === '/pedidos' ? 'active' : ''
              }`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-cart-arrow-down"></i>
              </div>
              Pedidos
            </a>
          </Link>
          <Link href="/clientes">
            <a
              className={`nav-link ${
                props.router.pathname === '/clientes' ? 'active' : ''
              }`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-users"></i>
              </div>
              Clientes
            </a>
          </Link>
          <Link href="/usuarios">
            <a
              className={`nav-link ${
                props.router.pathname === '/usuarios' ? 'active' : ''
              }`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              Usuarios
            </a>
          </Link>
          <Link href="/ofertas">
            <a
              className={`nav-link ${
                props.router.pathname === '/ofertas' ? 'active' : ''
              }`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-gift"></i>
              </div>
              Ofertas
            </a>
          </Link>
          <a className="nav-link" href="reports.html">
            <div className="sb-nav-link-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            Reportes
          </a>
        </div>
      </div>
    </nav>
  </div>
)
export default withRouter(SideNav)
