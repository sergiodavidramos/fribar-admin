import TopNavbar from '../../../components/Navbar'
import SideNav from '../../../components/Navbar/SideNav'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import Notifications, { notify } from 'react-notify-toast'
import axios from 'axios'
import UserContext from '../../../components/UserContext'
import { useEffect, useContext, useState, useRef } from 'react'
import { API_URL } from '../../../components/Config'
import { useRouter } from 'next/router'
import CardTableInventario from '../../../components/Productos/CardTableInventario'
const sucursalNuevo = () => {
  const { token, signOut } = useContext(UserContext)
  const [productos, setProductos] = useState([])
  const [sucursal, setSucursal] = useState(false)
  const [idSucursal, setIdSucursal] = useState(false)
  const [idProducto, setIdProducto] = useState(false)
  const [proFiltrado, setProFiltrado] = useState(null)

  const router = useRouter()

  const inputPrecio = useRef(0)
  const inputCantidad = useRef(null)
  const selectProducto = useRef(false)
  let buttonDisable = false
  function getProductosDB() {
    axios
      .get(`${API_URL}/productos/all`, {
        headers: { 'Content-Type': 'application/json' },
        params: { status: true },
      })
      .then((response) => {
        setProductos(response.data.body)
      })
      .catch((err) => {
        notify.show(
          'Error el obtener los productos, comuníquese con el administrador',
          'error',
          4000
        )
      })
  }
  function getSucursalId(tokenLocal, router) {
    if (router && router.query && router.query.id) {
      const { id } = router.query
      axios
        .get(`${API_URL}/sucursal/${id}`, {
          headers: {
            Authorization: `Bearer ${tokenLocal}`,
            'Content-Type': 'application/json',
          },
        })
        .then(({ data }) => {
          if (data.status === 401) {
            signOut()
          }
          if (data.error) {
            notify.show('Error en el servidor (ciudad)', 'error', 2000)
          } else {
            setSucursal(data.body)
          }
        })
        .catch((error) => {
          notify.show(error.message, 'error', 2000)
        })
    }
  }
  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    if (!tokenLocal) {
      signOut()
    } else {
      getProductosDB()
      setIdSucursal(router.query.id)
      getSucursalId(tokenLocal, router)
    }
  }, [router])

  async function handlerSubmit() {
    buttonDisable = true
    if (
      !inputCantidad.current.value ||
      inputCantidad.current.value === 0 ||
      selectProducto.current.value === '0' ||
      !selectProducto.current.value
    )
      notify.show(
        'El producto y la cantidad es necesaria',
        'warning',
        2000
      )
    else {
      try {
        const datos = await axios.get(
          `${API_URL}/inventario/buscar/producto-sucursal?idProducto=${idProducto}&idSucursal=${idSucursal}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        if (datos.status === 401) signOut()
        if (datos.status === 200) {
          if (datos.data.body.length <= 0) {
            const nuevoProductoInventario = await axios.post(
              `${API_URL}/inventario/nuevo/producto`,
              {
                producto: idProducto,
                stock: inputCantidad.current.value,
                idSucursal: idSucursal,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            )
            if (nuevoProductoInventario.status === 401) signOut()
            nuevoProductoInventario.data.error
              ? notify.show(
                  'Error al registrar el producto en la sucursal',
                  'error'
                )
              : notify.show(
                  'Se agrego el producto con exito!',
                  'success',
                  2000
                )
          } else {
            const aumentarStockInventario = await axios.patch(
              `${API_URL}/inventario/actualiza-stock`,
              {
                idProducto: idProducto,
                stock: inputCantidad.current.value,
                idSucursal: idSucursal,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json',
                },
              }
            )
            if (aumentarStockInventario.status === 401) signOut()
            aumentarStockInventario.data.error
              ? notify.show(
                  'Error al actualizar el producto en la sucursal',
                  'error'
                )
              : notify.show(
                  'Stock actualizado con exito!',
                  'success',
                  2000
                )
          }
        }
      } catch (err) {
        console.log('EL ERROR', err)
      }
      buttonDisable = false
    }
    buttonDisable = false
  }
  async function handlerSeleccionarProducto() {
    let datos
    if (selectProducto.current.value !== '0') {
      datos = selectProducto.current.value.split(',')
      setIdProducto(datos[0])
      inputPrecio.current.value = datos[1]
    } else {
      inputPrecio.current.value = 0
    }
  }

  const handleChangeBuscarNombre = () => {
    if (event.target.value) {
      axios
        .get(
          `http://localhost:3001/inventario/buscar/termino?termino=${event.target.value}&idSucursal=${idSucursal}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((data) => {
          if (data.data.error) {
            notify.show('Error el en servidor', 'error')
          } else {
            let pro = []
            for (let d of data.data.body) {
              const producto = d.producto[0]
              const stock = d.allProducts.stock
              pro.push({ producto: producto, stock })
            }
            setProFiltrado(pro)
          }
        })
        .catch((error) => console.log('errorrr', error))
    } else {
      setProFiltrado(null)
    }
  }
  const handleChangeBuscarCodigo = () => {
    if (event.target.value) {
      axios
        .get(
          `http://localhost:3001/inventario/buscar/codigoproducto?code=${event.target.value}&idSucursal=${idSucursal}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((data) => {
          if (data.data.error) {
            notify.show(
              data.body || 'Error en el servidor buscar por codigo',
              'error'
            )
          } else {
            if (data.data.body === null) setProFiltrado([])
            else {
              let pro = []
              for (let d of data.data.body) {
                const producto = d.producto[0]
                const stock = d.allProducts.stock
                pro.push({ producto: producto, stock })
              }
              setProFiltrado(pro)
            }
          }
        })
        .catch((error) => console.log('errorrr', error))
    } else {
      setProFiltrado(null)
    }
  }

  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Editar sucursal</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/sucursales">
                    <a>Sucursales</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  {sucursal
                    ? 'Productos de la sucursal: ' + sucursal.nombre
                    : 'Productos de la sucursal ...'}
                </li>
              </ol>
              {sucursal ? (
                <div className="row">
                  <div className="col-lg-4 col-md-5">
                    <div className="card card-static-2 mb-30">
                      <div className="card-title-2">
                        <h4>Agregar nuevo producto</h4>
                      </div>
                      <div className="card-body-table">
                        <div className="news-content-right pd-20">
                          <div className="form-group">
                            <label className="form-label">Producto*</label>
                            <select
                              id="categeory"
                              name="categeory"
                              className="form-control"
                              defaultValue={'0'}
                              ref={selectProducto}
                              onChange={handlerSeleccionarProducto}
                            >
                              <option value="0">
                                --Seleecionar Producto--
                              </option>
                              {productos.length > 0
                                ? productos.map((pro) => (
                                    <option
                                      value={[pro._id, pro.precioVenta]}
                                      key={pro._id}
                                    >
                                      {pro.name}
                                    </option>
                                  ))
                                : ''}
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Precio*</label>
                            <input
                              disabled={true}
                              type="text"
                              className="form-control"
                              placeholder="0 Bs"
                              ref={inputPrecio}
                              defaultValue={inputPrecio.current.value}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Cantidad*</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="0"
                              ref={inputCantidad}
                            />
                          </div>

                          <button
                            className="save-btn hover-btn"
                            type="submit"
                            onClick={handlerSubmit}
                            disabled={buttonDisable}
                          >
                            Agregar nuevo producto ala sucursal
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 col-md-7">
                    <div className="all-cate-tags">
                      <div className="row justify-content-between">
                        <div className="col-lg-6 col-md-5">
                          <div className="bulk-section mt-30">
                            <div className="search-by-name-input">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar Producto (nombre)"
                                onChange={handleChangeBuscarNombre}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-7">
                          <div className="bulk-section mt-30">
                            <div className="search-by-name-input">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar Producto (codigo)"
                                onChange={handleChangeBuscarCodigo}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-12 col-md-12">
                          <div className="card card-static-2 mb-30">
                            <div className="card-title-2">
                              <h4>
                                Todos los productos de la Sucursal ({' '}
                                {sucursal
                                  ? sucursal.nombre
                                  : '...SELECCIONE UNA SUCURSAL'}
                                )
                              </h4>
                            </div>
                            <CardTableInventario
                              proFilter={proFiltrado}
                              idSucursal={sucursal._id}
                              token={token}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default sucursalNuevo
