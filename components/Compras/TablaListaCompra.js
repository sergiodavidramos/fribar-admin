import moment from 'moment'
import Link from 'next/link'
const TablaListaPedidos = ({ compras }) => {
  moment.locale('es')
  return (
    <div className="card-body-table">
      <div className="table-responsive">
        <table className="table ucp-table table-hover">
          <thead>
            <tr>
              <th>Item</th>
              <th style={{ width: '150px' }}>Fecha</th>
              <th style={{ width: '150px' }}>Proveedor</th>
              <th style={{ width: '300px' }}>Sucursal</th>
              <th style={{ width: '130px' }}>Comprado por</th>
              <th style={{ width: '80px' }}>Total</th>
              <th style={{ width: '50px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {compras.length > 0 &&
              compras.map((compra, index) => (
                <tr key={index}>
                  <td>
                    {compra.detalleCompra.detalle.map((pro) => {
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
                      {moment(compra.fecha).format('LLLL')}
                    </span>
                  </td>
                  <td>{compra.proveedor.nombreComercial}</td>
                  <td style={{ width: '15%' }}>
                    {compra.idSucursal.nombre}
                  </td>
                  <td>{compra.user.idPersona.nombre_comp}</td>
                  <td>{compra.total.toFixed(2)} Bs</td>
                  <td className="action-btns">
                    <Link
                      href="/compras/editar/[id]"
                      as={`/compras/editar/${compra._id}`}
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
