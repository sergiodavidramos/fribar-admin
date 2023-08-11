import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Notifications, { notify } from 'react-notify-toast'
import axios from 'axios'
import UserContext from '../../components/UserContext'
import { useEffect, useContext, useState } from 'react'
import { API_URL } from '../../components/Config'
import FormData from 'form-data'
import Search from '../../components/Search'
const sucursalNuevo = () => {
  const { token, signOut } = useContext(UserContext)
  const [ciudades, setCiudades] = useState([])
  const [idCiudad, setidCiudad] = useState(false)
  const [idAdmin, setIdAdmin] = useState(false)
  const [imgParaMostrar, setImgParaMostrar] = useState('')
  const [imgParaSubir, setImgParaSubir] = useState(false)
  const [estadoBoton, setEstadoBoton] = useState(false)

  function getCiudadesDB() {
    axios
      .get(`${API_URL}/ciudad`, {
        headers: { 'Content-Type': 'application/json' },
        params: { status: true },
      })
      .then((response) => {
        setCiudades(response.data.body)
      })
      .catch((err) => {
        notify.show(
          'Error el obtener las ciudades, comuníquese con el administrador',
          'error',
          4000
        )
      })
  }
  useEffect(() => {
    getCiudadesDB()
  }, [])

  function handlerCiudad() {
    setidCiudad(event.target.value)
  }
  function handlerSubmit() {
    let target = event.target
    event.preventDefault()
    let formData = new FormData()

    if (idCiudad == 'false' && idAdmin === false)
      notify.show('Faltan datos por completar', 'warning', 2000)
    else {
      setEstadoBoton(true)
      axios
        .post(
          `${API_URL}/sucursal`,
          {
            nombre: target[0].value,
            ciudad: idCiudad,
            direccion: target[2].value,
            lat: target[3].value,
            lon: target[4].value,
            referencia: target[5].value,
            state: target[6].value === '0' ? true : false,
            descripcion: target[7].value,
            horaApertura: target[9].value,
            horaCierre: target[10].value,
            administrador: idAdmin,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'content-type': 'application/json',
            },
          }
        )
        .then((datos) => {
          if (datos.status === 401) signOut()
          if (datos.status === 200) {
            formData.append('imagen', imgParaSubir)
            const createImgPromise = axios.put(
              `${API_URL}/upload/sucursal/${datos.data.body._id}`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'content-type': 'application/json',
                },
              }
            )
            const createInventarioPromise = axios.post(
              `${API_URL}/inventario`,
              {
                sucursal: datos.data.body._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  'content-type': 'application/json',
                },
              }
            )
            Promise.all([createImgPromise, createInventarioPromise])
              .then((dat) => {
                setEstadoBoton(false)
                if (dat[0].data.error || dat[1].data.error) {
                  notify.show(dat.data.body, 'error', 2000)
                  setButt(false)
                } else {
                  target[0].value = ''
                  target[1].value = 0
                  target[2].value = ''
                  target[3].value = ''
                  target[4].value = ''
                  target[5].value = ''
                  target[6].value = '0'
                  target[7].value = ''
                  target[8].value = ''
                  target[9].value = ''
                  target[10].value = ''
                  target[11].value = ''
                  setImgParaMostrar('')
                  notify.show(
                    'Sucursal agregado con Exito! ',
                    'success',
                    2000
                  )
                  setEstadoBoton(false)
                }
              })
              .catch((err) => {
                notify.show('No se pudo subir las imagenes', 'error')
                setEstadoBoton(false)
              })
          }
          setEstadoBoton(false)
        })
        .catch((err) => {
          console.log('EL ERORR', err)
          setEstadoBoton(false)
          notify.show(
            'Error al registrar el sucursal, comuníquese con el administrador',
            'error',
            4000
          )
        })
    }
  }
  function uploadFile(e) {
    setImgParaMostrar(URL.createObjectURL(e.target.files[0]))
    setImgParaSubir(e.target.files[0])
    // setImgParaMostrar
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
              <h2 className="mt-30 page-title">Nueva sucursal</h2>
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
                  Agregar sucursal
                </li>
              </ol>
              <div className="row">
                <div className="col-lg-12">
                  <div className="add-new-shop">
                    <div className="card card-static-2 mb-30">
                      <form onSubmit={handlerSubmit} autoComplete="off">
                        <div className="row no-gutters">
                          <div className="col-lg-6 col-md-6">
                            <div className="card-title-2">
                              <h4>Registrar nueva sucursal</h4>
                            </div>
                            <div className="card-body-table">
                              <div className="add-shop-content pd-20">
                                <div className="form-group">
                                  <label className="form-label">
                                    Nombre*
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nombre de la sucursal"
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">
                                    Ciudad*
                                  </label>
                                  <select
                                    id="location"
                                    name="location"
                                    className="form-control"
                                    defaultValue={0}
                                    onChange={handlerCiudad}
                                  >
                                    <option value={false}>
                                      --Seleccionar ciudad--
                                    </option>
                                    {ciudades.length > 0
                                      ? ciudades.map((ciu) => (
                                          <option
                                            value={ciu._id}
                                            key={ciu._id}
                                          >
                                            {ciu.nombre}
                                          </option>
                                        ))
                                      : ''}
                                  </select>
                                </div>

                                <div className="form-group">
                                  <label className="form-label">
                                    Direccion*
                                  </label>
                                  <div className="card card-editor">
                                    <div className="content-editor">
                                      <textarea
                                        className="text-control"
                                        placeholder="Introduzca la direccion"
                                        required
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label className="form-label">
                                    Latitud*
                                  </label>
                                  <input
                                    className="form-control"
                                    placeholder="0"
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">
                                    Longitud*
                                  </label>
                                  <input
                                    className="form-control"
                                    placeholder="0"
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">
                                    Referencia*
                                  </label>
                                  <div className="card card-editor">
                                    <div className="content-editor">
                                      <textarea
                                        className="text-control"
                                        placeholder="Introduzca la referencia de la direccion"
                                        required
                                      ></textarea>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6">
                            <div className="card-body-table">
                              <div className="form-group">
                                <label className="form-label">
                                  Estado*
                                </label>
                                <select
                                  id="status"
                                  name="status"
                                  className="form-control"
                                  defaultValue={0}
                                >
                                  <option value="0">Activo</option>
                                  <option value="1">Inactivo</option>
                                </select>
                              </div>
                              <div className="form-group">
                                <label className="form-label">
                                  Descripción*
                                </label>
                                <div className="card card-editor">
                                  <div className="content-editor">
                                    <textarea
                                      className="text-control"
                                      placeholder="Introduzca la descripción"
                                      required
                                    ></textarea>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group">
                                <label className="form-label">
                                  Imagen de la tienda*
                                </label>
                                <div className="input-group">
                                  <div className="custom-file">
                                    <input
                                      type="file"
                                      className="custom-file-input"
                                      id="inputGroupFile04"
                                      aria-describedby="inputGroupFileAddon04"
                                      required
                                      onChange={uploadFile}
                                    />
                                    <label
                                      className="custom-file-label"
                                      htmlFor="inputGroupFile04"
                                    >
                                      Imagen de la tienda
                                    </label>
                                  </div>
                                </div>
                                <div className="add-cate-img-1">
                                  <img
                                    src={imgParaMostrar}
                                    alt={imgParaMostrar ? 'Sucursal' : ''}
                                  />
                                </div>
                              </div>
                              <div className="add-shop-content pd-20">
                                <div className="form-group">
                                  <label className="form-label">
                                    Hora de apertura*
                                  </label>
                                  <input
                                    type="time"
                                    id="default-picker"
                                    className="form-control"
                                    placeholder="Select time"
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">
                                    Hora de cierre*
                                  </label>
                                  <input
                                    type="time"
                                    id="default-picker"
                                    className="form-control"
                                    placeholder="Select time"
                                    required
                                  />
                                </div>
                              </div>

                              <div className="card-title-2">
                                <h4>Administrador de la tienda</h4>
                              </div>
                              <div className="card-body-table">
                                <div className="add-shop-content pd-20">
                                  <Search
                                    token={token}
                                    setIdAdmin={setIdAdmin}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            disabled={estadoBoton}
                            className="save-btn hover-btn"
                            type="submit"
                          >
                            Agregar nueva sucursal
                          </button>
                        </div>
                      </form>
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

export default sucursalNuevo
