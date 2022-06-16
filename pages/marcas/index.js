import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Link from 'next/link'
import { useEffect, useContext, useState } from 'react'
import UserContext from '../../components/UserContext'
import Notifications, { notify } from 'react-notify-toast'
import Footer from '../../components/Footer'

const Ciudad = () => {
  const [signOut] = useContext(UserContext)
  const [marcas, setMarcas] = useState(false)
  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    if (!tokenLocal) {
      signOut()
    }
    fetch(`http://localhost:3001/marca`, {
      method: 'GET',
    })
      .then((res) => {
        if (res.status === 401) {
          signOut()
        }
        return res.json()
      })
      .then((data) => {
        if (data.error) {
          console.log(data)
          notify.show('Error en el servidor (marca)', 'error', 2000)
        } else {
          setMarcas(data.body)
        }
      })
      .catch((error) => {
        notify.show(error.message, 'error', 2000)
      })
  }, [])
  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Marcas</h2>
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
                  <Link href="/marcas/nuevo">
                    <a className="add-btn hover-btn">Agregar marca</a>
                  </Link>
                </div>
                <div className="col-lg-4 col-md-4">
                  <div className="bulk-section mt-30">
                    <div className="input-group">
                      <select
                        id="action"
                        name="action"
                        defaultValue="0"
                        className="form-control"
                      >
                        <option value="0">Seleccione acción</option>
                        <option value={true}>Activos</option>
                        <option value={false}>Inactivos</option>
                      </select>
                      <div className="input-group-append">
                        <button
                          className="status-btn hover-btn"
                          type="submit"
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
                      <h4>Todas las Marcas</h4>
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
                            {!marcas ? (
                              <tr>
                                <td>...</td>
                              </tr>
                            ) : (
                              marcas.map((ciu) => (
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
                                      href="/marcas/[id]"
                                      as={`/marcas/${ciu._id}`}
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
