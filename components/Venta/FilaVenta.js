import { useState, useRef, useEffect } from 'react'
import expectedRound from 'expected-round'
const FilaVenta = ({
  pro,
  setCantidad,
  index,
  deleteProduct,
  setfocus,
}) => {
  const [cantidad, setCa] = useState(pro.cantidad)

  const textCantidad = useRef(null)
  const precioConDescuento =
    pro.precioVenta - (pro.descuento * pro.precioVenta) / 100

  useEffect(() => {
    textCantidad.current.focus()
  }, [])
  const handlerCantidad = (event) => {
    setCa(event.target.value)
    setCantidad(index, event.target.value)
  }
  const handlerDeleteProduct = () => {
    deleteProduct(index)
  }
  function obtenerTeclado(event) {
    var codigo = event.key
    if (codigo === 'Tab') {
      setfocus(true)
    }
  }

  return (
    <tr>
      <td>
        <input
          ref={textCantidad}
          type="number"
          className="check-item"
          defaultValue={cantidad}
          min="1"
          onInput={handlerCantidad}
          onKeyDown={obtenerTeclado}
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
        {(
          pro.cantidad * expectedRound.round10(precioConDescuento, -1)
        ).toFixed(2)}
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
