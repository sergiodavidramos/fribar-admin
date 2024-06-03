import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Link from 'next/link'
import { useEffect, useContext, useState } from 'react'
import UserContext from '../../components/UserContext'
import Notifications, { notify } from 'react-notify-toast'
import Footer from '../../components/Footer'
import { API_URL } from '../../components/Config'

const CostoEnvio = () => {
  const { signOut } = useContext(UserContext)
  const [costos, setCostos] = useState(false)

  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    const user = localStorage.getItem('fribar-user')
    if (!tokenLocal && !user) {
      signOut()
    } else {
      if (
        JSON.parse(user).role === 'GERENTE-ROLE' ||
        JSON.parse(user).role === 'ADMIN-ROLE'
      ) {
        obtenerCostos()
      } else signOut()
    }
  }, [])

  function obtenerCostos() {
    fetch(`${API_URL}/costo-envio`, {
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
          notify.show('Error en el servidor (costos envio)', 'error', 2000)
        else {
          setCostos(data.body)
        }
      })
      .catch((error) => {
        notify.show(error.message, 'error', 2000)
      })
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
              <h2 className="mt-30 page-title">Costo de envio </h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Costos de envio</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-12">
                  <Link href="/costo-envio/nuevo">
                    <a className="add-btn hover-btn">Agregar Nuevo</a>
                  </Link>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mt-30 mb-30">
                    <div className="card-title-2">
                      <h4>Todos los costos</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th style={{ width: '60px' }}>ID</th>
                              <th>Precio Normal</th>
                              <th>Cantidad total para aplicar la promo</th>
                              <th>Costo Promo</th>
                              <th>Promo de Envio</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!costos ? (
                              <tr>
                                <td>...</td>
                              </tr>
                            ) : (
                              costos.map((costo) => (
                                <tr key={costo._id}>
                                  <td>{costo._id}</td>
                                  <td>{costo.costoNormal} Bs.</td>
                                  <td>{costo.cantidadTotalPromo} Bs.</td>
                                  <td>{costo.costoPromo} Bs.</td>
                                  <td>
                                    <span
                                      className={`badge-item ${
                                        costo.promoEnvio
                                          ? 'badge-status'
                                          : 'badge-status-false'
                                      }`}
                                    >
                                      {costo.promoEnvio
                                        ? 'Activo'
                                        : 'Inactivo'}
                                    </span>
                                  </td>
                                  <td className="action-btns">
                                    <Link
                                      href="/costo-envio/[id]"
                                      as={`/costo-envio/${costo._id}`}
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
export default CostoEnvio
