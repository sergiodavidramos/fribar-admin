import TopNavbar from '../../../components/Navbar'
import SideNav from '../../../components/Navbar/SideNav'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import Notifications, { notify } from 'react-notify-toast'
import axios from 'axios'
import UserContext from '../../../components/UserContext'
import { useEffect, useContext, useState } from 'react'
import { API_URL } from '../../../components/Config'
import FormData from 'form-data'
import { useRouter } from 'next/router'
import GetImg from '../../../components/GetImg'
import Search from '../../../components/Search'
const sucursalNuevo = () => {
  const { token, signOut } = useContext(UserContext)
  const [ciudades, setCiudades] = useState([])
  const [idCiudad, setidCiudad] = useState(false)
  const [imgParaMostrar, setImgParaMostrar] = useState('')
  const [imgParaSubir, setImgParaSubir] = useState(false)
  const [estadoBoton, setEstadoBoton] = useState(false)
  const [sucursal, setSucursal] = useState(false)
  const [idSucursal, setIdSucursal] = useState(false)
  const [idAdmin, setIdAdmin] = useState(false)
  const router = useRouter()
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
  function getSucursalId(tokenLocal, router) {
    if (router && router.query && router.query.id) {
      const { id } = router.query
      axios
        .get(`http://localhost:3001/sucursal/${id}`, {
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
            setidCiudad(data.body.ciudad._id)
            setIdAdmin(data.body.administrador._id)
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
      getCiudadesDB()
      setIdSucursal(router.query.id)
      getSucursalId(tokenLocal, router)
    }
  }, [router])

  function handlerCiudad() {
    setidCiudad(event.target.value)
  }
  function handlerSubmit() {
    let target = event.target
    event.preventDefault()
    let formData = new FormData()
    if (idCiudad == 'false') {
      notify.show('Por favor seleccione una Ciudad', 'warning', 2000)
    } else {
      if (imgParaSubir) {
        formData.append('imagen', imgParaSubir)
        axios
          .put(`${API_URL}/upload/sucursal/${idSucursal}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'content-type': 'application/json',
            },
          })

          .then((result) => {
            if (result.error) {
              notify.show(result.body, 'error', 2000)
            } else {
              axios
                .patch(
                  `${API_URL}/sucursal/${idSucursal}`,
                  {
                    nombre: target[0].value,
                    ciudad: idCiudad,
                    direccion: target[2].value,
                    idDireccion: sucursal.direccion._id
                      ? sucursal.direccion._id
                      : sucursal.direccion,
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
                .then((response) => {
                  if (response.error) {
                    notify.show(response.data.body, 'error', 2000)
                  } else {
                    setEstadoBoton(false)
                    setSucursal({
                      ...response.data.body.direccion,
                      ...response.data.body.sucursalNuevo,
                    })
                    notify.show(
                      'Cambios guardados con Exito! ',
                      'success',
                      2000
                    )
                  }
                })
                .catch((e) => {
                  console.log('EL ERORO', e)
                  setEstadoBoton(false)

                  notify.show('No se pudo guardar los cambios', 'error')
                })
            }
          })
          .catch((err) => {
            console.log('RRRRR', err)
            notify.show('No se pudo subir las imagenes', 'error')
            setEstadoBoton(false)
          })
      } else {
        axios
          .patch(
            `${API_URL}/sucursal/${idSucursal}`,
            {
              nombre: target[0].value,
              ciudad: idCiudad,
              idDireccion: sucursal.direccion._id
                ? sucursal.direccion._id
                : sucursal.direccion,
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
          .then((response) => {
            if (response.error) {
              notify.show(response.data.body, 'error', 2000)
            } else {
              setSucursal({
                ...response.data.body.direccion,
                ...response.data.body.sucursalNuevo,
              })
              setEstadoBoton(false)
              notify.show('Cambios guardados con Exito! ', 'success', 2000)
            }
          })
          .catch((e) => {
            console.log('asdasdas', e)
            setEstadoBoton(false)
            notify.show('No se pudo guardar los cambios', 'error')
          })
      }
    }
  }
  function uploadFile(e) {
    setImgParaMostrar(URL.createObjectURL(e.target.files[0]))
    setImgParaSubir(e.target.files[0])
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
                  Agregar sucursal
                </li>
              </ol>
              {sucursal ? (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="add-new-shop">
                      <div className="card card-static-2 mb-30">
                        <form onSubmit={handlerSubmit}>
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
                                      defaultValue={sucursal.nombre}
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
                                      defaultValue={sucursal.ciudad._id}
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
                                          defaultValue={
                                            sucursal.direccion.direccion
                                          }
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
                                      defaultValue={sucursal.direccion.lat}
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
                                      defaultValue={sucursal.direccion.lon}
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
                                          defaultValue={
                                            sucursal.direccion.referencia
                                          }
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
                                    defaultValue={
                                      sucursal.state === true ? '0' : '1'
                                    }
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
                                        defaultValue={sucursal.descripcion}
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
                                      src={
                                        !imgParaMostrar
                                          ? GetImg(
                                              sucursal.img,
                                              'http://localhost:3001/upload/sucursal'
                                            )
                                          : imgParaMostrar
                                      }
                                      alt={
                                        imgParaMostrar ? 'Sucursal' : ''
                                      }
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
                                      defaultValue={sucursal.horaApertura}
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
                                      defaultValue={sucursal.horaCierre}
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
                                      user={`${sucursal.administrador.idPersona.nombre_comp} - ${sucursal.administrador.idPersona.ci}`}
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
                              Editar sucursal
                            </button>
                          </div>
                        </form>
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
