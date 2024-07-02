import Notifications, { notify } from 'react-notify-toast'
import TopNavbar from '../components/Navbar'
import SideNav from '../components/Navbar/SideNav'
import Footer from '../components/Footer'
import Link from 'next/link'
import { useContext, useEffect, useRef, useState } from 'react'
import UserContext from '../components/UserContext'
import { API_URL } from '../components/Config'
import moment from 'moment'
import TablaTransacciones from '../components/Transacciones/TablaTransacciones'
import io from 'socket.io-client'
const NotificacionesPago = () => {
  let socket
  moment.locale('es')
  const { getAdmSucursal, signOut, token, pagoRealizado } =
    useContext(UserContext)
  const [transacciones, setTransacciones] = useState([])
  const inputId = useRef(null)
  const inputFechaInicio = useRef(null)
  const inputFechaFin = useRef(null)
  async function buscarTransaccionPorId() {
    if (inputId.current.value === '')
      notify.show('Por favor introduzca la ID del pedido', 'warning')
    else {
      try {
        const res = await fetch(
          `${API_URL}/notificacion-transaccion/detalle/${inputId.current.value}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        if (res.status === 401) signOut()
        const resPedido = await res.json()
        if (resPedido.error) {
          notify.show('Error al obtener el pedido', 'error')
        } else {
          setTransacciones(resPedido.body)
        }
      } catch (error) {
        console.log(error)
        notify.show('Error en el servidor al obtener el pedido', 'error')
      }
    }
  }
  async function handlerFiltrarFecha() {
    if (
      inputFechaFin.current.value === '' &&
      inputFechaInicio.current.value === ''
    )
      notify.show('Por favor seleccione un rango de fecha', 'warning')
    else {
      const res = await fetch(
        `${API_URL}/notificacion-transaccion?fechaInicio=${moment(
          inputFechaInicio.current.value
        ).format('YYYY/MM/DD')}&fechaFin=${moment(
          inputFechaFin.current.value
        ).format('YYYY/MM/DD')}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (res.status === 401) signOut()
      const resPagos = await res.json()
      if (resPagos.error) {
        console.log('Error>>>>', resPagos)
        notify.show('Error al mostrar las Transacciones de pago', 'error')
      } else {
        console.log(resPagos)
        setTransacciones(resPagos.body)
      }
    }
  }
  const getNotificacionesDia = async () => {
    try {
      if (getAdmSucursal) {
        const transaccionesDia = await fetch(
          `${API_URL}/notificacion-transaccion/pagos-dia/${moment().format(
            'YYYY-MM-DD'
          )}/${getAdmSucursal}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        const response = await transaccionesDia.json()
        response.error
          ? notify.show(
              'Error al obtener los pedidos, comuníquese con el administrador',
              'error',
              4000
            )
          : setTransacciones(response.body)
      }
    } catch (err) {
      notify.show(
        'Error en el servidor, comuníquese con el administrador',
        'error',
        4000
      )
    }
  }
  async function iniciarSocket() {
    socket = io(API_URL, { transports: ['websocket'] })
    socket.on('connect', () => {
      console.log('Connected to the server')
    })
    socket.on(`transacciones-pago`, (pago) => {
      pagoRealizado.play()
      if (transacciones.length > 0) {
        setTransacciones([...transacciones, pago])
      } else {
        getNotificacionesDia()
      }
    })
  }
  useEffect(() => {
    getNotificacionesDia()
    if (getAdmSucursal) {
      iniciarSocket()
      return () => socket.disconnect()
    }
  }, [getAdmSucursal])
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
                Notificaciones de pagos online
              </h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Notificaciones</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-4 col-md-4">
                  <div className="bulk-section mb-30">
                    <div className="search-by-name-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por Codigo de transacción"
                        ref={inputId}
                      />
                    </div>
                    <div className="input-group-append">
                      <button
                        className="status-btn hover-btn"
                        type="submit"
                        onClick={buscarTransaccionPorId}
                      >
                        Buscar
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-4">
                  <div className="bulk-section mb-30">
                    <div className="form-group">
                      <label className="form-label">Fecha Inicio</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Fecha incio"
                        defaultValue={moment().format('DD/MM/YYYY')}
                        ref={inputFechaInicio}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Fecha Fin</label>
                      <input
                        type="date"
                        className="form-control"
                        placeholder="Fecha fin"
                        defaultValue={moment().format('DD/MM/YYYY')}
                        ref={inputFechaFin}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="bulk-section mb-30 justify-content-center">
                    <div className="input-group-append">
                      <button
                        className="status-btn hover-btn"
                        type="submit"
                        onClick={handlerFiltrarFecha}
                      >
                        Filtrar por fecha
                      </button>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Todas las transacciones</h4>
                    </div>
                    {getAdmSucursal === 'false' ||
                    getAdmSucursal === '0' ||
                    getAdmSucursal === false ? (
                      <h4>Por favor selecione una sucursal</h4>
                    ) : (
                      <TablaTransacciones pagos={transacciones} />
                    )}
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
export default NotificacionesPago
