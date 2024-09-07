import TopNavbar from '../components/Navbar'
import SideNav from '../components/Navbar/SideNav'
import Link from 'next/link'
import { useEffect, useContext, useState } from 'react'
import UserContext from '../components/UserContext'
import Notifications, { notify } from 'react-notify-toast'
import Footer from '../components/Footer'
import { API_URL } from '../components/Config'
import moment from 'moment'

const Solicitud = () => {
  const { signOut } = useContext(UserContext)
  const [solicitudes, setSolicitudes] = useState(false)
  moment.locale('es')

  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    const user = localStorage.getItem('fribar-user')
    if (!tokenLocal && !user) {
      signOut()
    }
    obtenerSolicitudes()
  }, [])

  function obtenerSolicitudes() {
    fetch(`${API_URL}/solicitud/all`, {
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
          setSolicitudes(data.body)
        }
      })
      .catch((error) => {
        notify.show(error.message, 'error', 2000)
      })
  }
  const handleChangeStatus = (id, status) => {
    fetch(`${API_URL}/solicitud/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        status: status,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data)
          notify.show('Error al cambiar el estado', 'error')
        } else {
          notify.show('Estado Cambiado', 'success')
        }
      })
      .catch((error) => notify.show('Error en el servidor', 'error', 2000))
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
              <h2 className="mt-30 page-title">
                Solicitudes de los clientes
              </h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Solicitudes</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mt-30 mb-30">
                    <div className="card-title-2">
                      <h4>Todas las solicitudes</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th>Nombre del cliente</th>
                              <th>Correo</th>
                              <th>Mensaje</th>
                              <th>fecha</th>
                              <th>Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!solicitudes ? (
                              <tr>
                                <td>...</td>
                              </tr>
                            ) : (
                              solicitudes.map((soli) => (
                                <tr key={soli._id}>
                                  <td>{soli.nombreCliente}</td>
                                  <td>{soli.correoCliente}</td>
                                  <td>{soli.mensaje}</td>
                                  <td>
                                    {moment(soli.fecha).format('LL')}
                                  </td>
                                  <td>
                                    <select
                                      id="action"
                                      name="action"
                                      className="form-control"
                                      defaultValue={soli.status}
                                      onChange={(value) =>
                                        handleChangeStatus(
                                          soli._id,
                                          value.target.value
                                        )
                                      }
                                    >
                                      <option
                                        value={false}
                                        style={{ color: 'red' }}
                                      >
                                        No atendido
                                      </option>
                                      <option
                                        value={true}
                                        style={{ color: 'green' }}
                                      >
                                        Atendido
                                      </option>
                                    </select>
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
export default Solicitud
