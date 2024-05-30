import Footer from '../../components/Footer'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Notifications, { notify } from 'react-notify-toast'
import Link from 'next/link'
import { useEffect, useContext, useState } from 'react'
import UserContext from '../../components/UserContext'
import { useRouter } from 'next/router'
import { API_URL } from '../../components/Config'
const ciudadNueva = () => {
  const { signOut } = useContext(UserContext)
  const [token, setToken] = useState(false)
  const [ciudad, setCiudad] = useState(null)
  const router = useRouter()
  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    const user = localStorage.getItem('fribar-user')
    if (!tokenLocal && !user) {
      signOut()
    }
    if (JSON.parse(user).role !== 'GERENTE-ROLE') signOut()
    if (!ciudad && router && router.query.id) {
      const { id } = router.query
      fetch(`${API_URL}/ciudad/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 401) signOut()
          return res.json()
        })
        .then((data) => {
          if (data.error)
            notify.show('Error en el servidor', 'error', 2000)
          else {
            setCiudad(data.body)
            setToken(tokenLocal)
          }
        })
        .catch((err) => {
          notify.show('Error en el servidor', 'error', 2000)
        })
    }
  }, [router])

  const handlerEditCiudad = () => {
    let target = event.target
    event.preventDefault()
    if (!target[0].value)
      notify.show(
        'Por favor todos los campos deben ser llenados',
        'warning',
        2000
      )
    else {
      fetch(`${API_URL}/ciudad/${ciudad._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          nombre: target[0].value,
          status: target[1].value,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          'COntent-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 401) signOut()
          return res.json()
        })
        .then((res) => {
          if (res.error) notify.show(res.body, 'error', 2000)
          else notify.show('Ciudad editado con Exito! ', 'success', 2000)
        })
        .catch((error) => {
          console.log(error)
          notify.show('Error en el Servidor', 'error')
        })
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
              <h2 className="mt-30 page-title">Ubicaciones</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/ciudades">
                    <a>Ciudades</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Editar ciudad</li>
              </ol>
              {ciudad ? (
                <div className="row">
                  <div className="col-lg-5 col-md-6">
                    <div className="card card-static-2 mb-30">
                      <div className="card-title-2">
                        <h4>Agregar nueva ciudad</h4>
                      </div>
                      <div className="card-body-table">
                        <form onSubmit={handlerEditCiudad}>
                          <div className="news-content-right pd-20">
                            <div className="form-group">
                              <label className="form-label">Nombre*</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre de la ciudad"
                                required
                                defaultValue={ciudad.nombre}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Estado*</label>
                              <select
                                id="status"
                                name="status"
                                className="form-control"
                                defaultValue={ciudad.status}
                              >
                                <option value={true}>Activo</option>
                                <option value={false}>Inactivo</option>
                              </select>
                            </div>

                            <button className="save-btn hover-btn">
                              Modificar ciudad
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default ciudadNueva
