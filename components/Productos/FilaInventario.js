import Link from 'next/link'
import moment from 'moment'

export default ({ pro }) => {
  moment.locale('es')
  return (
    <tr>
      <td>{pro.producto.code}</td>
      <td>
        <div className="cate-img-5">
          <img
            src={`http://localhost:3001/upload/producto/${pro.producto.img[0]}`}
            alt={pro.producto.name}
          />
        </div>
      </td>
      <td>{pro.producto.name}</td>
      <td>{moment(pro.producto.fechaCaducidad).format('LL') || ''}</td>
      <td>
        {pro.producto.status ? (
          <span className="badge-item badge-status">Activo</span>
        ) : (
          <span className="badge-item badge-status-false">Inactivo</span>
        )}
      </td>
      <td>{pro.stock}</td>
      <td className="action-btns">
        <Link href="/productos/[id]" as={`/productos/${pro.producto._id}`}>
          <a className="edit-btn" title="Editar">
            <i className="fas fa-edit"></i>
          </a>
        </Link>
      </td>
    </tr>
  )
}
