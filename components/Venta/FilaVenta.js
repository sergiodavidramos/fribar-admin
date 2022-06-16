import { useState } from 'react'

const FilaVenta = ({ pro, setCantidad, index, deleteProduct }) => {
  const [cantidad, setCa] = useState(pro.cantidad)
  const handlerCantidad = (event) => {
    setCa(event.target.value)
    setCantidad(index, event.target.value)
  }
  const handlerDeleteProduct = () => {
    deleteProduct(index)
  }
  return (
    <tr>
      <td>
        <input
          type="number"
          className="check-item"
          defaultValue={cantidad}
          min="1"
          onInput={handlerCantidad}
        />
      </td>
      <td>{pro.code}</td>
      <td>{pro.name}</td>
      <td>{pro.category[0].name}</td>
      <td>{pro.precioVenta}</td>
      <td>{pro.cantidad * pro.precioVenta}</td>
      <td className="action-btns">
        <a className="edit-btn" title="Editar">
          <i className="fas fa-trash" onClick={handlerDeleteProduct}></i>
        </a>
      </td>
    </tr>
  )
}

export default FilaVenta
