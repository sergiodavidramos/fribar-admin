import Link from 'next/link'
import { withRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import UserContext from '../UserContext'
const SideNav = (props) => {
  const { user, alarm } = useContext(UserContext)
  return (
    <>
      {user && (
        <div id="layoutSidenav_nav">
          <nav
            className="sb-sidenav accordion sb-sidenav-dark"
            id="sidenavAccordion"
          >
            <div className="sb-sidenav-menu">
              <div className="nav">
                {(user.role === 'GERENTE-ROLE' ||
                  user.role === 'ADMIN-ROLE') && (
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
                )}
                {user.role === 'GERENTE-ROLE' && (
                  <>
                    <a
                      style={{ cursor: 'pointer' }}
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
                              props.router.pathname === '/ciudades'
                                ? 'active'
                                : ''
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
                  </>
                )}
                <a
                  style={{ cursor: 'pointer' }}
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
                          props.router.pathname === '/sucursales'
                            ? 'active'
                            : ''
                        }`}
                      >
                        Todas las sucursales
                      </a>
                    </Link>
                    {user.role === 'GERENTE-ROLE' && (
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
                    )}
                    {(user.role === 'GERENTE-ROLE' ||
                      user.role === 'ADMIN-ROLE' ||
                      user.role === 'ALMACEN-ROLE' ||
                      user.role === 'USER-ROLE') && (
                      <Link href="/sucursales/confirmar-traslado">
                        <a
                          className={`nav-link sub_nav_link ${
                            props.router.pathname ===
                            '/sucursales/confirmar-traslado'
                              ? 'active'
                              : ''
                          }`}
                        >
                          Confirmación de traslado
                        </a>
                      </Link>
                    )}
                  </nav>
                </div>
                {(user.role === 'GERENTE-ROLE' ||
                  user.role === 'ADMIN-ROLE') && (
                  <>
                    <a
                      style={{ cursor: 'pointer' }}
                      className={`nav-link ${
                        props.router.pathname.split('/')[1] === 'proveedor'
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
                      Proveedores
                      <div className="sb-sidenav-collapse-arrow">
                        <i className="fas fa-angle-down"></i>
                      </div>
                    </a>

                    <div
                      className={`collapse ${
                        props.router.pathname.split('/')[1] === 'proveedor'
                          ? 'show'
                          : ''
                      }`}
                      id="collapseMarcas"
                      aria-labelledby="headingTwo"
                      data-parent="#sidenavAccordion"
                    >
                      <nav className="sb-sidenav-menu-nested nav">
                        <Link href="/proveedor">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === '/proveedor'
                                ? 'active'
                                : ''
                            }`}
                          >
                            Todos los proveedores
                          </a>
                        </Link>
                        <Link href="/proveedor/nuevo">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === '/proveedor/nuevo'
                                ? 'active'
                                : ''
                            }`}
                          >
                            Agregar proveedor
                          </a>
                        </Link>
                      </nav>
                    </div>
                  </>
                )}
                {(user.role === 'GERENTE-ROLE' ||
                  user.role === 'ADMIN-ROLE') && (
                  <>
                    <a
                      style={{ cursor: 'pointer' }}
                      className={`nav-link ${
                        props.router.pathname.split('/')[1] ===
                        'categorias'
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

                    <div
                      className={`collapse ${
                        props.router.pathname.split('/')[1] ===
                        'categorias'
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
                              props.router.pathname === '/categorias'
                                ? 'active'
                                : ''
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
                  </>
                )}
                <a
                  style={{ cursor: 'pointer' }}
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
                          props.router.pathname === '/productos'
                            ? 'active'
                            : ''
                        }`}
                      >
                        Todos los Productos
                      </a>
                    </Link>
                    {(user.role === 'GERENTE-ROLE' ||
                      user.role === 'ADMIN-ROLE' ||
                      user.role === 'ALMACEN-ROLE') && (
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
                    )}
                  </nav>
                </div>
                <a
                  style={{ cursor: 'pointer' }}
                  className={`nav-link ${
                    props.router.pathname.split('/')[1] === 'pedidos'
                      ? 'active'
                      : 'collapsed'
                  }`}
                  data-toggle="collapse"
                  data-target="#collapsePedidos"
                  aria-expanded="false"
                  aria-controls="collapsePedidos"
                >
                  <div className="sb-nav-link-icon">
                    {/* <i className="fas fa-cart-arrow-down"></i> */}
                    <i className="fas fa-truck"></i>
                  </div>
                  Pedidos
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>

                <div
                  className={`collapse ${
                    props.router.pathname.split('/')[1] === 'pedidos'
                      ? 'show'
                      : ''
                  }`}
                  id="collapsePedidos"
                  aria-labelledby="headingTwo"
                  data-parent="#sidenavAccordion"
                >
                  <nav className="sb-sidenav-menu-nested nav">
                    <Link href="/pedidos">
                      <a
                        className={`nav-link sub_nav_link ${
                          props.router.pathname === '/pedidos'
                            ? 'active'
                            : ''
                        }`}
                        onClick={() => alarm.play()}
                      >
                        Escuchar pedidos de hoy
                      </a>
                    </Link>
                    {(user.role === 'GERENTE-ROLE' ||
                      user.role === 'ADMIN-ROLE') && (
                      <Link href="/pedidos/lista">
                        <a
                          className={`nav-link sub_nav_link ${
                            props.router.pathname === '/pedidos/lista'
                              ? 'active'
                              : ''
                          }`}
                        >
                          Pedidos anteriores
                        </a>
                      </Link>
                    )}
                  </nav>
                </div>

                <a
                  style={{ cursor: 'pointer' }}
                  className={`nav-link ${
                    props.router.pathname.split('/')[1] === 'venta'
                      ? 'active'
                      : 'collapsed'
                  }`}
                  data-toggle="collapse"
                  data-target="#collapseVentas"
                  aria-expanded="false"
                  aria-controls="collapseVentas"
                >
                  <div className="sb-nav-link-icon">
                    <i className="fas fa-cart-arrow-down"></i>
                  </div>
                  Ventas
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down"></i>
                  </div>
                </a>
                <div
                  className={`collapse ${
                    props.router.pathname.split('/')[1] === 'venta'
                      ? 'show'
                      : ''
                  }`}
                  id="collapseVentas"
                  aria-labelledby="headingTwo"
                  data-parent="#sidenavAccordion"
                >
                  <nav className="sb-sidenav-menu-nested nav">
                    <Link href="/venta">
                      <a
                        className={`nav-link sub_nav_link ${
                          props.router.pathname === '/venta'
                            ? 'active'
                            : ''
                        }`}
                      >
                        Realizar Venta
                      </a>
                    </Link>
                    {(user.role === 'GERENTE-ROLE' ||
                      user.role === 'ADMIN-ROLE') && (
                      <Link href="/venta/lista">
                        <a
                          className={`nav-link sub_nav_link ${
                            props.router.pathname === '/venta/lista'
                              ? 'active'
                              : ''
                          }`}
                        >
                          Ventas anteriores
                        </a>
                      </Link>
                    )}
                  </nav>
                </div>

                {(user.role === 'GERENTE-ROLE' ||
                  user.role === 'ADMIN-ROLE' ||
                  user.role === 'ALMACEN-ROLE') && (
                  <>
                    <a
                      style={{ cursor: 'pointer' }}
                      className={`nav-link ${
                        props.router.pathname.split('/')[1] === 'compras'
                          ? 'active'
                          : 'collapsed'
                      }`}
                      data-toggle="collapse"
                      data-target="#collapseCompras"
                      aria-expanded="false"
                      aria-controls="collapseCompras"
                    >
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-cart-arrow-down"></i>
                      </div>
                      Compras
                      <div className="sb-sidenav-collapse-arrow">
                        <i className="fas fa-angle-down"></i>
                      </div>
                    </a>
                    <div
                      className={`collapse ${
                        props.router.pathname.split('/')[1] === 'compras'
                          ? 'show'
                          : ''
                      }`}
                      id="collapseCompras"
                      aria-labelledby="headingTwo"
                      data-parent="#sidenavAccordion"
                    >
                      <nav className="sb-sidenav-menu-nested nav">
                        <Link href="/compras">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === '/compras'
                                ? 'active'
                                : ''
                            }`}
                          >
                            Realizar Compra
                          </a>
                        </Link>

                        <Link href="/compras/lista">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === '/compras/lista'
                                ? 'active'
                                : ''
                            }`}
                          >
                            Compras anteriores
                          </a>
                        </Link>
                      </nav>
                    </div>
                  </>
                )}
                {(user.role === 'GERENTE-ROLE' ||
                  user.role === 'ADMIN-ROLE') && (
                  <Link href="/clientes">
                    <a
                      className={`nav-link ${
                        props.router.pathname === '/clientes'
                          ? 'active'
                          : ''
                      }`}
                    >
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      Clientes
                    </a>
                  </Link>
                )}
                {(user.role === 'GERENTE-ROLE' ||
                  user.role === 'ADMIN-ROLE') && (
                  <>
                    <a
                      style={{ cursor: 'pointer' }}
                      className={`nav-link ${
                        props.router.pathname.split('/')[1] === 'usuarios'
                          ? 'active'
                          : 'collapsed'
                      }`}
                      href="#"
                      data-toggle="collapse"
                      data-target="#collapseAreas"
                      aria-expanded="false"
                      aria-controls="collapseAreas"
                    >
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-user-tie"></i>
                      </div>
                      Usuarios
                      <div className="sb-sidenav-collapse-arrow">
                        <i className="fas fa-angle-down"></i>
                      </div>
                    </a>
                    <div
                      className={`collapse ${
                        props.router.pathname.split('/')[1] === 'usuarios'
                          ? 'show'
                          : ''
                      }`}
                      id="collapseAreas"
                      aria-labelledby="headingTwo"
                      data-parent="#sidenavAccordion"
                    >
                      <nav className="sb-sidenav-menu-nested nav">
                        <Link href="/usuarios">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === '/usuarios'
                                ? 'active'
                                : ''
                            }`}
                          >
                            Todos los usuarios
                          </a>
                        </Link>
                        <Link href="/usuarios/nuevo">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === '/usuarios/nuevo'
                                ? 'active'
                                : ''
                            }`}
                          >
                            Agregar usuario
                          </a>
                        </Link>
                      </nav>
                    </div>
                  </>
                )}
                {/* PROBANDO NAV */}
                {(user.role === 'GERENTE-ROLE' ||
                  user.role === 'ADMIN-ROLE') && (
                  <>
                    <a
                      style={{ cursor: 'pointer' }}
                      className={`nav-link ${
                        props.router.pathname.split('/')[1] === 'ofertas'
                          ? 'active'
                          : 'collapsed'
                      }`}
                      href="#"
                      data-toggle="collapse"
                      data-target="#collapseOfertas"
                      aria-expanded="false"
                      aria-controls="collapseOfertas"
                    >
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-gift"></i>
                      </div>
                      Ofertas
                      <div className="sb-sidenav-collapse-arrow">
                        <i className="fas fa-angle-down"></i>
                      </div>
                    </a>
                    <div
                      className={`collapse ${
                        props.router.pathname.split('/')[1] === 'ofertas'
                          ? 'show'
                          : ''
                      }`}
                      id="collapseOfertas"
                      aria-labelledby="headingTwo"
                      data-parent="#sidenavAccordion"
                    >
                      <nav className="sb-sidenav-menu-nested nav">
                        <Link href="/ofertas">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === '/ofertas'
                                ? 'active'
                                : ''
                            }`}
                          >
                            Todas las ofertas
                          </a>
                        </Link>
                        <Link href="/ofertas/nuevo">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === '/ofertas/nuevo'
                                ? 'active'
                                : ''
                            }`}
                          >
                            Agregar oferta
                          </a>
                        </Link>
                      </nav>
                    </div>
                  </>
                )}

                {(user.role === 'GERENTE-ROLE' ||
                  user.role === 'ADMIN-ROLE') && (
                  <>
                    <a
                      style={{ cursor: 'pointer' }}
                      className={`nav-link ${
                        props.router.pathname.split('/')[1] ===
                        'costo-envio'
                          ? 'active'
                          : 'collapsed'
                      }`}
                      data-toggle="collapse"
                      data-target="#collapseCostoEnvio"
                      aria-expanded="false"
                      aria-controls="collapseCostoEnvio"
                    >
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-hand-holding-usd"></i>
                      </div>
                      Costos de envio
                      <div className="sb-sidenav-collapse-arrow">
                        <i className="fas fa-angle-down"></i>
                      </div>
                    </a>

                    <div
                      className={`collapse ${
                        props.router.pathname.split('/')[1] ===
                        'costo-envio'
                          ? 'show'
                          : ''
                      }`}
                      id="collapseCostoEnvio"
                      aria-labelledby="headingTwo"
                      data-parent="#sidenavAccordion"
                    >
                      <nav className="sb-sidenav-menu-nested nav">
                        <Link href="/costo-envio">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname === '/costo-envio'
                                ? 'active'
                                : ''
                            }`}
                          >
                            Todos los costos
                          </a>
                        </Link>
                        <Link href="/costo-envio/nuevo">
                          <a
                            className={`nav-link sub_nav_link ${
                              props.router.pathname ===
                              '/costo-envio/nuevo'
                                ? 'active'
                                : ''
                            }`}
                          >
                            Agregar Precio
                          </a>
                        </Link>
                      </nav>
                    </div>
                  </>
                )}

                {user.role === 'DELIVERY-ROLE' && (
                  <Link href={'/delivery'}>
                    <a className="nav-link">
                      <div
                        className="sb-nav-link-icon"
                        style={{ color: '#ffffff' }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="16"
                          width="20"
                          viewBox="0 0 640 512"
                        >
                          <path
                            fill={
                              props.router.pathname === '/delivery'
                                ? '#fff'
                                : '#c7c7c7'
                            }
                            d="M280 32c-13.3 0-24 10.7-24 24s10.7 24 24 24h57.7l16.4 30.3L256 192l-45.3-45.3c-12-12-28.3-18.7-45.3-18.7H64c-17.7 0-32 14.3-32 32v32h96c88.4 0 160 71.6 160 160c0 11-1.1 21.7-3.2 32h70.4c-2.1-10.3-3.2-21-3.2-32c0-52.2 25-98.6 63.7-127.8l15.4 28.6C402.4 276.3 384 312 384 352c0 70.7 57.3 128 128 128s128-57.3 128-128s-57.3-128-128-128c-13.5 0-26.5 2.1-38.7 6L418.2 128H480c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H459.6c-7.5 0-14.7 2.6-20.5 7.4L391.7 78.9l-14-26c-7-12.9-20.5-21-35.2-21H280zM462.7 311.2l28.2 52.2c6.3 11.7 20.9 16 32.5 9.7s16-20.9 9.7-32.5l-28.2-52.2c2.3-.3 4.7-.4 7.1-.4c35.3 0 64 28.7 64 64s-28.7 64-64 64s-64-28.7-64-64c0-15.5 5.5-29.7 14.7-40.8zM187.3 376c-9.5 23.5-32.5 40-59.3 40c-35.3 0-64-28.7-64-64s28.7-64 64-64c26.9 0 49.9 16.5 59.3 40h66.4C242.5 268.8 190.5 224 128 224C57.3 224 0 281.3 0 352s57.3 128 128 128c62.5 0 114.5-44.8 125.8-104H187.3zM128 384a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
                          />
                        </svg>
                      </div>
                      Delivery
                    </a>
                  </Link>
                )}
                {(user.role === 'GERENTE-ROLE' ||
                  user.role === 'ADMIN-ROLE') && (
                  <Link href={'/reportes'}>
                    <a
                      className={`nav-link ${
                        props.router.pathname === '/reportes'
                          ? 'active'
                          : ''
                      }`}
                    >
                      <div className="sb-nav-link-icon">
                        <i className="fas fa-chart-bar"></i>
                      </div>
                      Reportes
                    </a>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
export default withRouter(SideNav)
