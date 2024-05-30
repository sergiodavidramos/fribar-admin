import Select from 'react-select'
import chroma from 'chroma-js'
import { useContext, useEffect, useState } from 'react'
import moment from 'moment'
import io from 'socket.io-client'
import { API_URL } from '../../components/Config'
import { notify } from 'react-notify-toast'
import Link from 'next/link'
import UserContext from '../UserContext'
const TablaPedidos = ({ sucursal }) => {
  let socket
  const { alarm, token } = useContext(UserContext)

  const [pedidos, setPedidos] = useState([])
  const colourOptions = [
    { value: '0', label: 'Pendiente', color: 'orange' },
    { value: '1', label: 'Preparando', color: 'purple' },
    { value: '2', label: 'En camino', color: 'blue' },
    { value: '3', label: 'Entregado', color: 'green' },
    { value: '4', label: 'Cancelado', color: 'red' },
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
  const handleChange = async (selectedOption, id) => {
    try {
      const newP = await fetch(`${API_URL}/pedido/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          state: selectedOption.value,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
      const newPedido = await newP.json()
      if (newPedido.error)
        notify.show('Error al cambiar estado', 'error', 500)
      else {
        notify.show('Estado Cambiado', 'success', 500)
        getPedidosDia()
      }
    } catch (err) {
      console.error('Error en el Servidor', err)
    }
  }
  const getPedidosDia = async () => {
    try {
      const pedidosDia = await fetch(
        `${API_URL}/pedido/pedidos-dia/${moment().format(
          'YYYY-MM-DD'
        )}/${sucursal}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const response = await pedidosDia.json()
      response.error
        ? notify.show(
            'Error al obtener los pedidos, comuníquese con el administrador',
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
  useEffect(() => {
    getPedidosDia()
    iniciarSocket()
    return () => socket.disconnect()
  }, [])

  async function iniciarSocket() {
    socket = io(API_URL, { transports: ['websocket'] })
    socket.on('connect', () => {
      console.log('Connected to the server')
    })
    socket.on(`pedido-${sucursal}`, (pedido) => {
      alarm.play()
      if (pedidos.length > 0) {
        setPedidos([...pedidos, pedido])
      } else {
        getPedidosDia()
      }
    })
  }

  return (
    <div className="card-body-table">
      <div className="table-responsive">
        <table className="table ucp-table table-hover">
          <thead>
            <tr>
              <th style={{ width: '500px' }}>Productos</th>
              <th style={{ width: '150px' }}>Fecha</th>
              <th style={{ width: '150px' }}>Hora Entrega</th>
              <th style={{ width: '200px' }}>Direccion</th>
              <th style={{ width: '130px' }}>Estado</th>
              <th style={{ width: '80px' }}>Total</th>
              <th style={{ width: '50px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.length > 0 &&
              pedidos.map((pedido, index) => (
                <tr key={index}>
                  <td>
                    {pedido.detallePedido.detalle.map((pro) => {
                      return (
                        <table key={pro._id}>
                          <thead>
                            <tr>
                              <th>Producto</th>
                              <th>Cantidad</th>
                              <th>Tipo Venta</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>
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
                              </td>
                              <td>{pro.cantidad}</td>
                              <td>{pro.producto.tipoVenta}</td>
                            </tr>
                          </tbody>
                        </table>
                      )
                    })}
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
                      .add(
                        moment.duration(
                          `00:${pedido.duracionEstimadaEntrega}:00`
                        )
                      )
                      .format('LT')}
                  </td>
                  <td>{pedido.direction.direccion}</td>
                  <td style={{ width: '15%' }}>
                    <Select
                      defaultValue={colourOptions[pedido.state]}
                      label="Single select"
                      options={colourOptions}
                      styles={colourStyles}
                      instanceId="state"
                      onChange={(selectedOption) =>
                        handleChange(selectedOption, pedido._id)
                      }
                    />
                  </td>
                  <td>{pedido.total.toFixed(2)} Bs</td>
                  <td className="action-btns">
                    <Link
                      href="/pedidos/[id]"
                      as={`/pedidos/${pedido._id}`}
                    >
                      <a className="views-btn" target="_blank">
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
  )
}
export default TablaPedidos
