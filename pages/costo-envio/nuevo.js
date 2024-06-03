import Footer from '../../components/Footer'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Notifications, { notify } from 'react-notify-toast'
import Link from 'next/link'
import { useEffect, useContext, useState } from 'react'
import UserContext from '../../components/UserContext'
import { API_URL } from '../../components/Config'

const costoNuevo = () => {
  const { signOut } = useContext(UserContext)
  const [token, setToken] = useState(false)
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
      setToken(tokenLocal)
    } else signOut()
  }, [])

  const handlerSubmitCosto = () => {
    let target = event.target
    event.preventDefault()
    if (!target[0].value || !target[1].value || !target[2].value)
      notify.show(
        'Por favor todos los campos deben ser llenados',
        'warning',
        2000
      )
    else {
      fetch(`${API_URL}/costo-envio`, {
        method: 'POST',
        body: JSON.stringify({
          costoNormal: target[0].value,
          cantidadTotalPromo: target[1].value,
          costoPromo: target[2].value,
          promoEnvio: target[3].value,
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
            target[1].value = ''
            target[2].value = ''
            target[3].value = ''
            notify.show(
              'Costo de envio agregado con Exito! ',
              'success',
              2000
            )
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
              <h2 className="mt-30 page-title">Precio del Delivery</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/ciudades">
                    <a>Costos</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  Agregar nuevo precio
                </li>
              </ol>
              <div className="row">
                <div className="col-lg-5 col-md-6">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Agregar nuevo</h4>
                    </div>
                    <div className="card-body-table">
                      <form onSubmit={handlerSubmitCosto}>
                        <div className="news-content-right pd-20">
                          <div className="form-group">
                            <label className="form-label">
                              Costo Normal Bs.*
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Nombre de la costo"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Cantidad total en Bs para aplicar la promo
                              Bs.*
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Cantidad para la promo"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Costo aplicando la promo Bs.*
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Precio con promoción"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Estado de la promoción*
                            </label>
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
                            Agregar Nuevo Costo
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

export default costoNuevo
