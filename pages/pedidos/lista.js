import Notifications, { notify } from 'react-notify-toast'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import TablaListaPedidos from '../../components/Pedidos/TablaListaPedidos'
import { useContext, useRef, useState } from 'react'
import UserContext from '../../components/UserContext'
import { API_URL } from '../../components/Config'
import moment from 'moment'
const Pedidos = () => {
  moment.locale('es')
  const { getAdmSucursal, signOut, token } = useContext(UserContext)
  const [pedidos, setPedidos] = useState([])
  let filtroEstado = false
  const inputId = useRef(null)
  const inputFechaInicio = useRef(null)
  const inputFechaFin = useRef(null)
  async function buscarPedidoPorId() {
    if (inputId.current.value === '')
      notify.show('Por favor introduzca la ID del pedido', 'warning')
    else {
      try {
        const res = await fetch(
          `${API_URL}/pedido/detalle/${inputId.current.value}`,
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
          setPedidos([resPedido.body])
        }
      } catch (error) {
        console.log(error)
        notify.show('Error en el servidor al obtener el pedido', 'error')
      }
    }
  }
  function handleChangeEstadoPedido() {
    const value = event.target.value
    if (value === 'false') filtroEstado = value
    else filtroEstado = parseInt(value)
  }
  async function handlerFiltrarFecha() {
    if (
      inputFechaFin.current.value === '' &&
      inputFechaInicio.current.value === ''
    )
      notify.show('Por favor seleccione un rango de fecha', 'warning')
    else {
      const res = await fetch(
        `${API_URL}/pedido/filtrar/fecha?fechaInicio=${moment(
          inputFechaInicio.current.value
        ).format('DD/MM/YYYY')}&fechaFin=${moment(
          inputFechaFin.current.value
        ).format('DD/MM/YYYY')}&estado=${filtroEstado}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (res.status === 401) signOut()
      const resPedidos = await res.json()
      if (resPedidos.error) {
        console.log('Error>>>>', resPedidos)
        notify.show('Error al mostrar los pedidos', 'error')
      } else {
        setPedidos(resPedidos.body)
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
              <h2 className="mt-30 page-title">Pedidos</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Pedidos</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-4 col-md-4">
                  <div className="bulk-section mb-30">
                    <div className="search-by-name-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar por ID"
                        ref={inputId}
                      />
                    </div>
                    <div className="input-group-append">
                      <button
                        className="status-btn hover-btn"
                        type="submit"
                        onClick={buscarPedidoPorId}
                      >
                        Buscar por Id
                      </button>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4">
                  <div className="bulk-section mb-30">
                    <div className="input-group">
                      <select
                        id="action"
                        name="action"
                        className="form-control"
                        defaultValue={false}
                        onChange={handleChangeEstadoPedido}
                      >
                        <option value={false}>Todos los Estados</option>
                        <option value={0}>Pendiente</option>
                        <option value={1}>Preparando</option>
                        <option value={2}>En camino</option>
                        <option value={3}>Completo</option>
                        <option value={4}>Cancelado</option>
                      </select>
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

                    {/* <div className="input-group-append">
                      <button
                        className="status-btn hover-btn"
                        type="submit"
                        onClick={handlerFiltrarFecha}
                      >
                        Filtrar por fecha
                      </button>
                    </div> */}
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
                      <h4>Todos los pedidos</h4>
                    </div>
                    {getAdmSucursal === 'false' ||
                    getAdmSucursal === '0' ||
                    getAdmSucursal === false ? (
                      <h4>Por favor selecione una sucursal</h4>
                    ) : (
                      <TablaListaPedidos pedidos={pedidos} />
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
export default Pedidos
