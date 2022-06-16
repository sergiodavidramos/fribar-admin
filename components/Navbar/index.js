import { useContext, useEffect } from 'react'
import UserContext from '../UserContext'
import Link from 'next/link'
export default () => {
  const {
    signOut,
    setSitNav,
    sid,
    getSucursales,
    setAdmSucursal,
    user,
    getAdmSucursal,
  } = useContext(UserContext)

  function handlerSid() {
    sid ? setSitNav(false) : setSitNav(true)
  }
  function handlerSucursal() {
    if (event.target.value) {
      setAdmSucursal(event.target.value)
    }
  }

  return (
    <nav className="sb-topnav navbar navbar-expand navbar-light bg-clr">
      {user ? (
        user.role === 'GERENTE-ROLE' ? (
          <div className="col-lg-3">
            {getSucursales.length > 0 ? (
              <select
                id="sucursal"
                name="sucursal"
                className="form-control"
                onChange={handlerSucursal}
                defaultValue={getAdmSucursal}
              >
                <option value={0}>Todas las sucursales</option>
                {getSucursales.map((suc) => (
                  <option value={suc._id} key={suc._id}>
                    {suc.nombre} - {suc.direccion} - {suc.ciudad.nombre}
                  </option>
                ))}
              </select>
            ) : (
              ''
            )}
          </div>
        ) : (
          <Link href={'/'}>
            <a class="navbar-brand logo-brand">Fribar Minimarket</a>
          </Link>
        )
      ) : (
        ''
      )}

      <button
        className="btn btn-link btn-sm order-1 order-lg-0"
        id="sidebarToggle"
        onClick={handlerSid}
      >
        <i className="fas fa-bars"></i>
      </button>
      <Link href="/">
        <a className="frnt-link">
          <i className="fas fa-external-link-alt"></i>Inicio
        </a>
      </Link>
      <ul className="navbar-nav ml-auto mr-md-0">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            id="userDropdown"
            href="#"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i className="fas fa-user fa-fw"></i>
          </a>
          <div
            className="dropdown-menu dropdown-menu-right"
            aria-labelledby="userDropdown"
          >
            <Link href="/perfil">
              <a className="dropdown-item admin-dropdown-item">
                Editar Perfil
              </a>
            </Link>
            <a
              className="dropdown-item admin-dropdown-item"
              href="change_password.html"
            >
              Cambiar Contraseña
            </a>
            <a
              className="dropdown-item admin-dropdown-item"
              onClick={() => signOut()}
            >
              Cerrar sesión
            </a>
          </div>
        </li>
      </ul>
    </nav>
  )
}
