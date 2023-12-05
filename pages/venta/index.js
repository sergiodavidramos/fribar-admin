import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Notifications, { notify } from 'react-notify-toast'
import Link from 'next/link'
import { useState, useRef, useEffect, useContext } from 'react'
import FilaVenta from '../../components/Venta/FilaVenta'
import UserContext from '../../components/UserContext'
import { API_URL } from '../../components/Config'
import ConfirmacionModel from '../../components/Venta/modelConfirmarVenta'
import expectedRound from 'expected-round'

import dynamic from 'next/dynamic'

const Venta = () => {
  const [productFilter, setProductFilter] = useState([])
  const [buscarText, setBuscarText] = useState('')
  const textBusqueda = useRef()
  const [total, setTotal] = useState(0)

  const { getAdmSucursal, token, signOut } = useContext(UserContext)

  let auxTotal = 0

  const [desactivarInput, setdesactivarInput] = useState(true)

  const nombreCliente = useRef(false)
  const ciCliente = useRef(false)
  const efectivo = useRef(0)

  const [idCliente, setIdCliente] = useState(false)
  const [sucursal, setSucursal] = useState(false)
  const [gerente, setGerente] = useState(false)
  const [focus, setfocus] = useState(false)
  const [totalCambio, setTotalCambio] = useState(0)

  const [butt, setButt] = useState(false)

  useEffect(() => {
    if (focus) textBusqueda.current.focus()
    setfocus(false)
    getSucursalId(token, getAdmSucursal)
    const user = JSON.parse(localStorage.getItem('fribar-user'))
    if (user)
      user.role === 'GERENTE-ROLE' ? setGerente(true) : setGerente(false)
  }, [token, getAdmSucursal, focus])
  const handlerChange = (event) => {
    setBuscarText(event.target.value)
    if (event.target.value) {
      fetch(
        `http://localhost:3001/inventario/buscar/codigoProducto?code=${event.target.value}&idSucursal=${getAdmSucursal}`,
        {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.error) notify.show(data.body.message, 'error')
          else {
            if (data.body !== null) {
              setBuscarText('')
              if (productFilter.length > 0) {
                let pro = {}
                for (let d of data.body) {
                  const producto = d.producto[0]
                  const categoria = d.category[0]
                  producto.category = categoria
                  producto.stock = d.allProducts.stock
                  pro = { producto }
                }
                arrayHandlerProduct(pro)
              } else {
                let pro = {}
                for (let d of data.body) {
                  const producto = d.producto[0]
                  const categoria = d.category[0]
                  producto.category = categoria
                  producto.stock = d.allProducts.stock
                  //   pro.push({ producto })
                  pro = { producto }
                }
                pro.producto.cantidad = 1
                setProductFilter([pro.producto])
                notify.show(`Producto Agregado`, 'success', 1000)
                console.log('SSS', pro)
                const precioConDescuento =
                  pro.producto.precioVenta -
                  (pro.producto.descuento * pro.producto.precioVenta) / 100
                setTotal(
                  pro.producto.descuento > 0
                    ? (
                        pro.producto.cantidad *
                        expectedRound.round10(precioConDescuento, -1)
                      ).toFixed(2)
                    : pro.producto.cantidad * pro.producto.precioVenta
                )
              }
            } else setBuscarText('')
          }
        })
        .catch((err) => console.log('Errorrrrr', err))
    } else {
      setProductFilter(null)
    }
  }

  const arrayHandlerProduct = (pro) => {
    let a = false
    let aux
    for (let i = 0; i < productFilter.length; i++) {
      if (productFilter[i].code === pro.producto.code) {
        productFilter[i].cantidad = productFilter[i].cantidad + 1
        aux = productFilter
        setProductFilter([])
        a = true
        setProductFilter(aux)
        handlerTotal()
        notify.show(
          `Se sumo la cantidad " ${aux[i].name} "`,
          'success',
          1000
        )
      }
    }
    if (!a) {
      pro.producto.cantidad = 1
      setProductFilter(productFilter.concat([pro.producto]))
      notify.show(`Producto Agregado`, 'success', 1000)
      const precioConDescuento =
        pro.producto.precioVenta -
        (pro.producto.descuento * pro.producto.precioVenta) / 100
      setTotal(
        pro.producto.descuento > 0
          ? (
              parseFloat(total) +
              expectedRound.round10(precioConDescuento, -1)
            ).toFixed(2)
          : (parseFloat(total) + pro.producto.precioVenta * 1).toFixed(2)
      )
    }
  }

  const setCantidad = (index, can) => {
    let aux
    can < 0
      ? (productFilter[index].cantidad = 0)
      : (productFilter[index].cantidad = parseInt(can))
    aux = productFilter
    setProductFilter([])
    setProductFilter(aux)
    handlerTotal()
  }

  const handlerTotal = () => {
    for (let j = 0; j < productFilter.length; j++) {
      if (productFilter[j].descuento > 0) {
        const precioConDescuento =
          productFilter[j].precioVenta -
          (productFilter[j].descuento * productFilter[j].precioVenta) / 100
        auxTotal =
          auxTotal +
          productFilter[j].cantidad *
            expectedRound.round10(precioConDescuento, -1)
      } else {
        auxTotal =
          auxTotal +
          productFilter[j].cantidad * productFilter[j].precioVenta
      }
    }
    setTotal(auxTotal.toFixed(2))
  }

  const deleteProduct = (index) => {
    productFilter.splice(index, 1)
    let aux = productFilter
    setProductFilter([])
    setProductFilter(aux)
    handlerTotal()
  }
  const handlerBuscarCi = (event) => {
    const tokenLocal = localStorage.getItem('fribar-token')
    fetch(`http://localhost:3001/person?ci=${event.target.value}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenLocal}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 401) signOut()
        return res.json()
      })
      .then((data) => {
        if (data.error) notify.show(data.body.message, 'error')
        else {
          if (data.body.persons.length > 0) {
            setdesactivarInput(true)
            nombreCliente.current.value = data.body.persons[0].nombre_comp
            setIdCliente({
              id: data.body.persons[0]._id,
              nombre: data.body.persons[0].nombre_comp,
              ci: data.body.persons[0].ci,
            })
          } else {
            setIdCliente(false)
            nombreCliente.current.value = null
            setdesactivarInput(false)
          }
        }
      })
      .catch((error) => console.log('errorrr', error))
  }

  function getSucursalId(tokenLocal, idSucursal) {
    if (tokenLocal && idSucursal) {
      fetch(`${API_URL}/sucursal/${idSucursal}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 401) {
            signOut()
          }
          return res.json()
        })
        .then((data) => {
          if (data.error) {
            notify.show('Por favor Seleccione una Sucursal', 'error', 2000)
          } else {
            setSucursal(data.body)
          }
        })
        .catch((error) => {
          notify.show(error.message, 'error', 2000)
        })
    }
  }
  function confirmarVenta() {
    let detalle = []

    for (let producto of productFilter) {
      const precioConDescuento =
        producto.precioVenta -
        (producto.descuento * producto.precioVenta) / 100
      const auxDetalle = {
        producto: producto._id,
        cantidad: producto.cantidad,
        subTotal:
          producto.descuento > 0
            ? (
                producto.cantidad *
                expectedRound.round10(precioConDescuento, -1)
              ).toFixed(2)
            : producto.cantidad * producto.precioVenta,
        tipoVenta: producto.tipoVenta,
        precioVenta: producto.precioVenta,
        nombreProducto: producto.name,
        descuento: producto.descuento,
      }
      detalle.push(auxDetalle)
    }
    var venta = {
      detalleVenta: detalle,
      sucursal,
      efectivo: efectivo.current.value,
    }
    if (idCliente) venta.client = idCliente
    if (!idCliente) {
      setButt(true)
      if (!nombreCliente.current.value || !ciCliente.current.value) {
        notify.show(
          'Por favor ingrese el nombre y c.i. del cliente',
          'warning',
          5000
        )
        setButt(false)
      } else
        fetch(`${API_URL}/person`, {
          method: 'POST',
          body: JSON.stringify({
            nombre_comp: nombreCliente.current.value,
            ci: ciCliente.current.value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.error) {
              notify.show(response.body, 'error', 5000)
            } else {
              setIdCliente({
                id: response.body._id,
                nombre: response.body.nombre_comp,
                ci: response.body.ci,
              })
              venta.client = {
                id: response.body._id,
                nombre: response.body.nombre_comp,
                ci: response.body.ci,
              }

              fetch(`${API_URL}/venta`, {
                method: 'POST',
                body: JSON.stringify(venta),
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              })
                .then(async (res) => ({
                  blob: await res.blob(),
                }))
                .then((resObj) => {
                  notify.show(
                    'Venta realizada con exito!',
                    'success',
                    2000
                  )
                  // It is necessary to create a new blob object with mime-type explicitly set for all browsers except Chrome, but it works for Chrome too.
                  const newBlob = new Blob([resObj.blob], {
                    type: 'application/pdf',
                  })
                  // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
                  if (
                    window.navigator &&
                    window.navigator.msSaveOrOpenBlob
                  ) {
                    window.navigator.msSaveOrOpenBlob(newBlob)
                  } else {
                    setButt(false)
                    // For other browsers: create a link pointing to the ObjectURL containing the blob.
                    const objUrl = window.URL.createObjectURL(newBlob)

                    const windowFeatures =
                      'left=100,top=100,width=320,height=900'
                    var win = window.open(
                      objUrl,
                      'mozillaTab',
                      windowFeatures
                    )
                  }
                  setProductFilter([])
                  setTotal(0)
                  setTotalCambio(0)
                  efectivo.current.value = ''
                  nombreCliente.current.value = ''
                  ciCliente.current.value = ''
                  setIdCliente(false)
                })
                .catch((err) => {
                  console.log('Sergio Error Primero', err)
                  notify.show(
                    'No se pudo registrar la venta error (servidor)',
                    'error'
                  )
                  setButt(false)
                })
            }
          })
          .catch((err) => console.log('Sergio Error', err))
    } else {
      setButt(true)
      fetch(`${API_URL}/venta`, {
        method: 'POST',
        body: JSON.stringify(venta),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then(async (res) => ({
          blob: await res.blob(),
        }))
        .then((resObj) => {
          notify.show('Venta realizada con exito!', 'success', 2000)
          // It is necessary to create a new blob object with mime-type explicitly set for all browsers except Chrome, but it works for Chrome too.
          const newBlob = new Blob([resObj.blob], {
            type: 'application/pdf',
          })
          // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(newBlob)
          } else {
            setButt(false)
            // For other browsers: create a link pointing to the ObjectURL containing the blob.
            const objUrl = window.URL.createObjectURL(newBlob)

            const windowFeatures = 'left=100,top=100,width=320,height=900'
            var win = window.open(objUrl, 'mozillaTab', windowFeatures)
          }
          setProductFilter([])
          setTotal(0)
          setTotalCambio(0)
          efectivo.current.value = ''
          nombreCliente.current.value = ''
          ciCliente.current.value = ''
          setIdCliente(false)
        })
        .catch((err) => {
          console.log('Sergio Error Segundo', err)
          notify.show(
            'No se pudo registrar la venta error (servidor)',
            'error'
          )
          setButt(false)
        })
    }
  }
  let fnGetFileNameFromContentDispostionHeader = function (header) {
    console.log('ssss', header)
    let contentDispostion = header.split(';')
    const fileNameToken = `filename*=UTF-8''`

    let fileName = 'downloaded.pdf'
    for (let thisValue of contentDispostion) {
      if (thisValue.trim().indexOf(fileNameToken) === 0) {
        fileName = decodeURIComponent(
          thisValue.trim().replace(fileNameToken, '')
        )
        break
      }
    }

    return fileName
  }

  const handlerCalcularCambio = () => {
    if (efectivo.current.value)
      setTotalCambio(
        (parseFloat(efectivo.current.value) - parseFloat(total)).toFixed(2)
      )
    else setTotalCambio(0)
  }
  return (
    <>
      <ConfirmacionModel confirmarVenta={confirmarVenta} />
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Venta</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  Ventas de la sucursal ""
                  {sucursal.nombre ? sucursal.nombre.toUpperCase() : ''}""
                </li>
              </ol>
              {gerente === true && sucursal === false ? (
                'PORFAVOR SELECCIONE UNA SUCURSAL'
              ) : (
                <div className="row justify-content-between">
                  <div className="col-lg-12 col-md-12">
                    <div className="card card-static-2 mb-30">
                      <div className="row justify-content-center">
                        <div className="search-by-name-input">
                          <input
                            ref={textBusqueda}
                            value={buscarText}
                            type="text"
                            className="form-control"
                            placeholder="Buscar Producto"
                            onChange={handlerChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th>Cantidad</th>
                              <th>Código</th>
                              <th>Nombre</th>
                              <th>Precio Un/Kg</th>
                              <th>Sub total</th>
                              <th>Descuento</th>
                              <th>Sub total con descuento</th>
                              <th>Eliminar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!productFilter ? (
                              <tr>
                                <td>...</td>
                              </tr>
                            ) : (
                              productFilter.map((pro, index) => (
                                <FilaVenta
                                  key={index}
                                  pro={pro}
                                  setCantidad={setCantidad}
                                  index={index}
                                  deleteProduct={deleteProduct}
                                  setfocus={setfocus}
                                />
                              ))
                            )}
                          </tbody>
                        </table>

                        <div className="col-lg-12 col-md-7">
                          <div className="all-cate-tags">
                            <div
                              className="row justify-content-between mt-30"
                              style={{ marginBottom: '10px' }}
                            >
                              <div className="col-lg-3 col-md-5">
                                <div className="bulk-section mt-20">
                                  <div className="order-total-left-text fsz-18">
                                    Total
                                  </div>
                                  <div className="order-total-right-text fsz-18">
                                    {total} Bs
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-4 col-md-5">
                                <div className="bulk-section ">
                                  <div className="search-by-name-input">
                                    <input
                                      ref={efectivo}
                                      type="number"
                                      className="form-control"
                                      placeholder="Ingrese el efectivo recibido"
                                      onChange={handlerCalcularCambio}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-2 col-md-5">
                                <div className="bulk-section ">
                                  <div className="order-total-left-text fsz-18">
                                    Cambio
                                  </div>
                                  <div className="order-total-right-text fsz-18">
                                    {totalCambio} Bs
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="col-lg-12 col-md-12">
              <div className="card card-static-2 mb-30">
                <div className="card-title-2">
                  <h4>Buscar usuario</h4>
                </div>
                <div className="card-body-table">
                  <div className="news-content-right pd-20">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="form-group mb-3">
                          <label className="form-label">
                            Buscar por C.I. o NIT
                          </label>
                          <input
                            ref={ciCliente}
                            type="text"
                            className="form-control"
                            placeholder="Ingrese El C.I. o NIT"
                            onChange={handlerBuscarCi}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="form-group mb-3">
                          <label className="form-label">Nombre</label>
                          <input
                            type="email"
                            className="form-control"
                            ref={nombreCliente}
                            required
                            disabled={desactivarInput}
                            placeholder="Ingrese su nombre completo"
                          />
                        </div>
                      </div>

                      {/* 
                      <div className="col-lg-6">
                        <div className="form-group mb-3">
                          <label className="form-label">Direccion*</label>
                          <textarea
                            disabled={desactivarInput}
                            ref={direccionCliente}
                            className="form-control"
                            placeholder="Direcciones (este campo no es editable.)"
                            //   defaultValue={user.direccion || ''}
                          ></textarea>
                        </div>
                      </div> */}
                      <div className="col-lg-6">
                        <button
                          data-toggle="modal"
                          data-target="#confirmacion_model"
                          className="save-btn hover-btn"
                          type="submit"
                          //   onClick={confirmarVenta}
                          disabled={butt}
                        >
                          Confirmar la venta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
export default Venta
