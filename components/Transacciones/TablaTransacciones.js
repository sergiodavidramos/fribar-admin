import moment from 'moment'
import Link from 'next/link'
const TablaTransacciones = ({ pagos }) => {
  moment.locale('es')

  return (
    <div className="card-body-table">
      <div className="table-responsive">
        <table className="table ucp-table table-hover">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>Fecha Registro</th>
              <th>Codigo empresa</th>
              <th style={{ width: '150px' }}>Codigo Transaccion</th>
              <th style={{ width: '150px' }}>Codigo Producto</th>
              <th style={{ width: '300px' }}>Numero de pago</th>
              <th style={{ width: '130px' }}>Fecha de Pago</th>
              <th style={{ width: '80px' }}>Hora de pago</th>
              <th style={{ width: '50px' }}>Origen de la transaacion</th>
              <th style={{ width: '50px' }}>Ciudad</th>
              <th style={{ width: '50px' }}>Entidad</th>
              <th style={{ width: '50px' }}>Agencia</th>
              <th style={{ width: '50px' }}>Operador</th>
              <th style={{ width: '50px' }}>Monto</th>
              <th style={{ width: '50px' }}>Monto credito fiscal</th>
              <th style={{ width: '50px' }}>Codigo de autorizacion</th>
              <th style={{ width: '50px' }}>Codigo de control</th>
              <th style={{ width: '50px' }}>Nit</th>
              <th style={{ width: '50px' }}>Transaccion</th>
            </tr>
          </thead>
          <tbody>
            {pagos.length > 0 &&
              pagos.map((pago, index) => (
                <tr key={index}>
                  <td>{moment(pago.fechaRegistro).format('LLLL')}</td>
                  <td>{pago.codigoEmpresa}</td>
                  <td>{pago.codigoRecaudacion}</td>
                  <td>{pago.codigoProducto}</td>
                  <td>{pago.numeroPago}</td>
                  <td>{pago.fecha}</td>
                  <td>{pago.hora}</td>
                  <td>{pago.origenTransaccion}</td>
                  <td>{pago.ciudad}</td>
                  <td>{pago.entidad}</td>
                  <td>{pago.agencia}</td>
                  <td>{pago.operador}</td>
                  <td>{pago.monto.toFixed(2)} Bs</td>
                  <td>{pago.montoCreditoFiscal}</td>
                  <td>{pago.codigoAutorizacion}</td>
                  <td>{pago.codigoControl}</td>
                  <td>{pago.nitFactura}</td>
                  <td>{pago.transaccion}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default TablaTransacciones
