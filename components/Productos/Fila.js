import Link from 'next/link'
import moment from 'moment'

export default ({ pro }) => {
  moment.locale('es')
  return (
    <tr>
      <td>
        <input
          type="checkbox"
          className="check-item"
          name="ids[]"
          defaultValue="10"
        />
      </td>
      <td>{pro._id}</td>
      <td>
        <div className="cate-img-5">
          <img
            src={`http://localhost:3001/upload/producto/${pro.img[0]}`}
            alt={pro.name}
          />
        </div>
      </td>
      <td>{pro.name}</td>
      <td>{pro.category[0].name}</td>
      <td>{moment(pro.vence).format('LL') || ''}</td>
      <td>
        {pro.status ? (
          <span className="badge-item badge-status">Activo</span>
        ) : (
          <span className="badge-item badge-status-false">Inactivo</span>
        )}
      </td>
      <td className="action-btns">
        <Link
          href="/productos/[id]/[title]"
          as={`/productos/${pro._id}/${pro.name
            .toLowerCase()
            .replace(/\s/g, '-')}`}
        >
          <a className="view-shop-btn" title="Ver Producto">
            <i className="fas fa-eye"></i>
          </a>
        </Link>
        <Link href="/productos/[id]" as={`/productos/${pro._id}`}>
          <a className="edit-btn" title="Editar">
            <i className="fas fa-edit"></i>
          </a>
        </Link>
      </td>
    </tr>
  )
}
