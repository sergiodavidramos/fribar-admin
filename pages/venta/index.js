import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Notifications, { notify } from 'react-notify-toast'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import Model from '../../components/Model'
import FilaVenta from '../../components/Venta/FilaVenta'
const Venta = () => {
  const [productFilter, setProductFilter] = useState([])
  const [buscarText, setBuscarText] = useState('')
  const textBusqueda = useRef()
  const [total, setTotal] = useState(0)
  let auxTotal = 0

  const [desactivarInput, setdesactivarInput] = useState(true)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')

  useEffect(() => {
    textBusqueda.current.focus()
  }, [])
  const handlerChange = (event) => {
    setBuscarText(event.target.value)
    if (event.target.value) {
      fetch(
        `http://localhost:3001/productos/codigoproducto?code=${event.target.value}`,
        {
          method: 'GET',
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.error) notify.show(data.body.message, 'error')
          else {
            if (data.body !== null) {
              setBuscarText('')
              if (productFilter.length > 0) {
                arrayHandlerProduct(data.body)
              } else {
                data.body.cantidad = 1
                setProductFilter([data.body])
                notify.show(`Producto Agregado`, 'success', 1000)
                setTotal(data.body.cantidad * data.body.precioVenta)
                // handlerTotal()
              }
              //   console.log(productFilter)
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
      if (productFilter[i].code === pro.code) {
        productFilter[i].cantidad = productFilter[i].cantidad + 1
        // setBandera(true)
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
      pro.cantidad = 1
      setProductFilter(productFilter.concat([pro]))
      notify.show(`Producto Agregado`, 'success', 1000)
      setTotal((total + 1 * pro.precioVenta).toFixedo(2))
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
      auxTotal =
        auxTotal + productFilter[j].cantidad * productFilter[j].precioVenta
    }
    setTotal(auxTotal)
  }

  const deleteProduct = (index) => {
    productFilter.splice(index, 1)
    let aux = productFilter
    setProductFilter([])
    setProductFilter(aux)
    handlerTotal()
  }
  const handlerBuscarCi = (event) => {
    const tokenLocal = localStorage.getItem('frifolly-token')
    console.log(event.target.value)
    fetch(`http://localhost:3001/user?ci=${event.target.value}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenLocal}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('dddd', data)
        if (data.error) notify.show(data.body.message, 'error')
        else {
          if (data.body.users.length > 0) {
            console.log(data.body)
            setdesactivarInput(true)
            setNombre(data.body.users[0].nombre_comp)
            setTelefono(
              data.body.users[0].phone ? data.body.users[0].phone : ''
            )
            setDireccion(
              data.body.users[0].direccion.length > 0 ? 'sip' : ''
            )
          } else {
            setNombre('')
            setTelefono('')
            setDireccion('')
            setdesactivarInput(false)
          }
        }
      })
      .catch((error) => console.log('errorrr', error))
  }
  return (
    <>
      <Model id={'sadasd'} token={'6546545'} notify={notify} />
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
                <li className="breadcrumb-item active">Ventas</li>
              </ol>
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
                  {/* <TablaVenta product={productFilter} /> */}
                  {/*  */}

                  <div className="card-body-table">
                    <div className="table-responsive">
                      <table className="table ucp-table table-hover">
                        <thead>
                          <tr>
                            <th>Cantidad</th>
                            <th>Código</th>
                            <th>Nombre</th>
                            <th>Categoria</th>
                            <th>Precio Un/Kg</th>
                            <th>Sub total</th>
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
                              />
                            ))
                          )}
                        </tbody>
                      </table>

                      <div className="col-lg-2">
                        <div className="order-total-dt">
                          <div className="order-total-left-text fsz-18">
                            Total
                          </div>
                          <div className="order-total-right-text fsz-18">
                            {total} Bs
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                            defaultValue={nombre}
                            required
                            disabled={desactivarInput}
                            placeholder="Ingrese su nombre completo"
                          />
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="form-group mb-3">
                          <label className="form-label">
                            Numero Telefonico*
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            defaultValue={telefono}
                            placeholder="Ingrese su numero telefonico"
                            disabled={desactivarInput}
                          />
                        </div>
                      </div>

                      <div className="col-lg-6">
                        <div className="form-group mb-3">
                          <label className="form-label">Direccion*</label>
                          <textarea
                            disabled={desactivarInput}
                            defaultValue={direccion}
                            className="form-control"
                            placeholder="Direcciones (este campo no es editable.)"
                            //   defaultValue={user.direccion || ''}
                          ></textarea>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <button
                          className="save-btn hover-btn"
                          type="submit"
                          // onClick={() => window.print()}
                          data-toggle="modal"
                          data-target="#category_model"
                        >
                          Guardar Cambios
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
