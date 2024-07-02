import Head from 'next/head'
import TopNavbar from '../components/Navbar'
import SideNav from '../components/Navbar/SideNav'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { API_URL } from '../components/Config'
import UserContext from '../components/UserContext'
import { useEffect, useContext, useState } from 'react'
import io from 'socket.io-client'
import Notifications, { notify } from 'react-notify-toast'
import Link from 'next/link'
import Chart from 'chart.js'
import moment from 'moment'
import ProductosVencimiento from '../components/Reportes/ProductosVencimiento'
import PocoStock from '../components/Reportes/PocoStock'
function Home() {
  moment.locale('es')
  let socket
  const [pendiente, setPendiente] = useState('0')
  const [proceso, setProceso] = useState('0')
  const [completado, setCompletado] = useState('0')
  const [cancelado, setCancelado] = useState('0')
  const [totalVenta, setTotalVenta] = useState('0')

  const [datosReporte, setDatosReporte] = useState([])
  const [datosReportePocoStock, setDatosReportePocoStock] = useState([])

  const { token, getAdmSucursal, signOut, user } = useContext(UserContext)
  var config = {
    type: 'line',
    data: {
      labels: [
        'Enero',
        'Febrero',
        'Marzo',
        'Abril',
        'Mayo',
        'Jinio',
        'Julio',
        'Agosto',
        'Septiembre',
        'Octubre',
        'Noviembre',
        'Diciembre',
      ],
      datasets: [
        {
          label: new Date().getFullYear(),
          backgroundColor: '#3182ce',
          borderColor: '#3182ce',
          data: [],
          fill: false,
        },
        {
          label: new Date().getFullYear() - 1,
          fill: false,
          backgroundColor: '#edf2f7',
          borderColor: '#edf2f7',
          data: [],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: false,
        text: 'Total ventas',
        fontColor: 'white',
      },
      legend: {
        labels: {
          fontColor: 'white',
        },
        align: 'end',
        position: 'bottom',
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: 'rgba(255,255,255,.7)',
            },
            display: true,
            scaleLabel: {
              display: false,
              labelString: 'Month',
              fontColor: 'white',
            },
            gridLines: {
              display: false,
              borderDash: [2],
              borderDashOffset: [2],
              color: 'rgba(33, 37, 41, 0.3)',
              zeroLineColor: 'rgba(0, 0, 0, 0)',
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: 'rgba(255,255,255,.7)',
            },
            display: true,
            scaleLabel: {
              display: false,
              labelString: 'Value',
              fontColor: 'white',
            },
            gridLines: {
              borderDash: [3],
              borderDashOffset: [3],
              drawBorder: false,
              color: 'rgba(255, 255, 255, 0.15)',
              zeroLineColor: 'rgba(33, 37, 41, 0)',
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        ],
      },
    },
  }
  var config2 = {
    type: 'line',
    data: {
      labels: [],
      datasets: [
        {
          label: 'Online',
          backgroundColor: '#3182ce',
          borderColor: '#3182ce',
          data: [],
          fill: false,
        },
        {
          label: 'Presencial',
          fill: false,
          backgroundColor: '#edf2f7',
          borderColor: '#edf2f7',
          data: [],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      responsive: true,
      title: {
        display: false,
        text: 'Total ventas',
        fontColor: 'white',
      },
      legend: {
        labels: {
          fontColor: 'white',
        },
        align: 'end',
        position: 'bottom',
      },
      tooltips: {
        mode: 'index',
        intersect: false,
      },
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: 'rgba(255,255,255,.7)',
            },
            display: true,
            scaleLabel: {
              display: false,
              labelString: 'Month',
              fontColor: 'white',
            },
            gridLines: {
              display: false,
              borderDash: [2],
              borderDashOffset: [2],
              color: 'rgba(33, 37, 41, 0.3)',
              zeroLineColor: 'rgba(0, 0, 0, 0)',
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              fontColor: 'rgba(255,255,255,.7)',
            },
            display: true,
            scaleLabel: {
              display: false,
              labelString: 'Value',
              fontColor: 'white',
            },
            gridLines: {
              borderDash: [3],
              borderDashOffset: [3],
              drawBorder: false,
              color: 'rgba(255, 255, 255, 0.15)',
              zeroLineColor: 'rgba(33, 37, 41, 0)',
              zeroLineBorderDash: [2],
              zeroLineBorderDashOffset: [2],
            },
          },
        ],
      },
    },
  }
  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    const user = localStorage.getItem('fribar-user')
    if (!tokenLocal && !user) {
      signOut()
    }
    var ctx = document.getElementById('line-chart').getContext('2d')
    var ctx2 = document
      .getElementById('chartVentasOnlineAndPresencial')
      .getContext('2d')
    if (token && getAdmSucursal) {
      getPedidosTablero(token)
      getVentasMes(
        token,
        getAdmSucursal,
        config.data.datasets[0].data,
        config.data.datasets[1].data,
        ctx
      )
      getVentasOnlinePresencial(
        token,
        getAdmSucursal,
        config2.data.labels,
        config2.data.datasets[0].data,
        config2.data.datasets[1].data,
        ctx2
      )
      reporteProductosVencimiento(getAdmSucursal, token)
      reportePocoStockProductos(getAdmSucursal, token)
    }
    escucharPedidos()
    return () => socket.disconnect()
  }, [token])
  async function getPedidosTablero(token) {
    try {
      const pedidosTablero = await fetch(
        `${API_URL}/pedido/estado/tablero`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (pedidosTablero.status === 401) signOut()
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
    for (let i = 0; i < pedidos.length; i++) {
      if (pedidos[i]._id === '0') setPendiente(pedidos[i].count)
      else if (pedidos[i]._id === '1') setProceso(pedidos[i].count)
      else if (pedidos[i]._id === '3') {
        setCompletado(pedidos[i].count)
        setTotalVenta(pedidos[i].total)
      } else if (pedidos[i]._id === '4') setCancelado(pedidos[i].count)
    }
  }
  async function getVentasMes(
    token,
    idSucursal,
    datosAnterior,
    datosActual,
    ctx
  ) {
    try {
      const datos = await fetch(
        `${API_URL}/detalle/reporte/ventas-mes/${idSucursal}?añoAnterior=si`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const ventasMes = await datos.json()
      if (ventasMes.error) notify.show('Error en la peticion mes', 'error')
      else {
        for (let venta of ventasMes.body) {
          const fechaVenta = moment(venta._id)
          if (fechaVenta.year() === new Date().getFullYear() - 1) {
            datosAnterior[fechaVenta.month()] = venta.total
          }
          if (fechaVenta.year() === new Date().getFullYear()) {
            datosActual[fechaVenta.month()] = venta.total
          }
        }
        window.myLine = new Chart(ctx, config)
      }
    } catch (error) {
      console.log(
        'Error al obtener la informacion de ventas del mes',
        error
      )
    }
  }
  async function getVentasOnlinePresencial(
    token,
    idSucursal,
    labels,
    online,
    presencial,
    ctx
  ) {
    try {
      const datosVenta = await fetch(
        `${API_URL}/venta/reporte/venta-presencial/${idSucursal}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const datosPedido = await fetch(
        `${API_URL}/pedido/reporte/pedidos-online/${idSucursal}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const datosPresencial = await datosVenta.json()
      const datosOnline = await datosPedido.json()
      if (datosPresencial.error || datosOnline.error)
        notify.show(
          'Error en la peticion de datos de venta presencial y online',
          'error'
        )
      else {
        if (
          datosPresencial.body.length > 0 &&
          datosOnline.body.length > 0
        ) {
          const ventasPresencial = datosPresencial.body
          const ventasOnline = datosOnline.body
          let labelInicial
          let labelFinal
          if (
            parseInt(ventasPresencial[0]._id) <
            parseInt(ventasOnline[0]._id)
          ) {
            labelInicial = ventasPresencial[0]._id
          } else {
            labelInicial = ventasOnline[0]._id
          }
          if (
            parseInt(ventasPresencial[ventasPresencial.length - 1]._id) >
            parseInt(ventasOnline[ventasOnline.length - 1]._id)
          ) {
            labelFinal = ventasPresencial[ventasPresencial.length - 1]._id
          } else {
            labelFinal = ventasOnline[ventasOnline.length - 1]._id
          }
          for (
            let l = parseInt(labelInicial);
            l <= parseInt(labelFinal);
            l++
          ) {
            labels.push(l)
          }
          for (let p = 0; p < ventasPresencial.length; p++) {
            let indice = labels.indexOf(parseInt(ventasPresencial[p]._id))
            presencial[indice] = ventasPresencial[p].ventasTotales
          }
          for (let o = 0; o < ventasOnline.length; o++) {
            let indice = labels.indexOf(parseInt(ventasOnline[o]._id))
            online[indice] = ventasOnline[o].pedidosTotales
          }
          window.myLine = new Chart(ctx, config2)
        }
      }
    } catch (error) {
      console.log(error)
      console.log(
        'Error al obtener la informacion de ventas del mes',
        error
      )
    }
  }
  function escucharPedidos(token) {
    socket = io(API_URL, { transports: ['websocket'] })
    socket.on('tablero-pedidos', (pedido) => {
      asignarDatos(pedido)
    })
  }

  async function reporteProductosVencimiento(
    idSucursal,
    token,
    dias = 30
  ) {
    try {
      const datos = await fetch(
        `${API_URL}/inventario/reporte/productos/caducidad/${idSucursal}?dias=${dias}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const productosCaducidad = await datos.json()
      if (productosCaducidad.error)
        notify.show(
          'Error en la peticion de Poco stock de Productos',
          'error'
        )
      else {
        setDatosReporte(productosCaducidad.body)
      }
    } catch (error) {
      notify.show(
        'Error en el servidor al obtener los datos de poco Stock'
      )
      console.log(error)
    }
  }
  async function reportePocoStockProductos(
    idSucursal,
    token,
    cantidad = 6
  ) {
    try {
      const datos = await fetch(
        `${API_URL}/inventario/reporte/productos-poco-stock/${idSucursal}?cantidad=${cantidad}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const productosPocaCantidad = await datos.json()
      if (productosPocaCantidad.error)
        notify.show(
          'Error en la peticion de Poco stock de Productos',
          'error'
        )
      else {
        setDatosReportePocoStock(productosPocaCantidad.body)
      }
    } catch (error) {
      notify.show(
        'Error en el servidor al obtener los datos de poco Stock'
      )
    }
  }
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
                <div className="col-xl-6 col-md-6">
                  <div className="contenedorChart">
                    <div className="contenedorCharDiv">
                      <div className="centerTitulo">
                        <div className="tituloUno">
                          <h6 className="tutuloUnoSub">
                            Descripcion general
                          </h6>
                          <h2 className="tituloUnoH2">
                            Informacion total de Ventas (Bs).
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="divChart">
                      <div
                        className="relative h-350-px"
                        style={{
                          height: '350px',
                          position: 'relative',
                        }}
                      >
                        <canvas id="line-chart"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-md-6">
                  <div className="contenedorChart">
                    <div className="contenedorCharDiv">
                      <div className="centerTitulo">
                        <div className="tituloUno">
                          <h6 className="tutuloUnoSub">Tipos de ventas</h6>
                          <h2 className="tituloUnoH2">
                            Informacion venta Presencial y Online (Bs).
                          </h2>
                        </div>
                      </div>
                    </div>
                    <div className="divChart">
                      <div
                        className="relative h-350-px"
                        style={{
                          height: '350px',
                          position: 'relative',
                        }}
                      >
                        <canvas id="chartVentasOnlineAndPresencial"></canvas>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-12 col-md-12">
                  <ProductosVencimiento productos={datosReporte} />
                  <PocoStock productos={datosReportePocoStock} />
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
      <style jsx>
        {`
          .contenedorChart {
            display: flex;
            position: relative;
            margin-bottom: 1.5rem;
            flex-direction: column;
            border-radius: 0.25rem;
            width: 100%;
            min-width: 0;
            overflow-wrap: break-word;
            background-color: rgba(51, 65, 85, 1);
          }
          .contenedorCharDiv {
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
            padding-left: 1rem;
            padding-right: 1rem;
            margin-bottom: 0;
            border-top-left-radius: 0.25rem;
            border-top-right-radius: 0.25rem;
            background-color: transparent;
          }
          .centerTitulo {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
          }
          .tituloUno {
            position: relative;
            flex: 1 1 0%;
            flex-grow: 1;
            width: 100%;
            max-width: 100%;
          }
          .tutuloUnoSub {
            margin-bottom: 0.25rem;
            font-size: 0.75rem;
            line-height: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            color: #ffffff;
          }
          .tituloUnoH2 {
            font-size: 1.25rem;
            line-height: 1.75rem;
            font-weight: 600;
            color: #ffffff;
          }
          .divChart {
            padding: 1rem;
            flex: 1 1 auto;
          }
        `}
      </style>
    </>
  )
}
export default Home
