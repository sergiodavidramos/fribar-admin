import moment from 'moment'
import Link from 'next/link'
const TablaListaPedidos = ({ pedidos }) => {
  moment.locale('es')

  return (
    <div className="card-body-table">
      <div className="table-responsive">
        <table className="table ucp-table table-hover">
          <thead>
            <tr>
              <th>Item</th>
              <th style={{ width: '150px' }}>Fecha</th>
              <th style={{ width: '150px' }}>Hora Entrega</th>
              <th style={{ width: '300px' }}>Direccion</th>
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
                        <div key={pro._id}>
                          <Link
                            href="/productos/[id]/[title]"
                            as={`/productos/${
                              pro.producto._id
                            }/${pro.producto.name
                              .toLowerCase()
                              .replace(/\s/g, '-')}`}
                          >
                            <a target="_blank">{pro.producto.name} </a>
                          </Link>
                          {pro.cantidad}-{pro.producto.tipoVenta}
                          <br />
                        </div>
                      )
                    })}
                  </td>
                  <td>
                    <span className="delivery-time">
                      {moment(pedido.fecha).format('LLLL')}
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
                      .format('h:mm a')}
                  </td>
                  <td>{pedido.direction.direccion}</td>
                  <td style={{ width: '15%' }}>
                    {pedido.state === 0 && 'Pediente'}
                    {pedido.state === 1 && 'Preparando'}
                    {pedido.state === 2 && 'En camino'}
                    {pedido.state === 3 && 'Entregado'}
                    {pedido.state === 4 && 'Cancelado'}
                  </td>
                  <td>{pedido.total.toFixed(2)} Bs</td>
                  <td className="action-btns">
                    <Link
                      href="/pedidos/editar/[id]"
                      as={`/pedidos/editar/${pedido._id}`}
                    >
                      <a className="views-btn">
                        <i className="fas fa-edit"></i>
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
export default TablaListaPedidos
