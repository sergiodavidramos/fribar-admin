import { useContext } from 'react'
import UserContext from '../UserContext'
import Link from 'next/link'
export default () => {
  const { signOut, setSitNav, sid } = useContext(UserContext)
  function handlerSid() {
    sid ? setSitNav(false) : setSitNav(true)
  }
  return (
    <nav className="sb-topnav navbar navbar-expand navbar-light bg-clr">
      <a className="navbar-brand logo-brand" href="index.html">
        FriFolly
      </a>
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
