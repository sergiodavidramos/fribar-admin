import { useState, useRef, useEffect } from 'react'
import expectedRound from 'expected-round'
const FilaVenta = ({ pro, setCantidad, index, deleteProduct }) => {
  const [cantidad, setCa] = useState(pro.cantidad)
  const inputCantidad = useRef(null)
  const precioConDescuento =
    pro.precioVenta - (pro.descuento * pro.precioVenta) / 100

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
          ref={inputCantidad}
          type="number"
          className="check-item"
          defaultValue={cantidad}
          min={pro.tipoVenta === 'Unidad' ? '1' : '0.25'}
          step={pro.tipoVenta === 'Unidad' ? '1' : '0.25'}
          onInput={handlerCantidad}
        />
      </td>
      <td>{pro.code}</td>
      <td>{pro.name}</td>
      <td>{pro.precioVenta}</td>
      <td>{(pro.cantidad * pro.precioVenta).toFixed(2)}</td>
      <td>
        {`${pro.descuento} % ${
          pro.descuento > 0
            ? 'Precio con escuento:(' +
              expectedRound.round10(precioConDescuento, -1).toFixed(2) +
              ')'
            : ''
        }`}
      </td>
      <td>
        {expectedRound
          .round10(pro.cantidad * precioConDescuento, -1)
          .toFixed(2)}
      </td>
      <td className="action-btns">
        <a className="edit-btn" title="Editar">
          <i className="fas fa-trash" onClick={handlerDeleteProduct}></i>
        </a>
      </td>
    </tr>
  )
}

export default FilaVenta
