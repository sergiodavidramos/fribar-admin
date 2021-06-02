import Notifications, { notify } from 'react-notify-toast'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { API_URL } from '../../components/Config'
import UserContext from '../../components/UserContext'
import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'
const ViewPedidos = () => {
  moment.locale('es')
  const router = useRouter()
  const { signOut } = useContext(UserContext)
  const [pedido, setPedido] = useState(null)
  useEffect(() => {
    const tokenLocal = localStorage.getItem('frifolly-token')
    if (!tokenLocal) {
      signOut()
    }
    if (router && router.query && router.query.id) {
      const { id } = router.query
      fetch(`${API_URL}/pedido/detalle/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((pedido) => {
          if (pedido.error) {
            notify.show('Error el en servidor', 'error')
          } else {
            setPedido(pedido.body)
          }
        })
        .catch((err) =>
          notify.show(
            'Error en el servidor, comuníquese con el administrador',
            'error',
            2000
          )
        )
    }
  }, [router])
  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Pedidos</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/pedidos">
                    <a>Pedidos</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Vista de pedido</li>
              </ol>
              {pedido ? (
                <div className="row">
                  <div className="col-xl-12 col-md-12">
                    <div className="card card-static-2 mb-30">
                      <div className="card-title-2">
                        <h2 className="title1458">Factura</h2>
                        <span className="order-id">
                          Orden {pedido._id}
                        </span>
                      </div>
                      <div className="invoice-content">
                        <div className="row">
                          <div className="col-lg-6 col-sm-6">
                            <div className="ordr-date">
                              <b>Fecha del pedido :</b>{' '}
                              {moment(pedido.fecha).format('LL')}
                            </div>
                          </div>
                          <div className="col-lg-6 col-sm-6">
                            <div className="ordr-date right-text">
                              <b>Datos del Pedido :</b>
                              <br />
                              {pedido.direction.direccion}
                              <br />
                              Latitud: {pedido.direction.lat}
                              <br />
                              Longitud: {pedido.direction.lon}
                            </div>
                          </div>
                          <div className="col-lg-12">
                            <div className="card card-static-2 mb-30 mt-30">
                              <div className="card-title-2">
                                <h4>Recent Orders</h4>
                              </div>
                              <div className="card-body-table">
                                <div className="table-responsive">
                                  <table className="table ucp-table table-hover">
                                    <thead>
                                      <tr>
                                        <th style={{ width: '130px' }}>
                                          #
                                        </th>
                                        <th>Item</th>
                                        <th
                                          style={{ width: '150px' }}
                                          className="text-center"
                                        >
                                          Precio
                                        </th>
                                        <th
                                          style={{ width: '150px' }}
                                          className="text-center"
                                        >
                                          Cantidad
                                        </th>
                                        <th
                                          style={{ width: '100px' }}
                                          className="text-center"
                                        >
                                          Total
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {pedido.detalleVenta.detalle.map(
                                        (p, index) => (
                                          <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>
                                              <Link
                                                href="/productos/[id]/[title]"
                                                as={`/productos/${
                                                  p.producto._id
                                                }/${p.producto.name
                                                  .toLowerCase()
                                                  .replace(/\s/g, '-')}`}
                                              >
                                                <a target="_blank">
                                                  {p.producto.name}
                                                </a>
                                              </Link>
                                            </td>
                                            <td className="text-center">
                                              {p.producto.precioVenta} Bs
                                            </td>
                                            <td className="text-center">
                                              {p.cantidad} -{' '}
                                              {p.producto.tipoVenta}
                                            </td>
                                            <td className="text-center">
                                              {p.cantidad *
                                                p.producto
                                                  .precioVenta}{' '}
                                              Bs
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-7"></div>
                          <div className="col-lg-5">
                            <div className="order-total-dt">
                              <div className="order-total-left-text">
                                Sub Total
                              </div>
                              <div className="order-total-right-text">
                                {pedido.total - pedido.deliveryFees} Bs
                              </div>
                            </div>
                            <div className="order-total-dt">
                              <div className="order-total-left-text">
                                Cargos por envío
                              </div>
                              <div className="order-total-right-text">
                                {pedido.deliveryFees || 0} Bs
                              </div>
                            </div>
                            <div className="order-total-dt">
                              <div className="order-total-left-text fsz-18">
                                Total
                              </div>
                              <div className="order-total-right-text fsz-18">
                                {pedido.total} Bs
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-7"></div>
                          <div className="col-lg-5">
                            <div className="select-status">
                              <label htmlFor="status">Estado*</label>
                              {pedido.state === 0 ? (
                                <div className="status-active">
                                  Pendiente
                                </div>
                              ) : pedido.state === 1 ? (
                                <div className="status-active">
                                  Proceso
                                </div>
                              ) : pedido.state === 2 ? (
                                <div className="status-active">
                                  Completo
                                </div>
                              ) : (
                                <div className="status-active">
                                  Cancelado
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
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

export default ViewPedidos
