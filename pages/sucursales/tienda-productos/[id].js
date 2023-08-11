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
const sucursalNuevo = () => {
  const { token, signOut } = useContext(UserContext)
  const [productos, setProductos] = useState([])
  const [sucursal, setSucursal] = useState(false)
  const [idSucursal, setIdSucursal] = useState(false)
  const [idProducto, setIdProducto] = useState(false)
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
      inputCantidad.current.value <= 0 ||
      selectProducto.current.value === '0' ||
      !selectProducto.current.value
    )
      notify.show(
        'El producto y la cantidad es necesaria',
        'warning',
        2000
      )
    else {
      datos = await axios.get(
        `${API_URL}/inventario/buscar/producto-sucursal?idProducto=${idProducto}?idSucursal=${idSucursal}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      console.log(datos)

      console.log('SSSS', inputCantidad.current.value)
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
                        <div className="col-lg-4 col-md-5">
                          <div className="bulk-section mb-30">
                            <div className="input-group">
                              <select
                                id="action"
                                name="action"
                                className="form-control"
                                defaultValue="0"
                              >
                                <option value="0">Acciones masivas</option>
                                <option value="1">Activos</option>
                                <option value="2">Inactivos</option>
                              </select>
                              <div className="input-group-append">
                                <button
                                  className="status-btn hover-btn"
                                  type="submit"
                                >
                                  Aplicar
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-5 col-md-7">
                          <div className="bulk-section text-left mb-30">
                            <div className="search-by-name-input mr-0">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar"
                              />
                            </div>
                            <button
                              className="status-btn hover-btn"
                              type="submit"
                            >
                              Buscar Producto
                            </button>
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="card card-static-2 mb-30">
                            <div className="card-title-2">
                              <h4>Todos los productos de la tienda</h4>
                            </div>
                            <div className="card-body-table">
                              <div className="table-responsive">
                                <table className="table ucp-table table-hover">
                                  <thead>
                                    <tr>
                                      <th>Nombre</th>
                                      <th>Cantidad</th>
                                      <th>Estado</th>
                                      <th>Accion</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>Product Name Here</td>
                                      <td>250</td>
                                      <td>
                                        <span className="badge-item badge-status">
                                          Active
                                        </span>
                                      </td>
                                      <td className="action-btns">
                                        <a
                                          href="#"
                                          className="edit-btn"
                                          tabIndex={'editar'}
                                        >
                                          <i className="fas fa-edit"></i>
                                        </a>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
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
