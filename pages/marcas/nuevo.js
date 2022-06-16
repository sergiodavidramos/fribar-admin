import Footer from '../../components/Footer'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Notifications, { notify } from 'react-notify-toast'
import Link from 'next/link'
import { useEffect, useContext, useState } from 'react'
import UserContext from '../../components/UserContext'

const ciudadNueva = () => {
  const { signOut } = useContext(UserContext)
  const [token, setToken] = useState(false)
  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    if (!tokenLocal) {
      signOut()
    }
    setToken(tokenLocal)
  }, [])

  const handlerSubmitCiudad = () => {
    let target = event.target
    event.preventDefault()
    if (!target[0].value)
      notify.show(
        'Por favor todos los campos deben ser llenados',
        'warning',
        2000
      )
    else {
      fetch('http://localhost:3001/marca', {
        method: 'POST',
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
          else {
            target[0].value = ''
            notify.show('Marca agregado con Exito! ', 'success', 2000)
          }
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
              <h2 className="mt-30 page-title">Marca</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/ciudades">
                    <a>marca</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">agregar marca</li>
              </ol>
              <div className="row">
                <div className="col-lg-5 col-md-6">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Agregar nueva marca</h4>
                    </div>
                    <div className="card-body-table">
                      <form onSubmit={handlerSubmitCiudad}>
                        <div className="news-content-right pd-20">
                          <div className="form-group">
                            <label className="form-label">Nombre*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nombre de la ciudad"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Estado*</label>
                            <select
                              id="status"
                              name="status"
                              className="form-control"
                              defaultValue={true}
                            >
                              <option value={true}>Activo</option>
                              <option value={false}>Inactivo</option>
                            </select>
                          </div>

                          <button className="save-btn hover-btn">
                            Agregar Nueva marca
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

export default ciudadNueva
