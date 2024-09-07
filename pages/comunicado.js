import Footer from '../components/Footer'
import TopNavbar from '../components/Navbar'
import SideNav from '../components/Navbar/SideNav'
import Notifications, { notify } from 'react-notify-toast'
import Link from 'next/link'
import { useEffect, useContext, useState } from 'react'
import UserContext from '../components/UserContext'
import axios from 'axios'
import { API_URL } from '../components/Config'

const Comunicado = () => {
  const { signOut } = useContext(UserContext)
  const [token, setToken] = useState(false)
  const [comunicado, setComunicado] = useState(false)
  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    const user = localStorage.getItem('fribar-user')
    if (!tokenLocal && !user) {
      signOut()
    }
    if (
      JSON.parse(user).role === 'GERENTE-ROLE' ||
      JSON.parse(user).role === 'ADMIN-ROLE'
    ) {
    } else signOut()
    setToken(tokenLocal)
    getComunicado(tokenLocal)
  }, [])

  const getComunicado = async (token) => {
    const res = await axios.get(`${API_URL}/comunicado/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'COntent-Type': 'application/json',
      },
    })
    if (res.status === 401) signOut()
    else {
      if (res.data.body.length > 0) {
        setComunicado(res.data.body[0])
      }
    }
  }
  const handlerSubmitComunicado = async () => {
    let target = event.target
    event.preventDefault()
    if (!target[0].value || !target[1].value || !target[2].value)
      notify.show(
        'Por favor todos los campos deben ser llenados',
        'warning',
        2000
      )
    else {
      try {
        if (comunicado === false) {
          const res = await axios.post(
            `${API_URL}/comunicado`,
            {
              titulo: target[0].value,
              cuerpo: target[1].value,
              final: target[2].value,
              state: target[3].value,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'COntent-Type': 'application/json',
              },
            }
          )
          if (res.status === 401) signOut()
          if (res.data.error) {
            notify.show(
              `Error en el Servidor: ${res.data.status}`,
              'error'
            )
          } else {
            notify.show('Comunicado agregado con Exito! ', 'success', 2000)
          }
        } else {
          const res = await axios.patch(
            `${API_URL}/comunicado/actualizar/${comunicado._id}`,
            {
              titulo: target[0].value,
              cuerpo: target[1].value,
              final: target[2].value,
              state: target[3].value,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'COntent-Type': 'application/json',
              },
            }
          )
          if (res.status === 401) signOut()
          if (res.data.error) {
            notify.show(
              `Error en el Servidor: ${res.data.status}`,
              'error'
            )
          } else {
            notify.show(
              'Comunicado actualizado con Exito! ',
              'success',
              2000
            )
          }
        }
      } catch (error) {
        console.log(error)
        notify.show(
          `Error en el Servidor: ${error.response.status}`,
          'error'
        )
      }
    }
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
              <h2 className="mt-30 page-title">Comunicado</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  Agregar-actualizar Comunicado
                </li>
              </ol>
              <div className="row">
                <div className="col-lg-5 col-md-6">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Agregar-Actualizar comunicado</h4>
                    </div>
                    <div className="card-body-table">
                      <form onSubmit={handlerSubmitComunicado}>
                        <div className="news-content-right pd-20">
                          <div className="form-group">
                            <label className="form-label">Titulo*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Titulo del comunicado"
                              required
                              defaultValue={
                                comunicado ? comunicado.titulo : ''
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Mersaje/cuerpo*
                            </label>
                            <textarea
                              className="form-control"
                              placeholder="Mensaje don comunicado"
                              required
                              defaultValue={
                                comunicado ? comunicado.cuerpo : ''
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Pie del comunicado*
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Final del comunicado"
                              required
                              defaultValue={
                                comunicado ? comunicado.final : ''
                              }
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Estado*</label>
                            <select
                              id="status"
                              name="status"
                              className="form-control"
                              defaultValue={
                                comunicado ? comunicado.state : false
                              }
                            >
                              <option value={true}>Activo</option>
                              <option value={false}>Inactivo</option>
                            </select>
                          </div>

                          <button className="save-btn hover-btn">
                            Agregar o actualizar comunicado
                          </button>
                        </div>
                      </form>
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

export default Comunicado
