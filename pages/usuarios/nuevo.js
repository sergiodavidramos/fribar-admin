import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { useEffect, useContext, useState } from 'react'
import UserContext from '../../components/UserContext'
import GetImg from '../../components/GetImg'
import FormData from 'form-data'
import Notifications, { notify } from 'react-notify-toast'
// Prueba commit desde terminal
const nuevoUsuario = () => {
  const { signOut, getSucursales } = useContext(UserContext)
  const [token, setToken] = useState(false)
  const [image, setImage] = useState(null)
  const [imageUpload, setImageUpload] = useState(null)
  const [isPersonal, setisPersonal] = useState('1')
  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    if (!tokenLocal) {
      signOut()
    }
    setToken(tokenLocal)
  })
  function uploadFile(e) {
    setImage(URL.createObjectURL(e.target.files[0]))
    setImageUpload(e.target.files[0])
  }
  function handlerSubmit() {
    let formData = new FormData()
    event.preventDefault()
    const target = event.target
    if (imageUpload) {
      formData.append('imagen', imageUpload)

      fetch(`http://localhost:3001/user`, {
        method: 'POST',
        body: JSON.stringify({
          nombre_comp: target[0].value,
          ci: target[1].value,
          password: target[2].value,
          email: target[3].value,
          phone: target[4].value,
          role: target[5].value,
          personal: target[6].value,
          idSucursal: isPersonal ? target[7].value : '',
          lat: target[9].value,
          lon: target[10].value,
          direccion: target[11].value,
          referencia: target[12].value,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 401) signOut()
          return res.json()
        })
        .then((response) => {
          if (response.error) {
            notify.show(response.body, 'error', 2000)
          } else {
            console.log(response.body)
            fetch(
              `http://localhost:3001/upload/user/${response.body._id}`,
              {
                method: 'PUT',
                body: formData,
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
              .then((res) => {
                if (res.status === 401) signOut()
                return res.json()
              })
              .then((response) => {
                if (response.error) {
                  notify.show(response.body, 'error', 2000)
                } else {
                  notify.show(
                    'Se registro al nuevo usuario con Exito! ',
                    'success',
                    2000
                  )
                }
              })
              .catch((error) => {
                notify.show('No se pudo subir las imagenes', 'error')
              })
          }
        })
        .catch((e) => {
          notify.show('No se pudo guardar los cambios', 'error')
        })
    } else {
      notify.show('Por favor seleccione una imagen', 'warning', 3000)
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
              <h2 className="mt-30 page-title">Agregar nuevo usuario</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  <Link href="/usuarios">
                    <a>Usuarios</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Nuevo usuario</li>
              </ol>
              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Registro de usuario</h4>
                    </div>
                    <div className="card-body-table">
                      <form onSubmit={handlerSubmit}>
                        <div className="news-content-right pd-20">
                          <div className="form-group">
                            <label className="form-label">Nombre*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese su nombre comleto"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">C.I.*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese el C.I."
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Contraseña*
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              placeholder="Ingrese su nombre Contraseña"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Email*</label>
                            <input
                              type="email"
                              className="form-control"
                              placeholder="Ingrese su correo"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Teléfono*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese su numero Teléfonico"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Rol del usuario*
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese su cargo"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Personal*</label>
                            <select
                              className="form-control"
                              defaultValue={'1'}
                              onChange={(e) =>
                                setisPersonal(e.target.value)
                              }
                            >
                              <option value="1">Si</option>
                              <option value="0">No</option>
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Sucursal*</label>
                            <select
                              className="form-control"
                              defaultValue={false}
                            >
                              <option value={false}>
                                Asigne a una sucursal
                              </option>
                              {getSucursales.length > 0 ? (
                                getSucursales.map((sucursal, index) => (
                                  <option value={sucursal._id} key={index}>
                                    {sucursal.nombre}
                                  </option>
                                ))
                              ) : (
                                <option value={false}>
                                  No hay sucursales
                                </option>
                              )}
                            </select>
                          </div>

                          <div className="form-group">
                            <label className="form-label">
                              Image del cliente*
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
                                  Elegir Imagen
                                </label>
                              </div>
                            </div>
                            <div className="add-customer-img">
                              <img
                                src={
                                  !image
                                    ? GetImg(
                                        false,
                                        'http://localhost:3001/upload/user'
                                      )
                                    : image
                                }
                                alt="Cliente Frifolly"
                              />
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Latitud*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese la latitud de la direccion"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Longitud*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese la longitud de la direccion"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Dirección*
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Ingrese la direccion"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Referencia de la direccion*
                            </label>
                            <div className="card card-editor">
                              <div className="content-editor">
                                <textarea
                                  className="text-control"
                                  placeholder="Referencia de la dirección"
                                ></textarea>
                              </div>
                            </div>
                          </div>
                          <button
                            className="save-btn hover-btn"
                            type="submit"
                          >
                            Registrar nuevo usuario
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

export default nuevoUsuario
