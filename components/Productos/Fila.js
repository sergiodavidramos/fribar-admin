import Link from 'next/link'

export default ({ pro }) => (
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
        <img src="/images/product/img-1.jpg" alt="" />
      </div>
    </td>
    <td>{pro.name}</td>
    <td>Vegetables &amp; Fruits</td>
    <td>8 hours ago</td>
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
        <a className="view-shop-btn" title="View">
          <i className="fas fa-eye"></i>
        </a>
      </Link>
      <a href="#" className="edit-btn" title="Edit">
        <i className="fas fa-edit"></i>
      </a>
    </td>
  </tr>
)
