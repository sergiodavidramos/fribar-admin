import TopNavbar from '../../../components/Navbar'
import SideNav from '../../../components/Navbar/SideNav'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useContext, useState } from 'react'
import UserContext from '../../../components/UserContext'
import GetImg from '../../../components/GetImg'
import FormData from 'form-data'
import Notifications, { notify } from 'react-notify-toast'
const editClient = () => {
  const { signOut } = useContext(UserContext)
  const [client, setCliente] = useState(null)
  const [token, setToken] = useState(false)
  const router = useRouter()
  const [image, setImage] = useState(null)
  const [imageUpload, setImageUpload] = useState(null)
  useEffect(() => {
    const tokenLocal = localStorage.getItem('frifolly-token')
    if (!tokenLocal) {
      signOut()
    }
    setToken(tokenLocal)
    if (!client && router && router.query && router.query.id) {
      const { id } = router.query
      fetch(`http://localhost:3001/user?id=${id}`, {
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
            alert('Error el en servidor')
          } else {
            setCliente(data.body.users[0])
          }
        })
        .catch((error) => alert('Error en el servidor'))
    }
  }, [router])
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
      fetch(`http://localhost:3001/upload/user/${client._id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
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
            fetch(`http://localhost:3001/user/${client._id}`, {
              method: 'PATCH',
              body: JSON.stringify({
                nombre_comp: target[0].value,
                password: target[1].value,
                email: target[2].value,
                phone: target[3].value,
                role: target[4].value,
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
                  setCliente(response.body)
                  notify.show(
                    'Cambios guardados con Exito! ',
                    'success',
                    2000
                  )
                }
              })
              .catch((e) => {
                notify.show('No se pudo guardar los cambios', 'error')
              })
          }
        })
        .catch((error) => {
          notify.show('No se pudo subir las imagenes', 'error')
        })
    } else {
      fetch(`http://localhost:3001/user/${client._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          nombre_comp: target[0].value,
          password: target[1].value,
          email: target[2].value,
          phone: target[3].value,
          role: target[4].value,
          status: target[5].value === '0' ? true : false,
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
            notify.show(response.body.message, 'error', 2000)
          } else {
            setCliente(response.body)
            notify.show('Cambios guardados con Exito! ', 'success', 2000)
          }
        })
        .catch((e) => {
          notify.show('No se pudo guardar los cambios', 'error')
        })
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
              <h2 className="mt-30 page-title">Clientes</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  <Link href="/clientes">
                    <a>Clientes</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Editar Cliente</li>
              </ol>
              {client ? (
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="card card-static-2 mb-30">
                      <div className="card-title-2">
                        <h4>Editar Cliente</h4>
                      </div>
                      <div className="card-body-table">
                        <form onSubmit={handlerSubmit}>
                          <div className="news-content-right pd-20">
                            <div className="form-group">
                              <label className="form-label">Nombre*</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={client.nombre_comp}
                                placeholder="Ingrese su nombre comleto"
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
                                defaultValue="*********"
                                placeholder="Ingrese su nombre Contraseña"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Email*</label>
                              <input
                                type="email"
                                className="form-control"
                                defaultValue={client.email}
                                placeholder="Ingrese su correo"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Teléfono*
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={client.phone}
                                placeholder="Ingrese su numero Teléfonico"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Rol*</label>
                              <input
                                type="text"
                                className="form-control"
                                defaultValue={client.role}
                                placeholder="Ingrese su cargo"
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Estado*</label>
                              <select
                                className="form-control"
                                defaultValue={client.status ? '0' : '1'}
                              >
                                <option value="0">Activo</option>
                                <option value="1">Inactivo</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Customer Image*
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
                                    Choose Image
                                  </label>
                                </div>
                              </div>
                              <div className="add-customer-img">
                                <img
                                  src={
                                    !image
                                      ? GetImg(
                                          client.img,
                                          'http://localhost:3001/upload/user'
                                        )
                                      : image
                                  }
                                  alt="Cliente Frifolly"
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Direccion*
                              </label>
                              <div className="card card-editor">
                                <div className="content-editor">
                                  <textarea
                                    className="text-control"
                                    defaultValue={client.direccion}
                                    placeholder="Direcciones (este campo no es editable.)"
                                    disabled={true}
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            <button
                              className="save-btn hover-btn"
                              type="submit"
                            >
                              Save Changes
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

export default editClient
