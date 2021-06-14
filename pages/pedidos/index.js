import Notifications, { notify } from 'react-notify-toast'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import chroma from 'chroma-js'
import Select from 'react-select'
import { useEffect, useState } from 'react'
import { API_URL } from '../../components/Config'
import moment from 'moment'
import io from 'socket.io-client'
const Pedidos = () => {
  const mediaHora = '00:30:00'
  const [pedidos, setPedidos] = useState([])
  const colourOptions = [
    { value: '0', label: 'Pendiente', color: 'orange' },
    { value: '1', label: 'Proceso', color: 'purple' },
    { value: '2', label: 'Completo', color: 'green' },
    { value: '3', label: 'Cancelado', color: 'red' },
  ]
  const dot = (color = '#ccc') => ({
    display: 'flex',
    alignItems: 'center',
    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  })

  const colourStyles = {
    control: (styles) => ({
      ...styles,
      backgroundColor: 'white',
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color)
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor:
            !isDisabled &&
            (isSelected ? data.color : color.alpha(0.3).css()),
        },
      }
    },
    input: (styles) => ({
      ...styles,
      ...dot(),
    }),
    placeholder: (styles) => ({
      ...styles,
      ...dot(),
    }),
    singleValue: (styles, { data }) => ({
      ...styles,
      ...dot(data.color),
    }),
  }
  const getPedidosDia = async () => {
    try {
      const pedidosDia = await fetch(
        `${API_URL}/pedido/${moment().format('YYYY-MM-DD')}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const response = await pedidosDia.json()
      response.error
        ? notify.show(
            'Error en el servidor, comuníquese con el administrador',
            'error',
            4000
          )
        : setPedidos(response.body)
    } catch (err) {
      notify.show(
        'Error en el servidor, comuníquese con el administrador',
        'error',
        4000
      )
    }
  }
  const handleChange = async (selectedOption, id) => {
    try {
      const newP = await fetch(`${API_URL}/pedido/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          state: selectedOption.value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const newPedido = await newP.json()
      if (newPedido.error)
        notify.show('Error al cambiar estado', 'error', 500)
      else notify.show('Estado Cambiado', 'success', 500)
    } catch (err) {
      console.error('Error en el Servidor', err)
    }
  }
  const socket = io(API_URL)

  useEffect(() => {
    socket.on('escuchar-pedido', (pedido) => {
      if (pedidos.length > 0) {
        setPedidos([...pedidos, pedido])
      } else {
        getPedidosDia()
      }
    })
    getPedidosDia()
    return () => socket.disconnect()
  }, [])
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
                {/* <div className="col-lg-3 col-md-4">
                  <div className="bulk-section mb-30">
                    <div className="input-group">
                      <select
                        id="action"
                        name="action"
                        className="form-control"
                        defaultValue="0"
                      >
                        <option value="0">Todas las acciones</option>
                        <option value="1">Pendiente</option>
                        <option value="2">Proceso</option>
                        <option value="3">Completo</option>
                        <option value="4">Cancelado</option>
                      </select>
                    </div>
                  </div>
                </div> */}

                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Todos los pedidos</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th>Item</th>
                              <th style={{ width: '150px' }}>Fecha</th>
                              <th style={{ width: '150px' }}>
                                Hora Entrega
                              </th>
                              <th style={{ width: '300px' }}>Direccion</th>
                              <th style={{ width: '130px' }}>Estado</th>
                              <th style={{ width: '80px' }}>Total</th>
                              <th style={{ width: '50px' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pedidos.map((pedido, index) => (
                              <tr key={index}>
                                <td>
                                  {pedido.detalleVenta.detalle.map(
                                    (pro) => {
                                      return (
                                        <div key={pro._id}>
                                          <Link
                                            href="/productos/[id]/[title]"
                                            as={`/productos/${
                                              pro.producto._id
                                            }/${pro.producto.name
                                              .toLowerCase()
                                              .replace(/\s/g, '-')}`}
                                          >
                                            <a target="_blank">
                                              {pro.producto.name}{' '}
                                            </a>
                                          </Link>
                                          {pro.cantidad}-
                                          {pro.producto.tipoVenta}
                                          <br />
                                        </div>
                                      )
                                    }
                                  )}
                                </td>
                                <td>
                                  <span className="delivery-time">
                                    {moment(pedido.fecha).format('L')}
                                  </span>
                                  <span className="delivery-time">
                                    {moment(pedido.fecha).format('LT')}
                                  </span>
                                </td>
                                <td>
                                  {' '}
                                  {moment(pedido.fecha)
                                    .add(moment.duration(mediaHora))
                                    .format('LT')}
                                </td>
                                <td>{pedido.direction.direccion}</td>
                                <td style={{ width: '15%' }}>
                                  <Select
                                    defaultValue={
                                      colourOptions[pedido.state]
                                    }
                                    label="Single select"
                                    options={colourOptions}
                                    styles={colourStyles}
                                    instanceId="state"
                                    onChange={(selectedOption) =>
                                      handleChange(
                                        selectedOption,
                                        pedido._id
                                      )
                                    }
                                  />
                                </td>
                                <td>{pedido.total} Bs</td>
                                <td className="action-btns">
                                  <Link
                                    href="/pedidos/[id]"
                                    as={`/pedidos/${pedido._id}`}
                                  >
                                    <a className="views-btn">
                                      <i className="fas fa-eye"></i>
                                    </a>
                                  </Link>
                                </td>
                              </tr>
                            ))}
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
export default Pedidos
