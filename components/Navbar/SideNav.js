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
              Tablero
            </a>
          </Link>

          <Link href="/ciudades">
            <a
              className={`nav-link ${
                props.router.pathname.split('/')[1] === 'ciudades'
                  ? 'active'
                  : 'collapsed'
              }`}
              data-toggle="collapse"
              data-target="#collapseLocations"
              aria-expanded="false"
              aria-controls="collapseLocations"
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              Ciudad
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
          </Link>

          <div
            className={`collapse ${
              props.router.pathname.split('/')[1] === 'ciudades'
                ? 'show'
                : ''
            }`}
            id="collapseLocations"
            aria-labelledby="headingTwo"
            data-parent="#sidenavAccordion"
          >
            <nav className="sb-sidenav-menu-nested nav">
              <Link href="/ciudades">
                <a
                  className={`nav-link sub_nav_link ${
                    props.router.pathname === '/ciudades' ? 'active' : ''
                  }`}
                >
                  Todas las ciudades
                </a>
              </Link>
              <Link href="/ciudades/nuevo">
                <a
                  className={`nav-link sub_nav_link ${
                    props.router.pathname === '/ciudades/nuevo'
                      ? 'active'
                      : ''
                  }`}
                >
                  Agregar ciudad
                </a>
              </Link>
            </nav>
          </div>
          <Link href="/sucursales">
            <a
              className={`nav-link ${
                props.router.pathname.split('/')[1] === 'sucursales'
                  ? 'active'
                  : 'collapsed'
              }`}
              data-toggle="collapse"
              data-target="#collapseShops"
              aria-expanded="false"
              aria-controls="collapseShops"
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-store"></i>
              </div>
              Sucursales
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
          </Link>
          <div
            className={`collapse ${
              props.router.pathname.split('/')[1] === 'sucursales'
                ? 'show'
                : ''
            }`}
            id="collapseShops"
            aria-labelledby="headingTwo"
            data-parent="#sidenavAccordion"
          >
            <nav className="sb-sidenav-menu-nested nav">
              <Link href="/sucursales">
                <a
                  className={`nav-link sub_nav_link ${
                    props.router.pathname === '/sucursales' ? 'active' : ''
                  }`}
                >
                  Todas las sucursales
                </a>
              </Link>
              <Link href="/sucursales/nuevo">
                <a
                  className={`nav-link sub_nav_link ${
                    props.router.pathname === '/sucursales/nuevo'
                      ? 'active'
                      : ''
                  }`}
                >
                  Agregar sucursales
                </a>
              </Link>
            </nav>
          </div>
          <Link href="/marcas">
            <a
              className={`nav-link ${
                props.router.pathname.split('/')[1] === 'marcas'
                  ? 'active'
                  : 'collapsed'
              }`}
              data-toggle="collapse"
              data-target="#collapseMarcas"
              aria-expanded="false"
              aria-controls="collapseMarcas"
            >
              <div className="sb-nav-link-icon">
                <i className="fa fa-building"></i>
              </div>
              Marcas
              <div className="sb-sidenav-collapse-arrow">
                <i className="fas fa-angle-down"></i>
              </div>
            </a>
          </Link>
          <div
            className={`collapse ${
              props.router.pathname.split('/')[1] === 'marcas'
                ? 'show'
                : ''
            }`}
            id="collapseMarcas"
            aria-labelledby="headingTwo"
            data-parent="#sidenavAccordion"
          >
            <nav className="sb-sidenav-menu-nested nav">
              <Link href="/marcas">
                <a
                  className={`nav-link sub_nav_link ${
                    props.router.pathname === '/marcas' ? 'active' : ''
                  }`}
                >
                  Todas las marcas
                </a>
              </Link>
              <Link href="/marcas/nuevo">
                <a
                  className={`nav-link sub_nav_link ${
                    props.router.pathname === '/marcas/nuevo'
                      ? 'active'
                      : ''
                  }`}
                >
                  Agregar marca
                </a>
              </Link>
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
                {/* <i className="fas fa-cart-arrow-down"></i> */}
                <i className="fas fa-truck"></i>
              </div>
              Pedidos
            </a>
          </Link>
          <Link href="/venta">
            <a
              className={`nav-link sub_nav_link ${
                props.router.pathname === '/venta' ? 'active' : ''
              }`}
            >
              <div className="sb-nav-link-icon">
                <i className="fas fa-cart-arrow-down"></i>
              </div>
              Venta
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
