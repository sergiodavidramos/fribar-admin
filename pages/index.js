import Head from 'next/head'
import TopNavbar from '../components/Navbar'
import SideNav from '../components/Navbar/SideNav'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { API_URL } from '../components/Config'
import UserContext from '../components/UserContext'
import { useEffect, useContext, useState } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import Notifications, { notify } from 'react-notify-toast'

function Home() {
  const [pendiente, setPendiente] = useState('0')
  const [proceso, setProceso] = useState('0')
  const [completado, setCompletado] = useState('0')
  const [cancelado, setCancelado] = useState('0')
  const [totalVenta, setTotalVenta] = useState('0')
  const { user, token } = useContext(UserContext)
  console.log('token index  ', user)

  const socket = io(API_URL)
  async function getPedidosTablero() {
    try {
      const pedidosTablero = await fetch(
        `${API_URL}/pedido/estado/tablero`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const det = await pedidosTablero.json()
      det.error
        ? notify.show(
            'Error en el servidor, comuníquese con el administrador',
            'error',
            4000
          )
        : asignarDatos(det.body)
    } catch (err) {
      notify.show(
        'Error en el servidor, comuníquese con el administrador',
        'error',
        4000
      )
    }
  }
  function asignarDatos(pedidos) {
    console.log('Pedidoss', pedidos)
    for (let i = 0; i < pedidos.length; i++) {
      if (pedidos[i]._id === '0') setPendiente(pedidos[i].count)
      else if (pedidos[i]._id === '1') setProceso(pedidos[i].count)
      else if (pedidos[i]._id === '2') {
        setCompletado(pedidos[i].count)
        setTotalVenta(pedidos[i].total)
      } else if (pedidos[i]._id === '3') setCancelado(pedidos[i].count)
    }
  }
  useEffect(() => {
    socket.on('tablero-pedidos', (pedidos) => {
      asignarDatos(pedidos.body)
    })
    getPedidosTablero()
    return () => socket.disconnect()
  }, [])

  return (
    <>
      <Head>
        <title>FriBar</title>
      </Head>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />

        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            {/* {user ? <h1>{user.nombre_comp}</h1> : <h1>hola</h1>} */}
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Tablero</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item active">Tablero</li>
              </ol>
              <div className="row">
                <div className="col-xl-3 col-md-6">
                  <div className="dashboard-report-card purple">
                    <div className="card-content">
                      <span className="card-title">Pedidos Pendiente</span>

                      <span className="card-count">{pendiente}</span>
                    </div>
                    <div className="card-media">
                      <i className="fab fa-rev"></i>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="dashboard-report-card red">
                    <div className="card-content">
                      <span className="card-title">
                        Pedidos Cancelados{' '}
                      </span>
                      <span className="card-count">{cancelado}</span>
                    </div>
                    <div className="card-media">
                      <i className="far fa-times-circle"></i>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="dashboard-report-card info">
                    <div className="card-content">
                      <span className="card-title">
                        Pedidos en Proceso
                      </span>
                      <span className="card-count">{proceso}</span>
                    </div>
                    <div className="card-media">
                      <i className="fas fa-sync-alt rpt_icon"></i>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-md-6">
                  <div className="dashboard-report-card success">
                    <div className="card-content">
                      <span className="card-title">
                        Ingresos de hoy {completado}
                      </span>
                      <span className="card-count">Bs {totalVenta}</span>
                    </div>
                    <div className="card-media">
                      <i className="fas fa-money-bill rpt_icon"></i>
                    </div>
                  </div>
                </div>
                <div className="col-xl-12 col-md-12">
                  Hola Mundo
                  {/* <div className="card card-static-1 mb-30">
                    <div className="card-body">
                      <div
                        id="earningGraph"
                        data-highcharts-chart="0"
                        role="region"
                        aria-label="2020 Income &amp; Order Summary. Highcharts interactive chart."
                        aria-hidden="false"
                        style={{ overflow: 'hidden' }}
                      ></div>
                    </div>
                  </div> */}
                </div>
                <div className="col-xl-12 col-md-12">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Recent Orders</h4>
                      <a href="orders.html" className="view-btn hover-btn">
                        View All
                      </a>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th style={{ width: '130px' }}>Order ID</th>
                              <th>Item</th>
                              <th style={{ width: '200px' }}>Date</th>
                              <th style={{ width: '300px' }}>Address</th>
                              <th style={{ width: '130px' }}>Status</th>
                              <th style={{ width: '130px' }}>Total</th>
                              <th style={{ width: '100px' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>ORDER12345</td>
                              <td>
                                <a href="#" target="_blank">
                                  Product Title Here
                                </a>
                              </td>
                              <td>
                                <span className="delivery-time">
                                  15/06/2020
                                </span>
                                <span className="delivery-time">
                                  4:00PM - 6.00PM
                                </span>
                              </td>
                              <td>
                                #0000, St No. 8, Shahid Karnail Singh
                                Nagar, MBD Mall, Frozpur road, Ludhiana,
                                141001
                              </td>
                              <td>
                                <span className="badge-item badge-status">
                                  Pending
                                </span>
                              </td>
                              <td>$90</td>
                              <td className="action-btns">
                                <a
                                  href="order_view.html"
                                  className="views-btn"
                                >
                                  <i className="fas fa-eye"></i>
                                </a>
                                <a
                                  href="order_edit.html"
                                  className="edit-btn"
                                >
                                  <i className="fas fa-edit"></i>
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>ORDER12346</td>
                              <td>
                                <a href="#" target="_blank">
                                  Product Title Here
                                </a>
                              </td>
                              <td>
                                <span className="delivery-time">
                                  13/06/2020
                                </span>
                                <span className="delivery-time">
                                  2:00PM - 4.00PM
                                </span>
                              </td>
                              <td>
                                #0000, St No. 8, Shahid Karnail Singh
                                Nagar, MBD Mall, Frozpur road, Ludhiana,
                                141001
                              </td>
                              <td>
                                <span className="badge-item badge-status">
                                  Pending
                                </span>
                              </td>
                              <td>$105</td>
                              <td className="action-btns">
                                <a
                                  href="order_view.html"
                                  className="views-btn"
                                >
                                  <i className="fas fa-eye"></i>
                                </a>
                                <a
                                  href="order_edit.html"
                                  className="edit-btn"
                                >
                                  <i className="fas fa-edit"></i>
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>ORDER12347</td>
                              <td>
                                <a href="#" target="_blank">
                                  Product Title Here
                                </a>
                              </td>
                              <td>
                                <span className="delivery-time">
                                  13/6/2020
                                </span>
                                <span className="delivery-time">
                                  5:00PM - 7.00PM
                                </span>
                              </td>
                              <td>
                                #0000, St No. 8, Shahid Karnail Singh
                                Nagar, MBD Mall, Frozpur road, Ludhiana,
                                141001
                              </td>
                              <td>
                                <span className="badge-item badge-status">
                                  Pending
                                </span>
                              </td>
                              <td>$60</td>
                              <td className="action-btns">
                                <a
                                  href="order_view.html"
                                  className="views-btn"
                                >
                                  <i className="fas fa-eye"></i>
                                </a>
                                <a
                                  href="order_edit.html"
                                  className="edit-btn"
                                >
                                  <i className="fas fa-edit"></i>
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td>ORDER12348</td>
                              <td>
                                <a href="#" target="_blank">
                                  Product Title Here
                                </a>
                              </td>
                              <td>
                                <span className="delivery-time">
                                  12/06/2020
                                </span>
                                <span className="delivery-time">
                                  01:00PM - 3.00PM
                                </span>
                              </td>
                              <td>
                                #0000, St No. 8, Shahid Karnail Singh
                                Nagar, MBD Mall, Frozpur road, Ludhiana,
                                141001
                              </td>
                              <td>
                                <span className="badge-item badge-status">
                                  Pending
                                </span>
                              </td>
                              <td>$120</td>
                              <td className="action-btns">
                                <a
                                  href="order_view.html"
                                  className="views-btn"
                                >
                                  <i className="fas fa-eye"></i>
                                </a>
                                <a
                                  href="order_edit.html"
                                  className="edit-btn"
                                >
                                  <i className="fas fa-edit"></i>
                                </a>
                              </td>
                            </tr>
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

export async function getStaticProps() {
  let categorias
  //   let
  await axios
    .get(`http://localhost:3001/categoria`)
    .then((p) => {
      categorias = p.data.body
    })
    .catch((err) => (categorias = []))
  return {
    props: {
      categorias,
    },
    // revalidate: 1,
  }
}

export default Home
