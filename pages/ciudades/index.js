import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Link from 'next/link'
import { useEffect, useContext, useState } from 'react'
import UserContext from '../../components/UserContext'
import Notifications, { notify } from 'react-notify-toast'
import Footer from '../../components/Footer'
import { API_URL } from '../../components/Config'

const Ciudad = () => {
  const { signOut } = useContext(UserContext)
  const [ciudades, setCiudades] = useState(false)
  const [estadoCiudad, setEstadoCiudad] = useState(true)

  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    const user = localStorage.getItem('fribar-user')
    if (!tokenLocal && !user) {
      signOut()
    }
    if (JSON.parse(user).role !== 'GERENTE-ROLE') signOut()
    obtenerCuidades(estadoCiudad)
  }, [])

  function obtenerCuidades(estado) {
    fetch(`${API_URL}/ciudad?status=${estado}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 401) {
          signOut()
        }
        return res.json()
      })
      .then((data) => {
        if (data.error)
          notify.show('Error en el servidor (ciudad)', 'error', 2000)
        else {
          setCiudades(data.body)
        }
      })
      .catch((error) => {
        notify.show(error.message, 'error', 2000)
      })
  }
  function handleChangeStateCiudad() {
    setEstadoCiudad(event.target.value)
  }
  function handlerAplicar() {
    event.preventDefault()
    obtenerCuidades(estadoCiudad)
  }
  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Ciudades</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Ciudades</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-12">
                  <Link href="/ciudades/nuevo">
                    <a className="add-btn hover-btn">Agregar ciudad</a>
                  </Link>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="bulk-section mt-30">
                    <div className="input-group">
                      <select
                        id="action"
                        name="action"
                        defaultValue={estadoCiudad}
                        className="form-control"
                        onChange={handleChangeStateCiudad}
                      >
                        <option value="0">Seleccione acción</option>
                        <option value={true}>Activos</option>
                        <option value={false}>Inactivos</option>
                      </select>
                      <div className="input-group-append">
                        <button
                          className="status-btn hover-btn"
                          type="submit"
                          onClick={handlerAplicar}
                        >
                          Aplicar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mt-30 mb-30">
                    <div className="card-title-2">
                      <h4>Todas las ciudades</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th style={{ width: '60px' }}>ID</th>
                              <th>Nombre</th>
                              <th>Estado</th>
                              <th>Accion</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!ciudades ? (
                              <tr>
                                <td>...</td>
                              </tr>
                            ) : (
                              ciudades.map((ciu) => (
                                <tr key={ciu._id}>
                                  <td>{ciu._id}</td>
                                  <td>{ciu.nombre}</td>
                                  <td>
                                    <span
                                      className={`badge-item ${
                                        ciu.status
                                          ? 'badge-status'
                                          : 'badge-status-false'
                                      }`}
                                    >
                                      {ciu.status ? 'Activo' : 'Inactivo'}
                                    </span>
                                  </td>
                                  <td className="action-btns">
                                    <Link
                                      href="/ciudades/[id]"
                                      as={`/ciudades/${ciu._id}`}
                                    >
                                      <a className="edit-btn">
                                        <i className="fas fa-edit"></i>
                                        Editar
                                      </a>
                                    </Link>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
export default Ciudad
