import Head from 'next/head'
import TopNavbar from '../components/Navbar'
import SideNav from '../components/Navbar/SideNav'
import Footer from '../components/Footer'
import UserContext from '../components/UserContext'
import { useContext, useState } from 'react'
import Link from 'next/link'
import Notifications, { notify } from 'react-notify-toast'
import FormData from 'form-data'
export default function Perfil() {
  const urlGetImg = 'http://localhost:3001/upload'
  const { user, token, signOut, setUser } = useContext(UserContext)
  const [image, setImage] = useState(null)
  const [imageUpload, setImageUpload] = useState(null)
  const uploadFile = (e) => {
    setImage(URL.createObjectURL(e.target.files[0]))
    setImageUpload(e.target.files[0])
  }
  const handlerSubmit = () => {
    let formData = new FormData()
    event.preventDefault()
    const target = event.target
    if (imageUpload) {
      formData.append('imagen', imageUpload)
      fetch(`http://localhost:3001/upload/user/${user._id}`, {
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
            fetch(`http://localhost:3001/user/${user._id}`, {
              method: 'PATCH',
              body: JSON.stringify({
                nombre_comp: target[0].value,
                phone: target[2].value,
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
                  setUser(response.body)
                  notify.show(
                    'Cambios guardados con Exito! ',
                    'success',
                    2000
                  )
                }
              })
              .catch((e) =>
                notify.show('No se pudo guardar los cambios', 'error')
              )
          }
        })
        .catch((error) => {
          notify.show('No se pudo subir las imagenes', 'error')
        })
    } else {
      fetch(`http://localhost:3001/user/${user._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          nombre_comp: target[0].value,
          phone: target[2].value,
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
            setUser(response.body)
            notify.show('Cambios guardados con Exito! ', 'success', 2000)
          }
        })
        .catch((e) =>
          notify.show('No se pudo guardar los cambios', 'error')
        )
    }
  }
  function obtenerImg(user) {
    let imgEx = false
    if (user.img) {
      imgEx = user.img.split('.')[1]
      if (imgEx) {
        if (
          imgEx === 'png' ||
          imgEx === 'jpg' ||
          imgEx === 'gif' ||
          imgEx === 'jpeg'
        ) {
          return `${urlGetImg}/user/${user.img}`
        } else {
          return user.img
        }
      }
    } else return `${urlGetImg}/user/no-img}`
  }
  return (
    <>
      <Head>
        <title>Create Next App</title>
      </Head>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          {user && token ? (
            <main>
              <Notifications options={{ zIndex: 9999, top: '56px' }} />
              <div className="container-fluid">
                <h2 className="mt-30 page-title">Editar Perfil</h2>
                <ol className="breadcrumb mb-30">
                  <li className="breadcrumb-item">
                    <Link href="/">
                      <a href="index.html">Tablero</a>
                    </Link>
                  </li>
                  <li className="breadcrumb-item active">Editar Perfil</li>
                </ol>
                <div className="row">
                  <div className="col-lg-4 col-md-5">
                    <div className="card card-static-2 mb-30">
                      <div className="card-body-table">
                        <div className="shopowner-content-left text-center pd-20">
                          <div className="shop_img mb-3">
                            <img
                              src={obtenerImg(user)}
                              alt="Usuario Frifolly"
                            />
                          </div>
                          <div className="shopowner-dt-left">
                            <h4>Frifolly</h4>
                            <span>{user.role}</span>
                          </div>
                          <div className="shopowner-dts">
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Nombre</span>
                              <span className="right-dt">
                                {user.nombre_comp}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">
                                Numero de celular
                              </span>
                              <span className="right-dt">
                                {user.phone || ''}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Email</span>
                              <span className="right-dt">
                                {user.email}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Direccion</span>
                              <span className="right-dt">
                                {user.direccion || ''}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 col-md-7">
                    <div className="card card-static-2 mb-30">
                      <div className="card-title-2">
                        <h4>Editar Perfil</h4>
                      </div>
                      <div className="card-body-table">
                        <div className="news-content-right pd-20">
                          <form onSubmit={handlerSubmit}>
                            <div className="row">
                              <div className="col-lg-6">
                                <div className="form-group mb-3">
                                  <label className="form-label">
                                    Nombre Completo*
                                  </label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    defaultValue={user.nombre_comp}
                                    required
                                    placeholder="Ingrese su nombre Completo"
                                  />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="form-group mb-3">
                                  <label className="form-label">
                                    Email*
                                  </label>
                                  <input
                                    type="email"
                                    className="form-control"
                                    defaultValue={user.email}
                                    required
                                    disabled={true}
                                    placeholder="Ingrese su correo"
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
                                    defaultValue={user.phone || ''}
                                    placeholder="Ingrese su numero telefonico"
                                  />
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group mb-3">
                                  <label className="form-label">
                                    Estado*
                                  </label>
                                  <select
                                    className="form-control"
                                    defaultValue={0}
                                  >
                                    <option value="0">
                                      {user.status ? 'Activo' : 'Inactivo'}
                                    </option>
                                  </select>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group mb-3">
                                  <label className="form-label">
                                    Imagen de Perfil*
                                  </label>
                                  <div className="input-group">
                                    <div className="custom-file">
                                      <input
                                        type="file"
                                        className="custom-file-input"
                                        id="profile-img"
                                        aria-describedby="inputGroupFileAddon04"
                                        onChange={uploadFile}
                                      />
                                      <label
                                        className="custom-file-label"
                                        htmlFor="profile-img"
                                      >
                                        Cambiar imagen
                                      </label>
                                    </div>
                                  </div>
                                  <div className="add-cate-img-1">
                                    <img
                                      src={
                                        !image ? obtenerImg(user) : image
                                      }
                                      alt="Usuario Frifolly"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6">
                                <div className="form-group mb-3">
                                  <label className="form-label">
                                    Direccion*
                                  </label>
                                  <textarea
                                    disabled={true}
                                    className="text-control"
                                    placeholder="Direcciones (este campo no es editable.)"
                                    defaultValue={user.direccion || ''}
                                  ></textarea>
                                </div>
                              </div>
                              <div className="col-lg-12">
                                <button
                                  className="save-btn hover-btn"
                                  type="submit"
                                >
                                  Guardar Cambios
                                </button>
                              </div>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          ) : (
            'No autorizado'
          )}
          <Footer />
        </div>
      </div>
    </>
  )
}
