import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Notifications, { notify } from 'react-notify-toast'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { PostUrl } from '../../components/PostUrl'
import { useState, useContext, useEffect } from 'react'
import UserContext from '../../components/UserContext'
import GetImg from '../../components/GetImg'
import Link from 'next/link'
import { useRouter } from 'next/router'
function EditOffer() {
  const { signOut } = useContext(UserContext)
  const [selectedOption, setSelectedOption] = useState(null)
  const [image, setImage] = useState(null)
  const [oferta, setOferta] = useState(null)
  const [productos, setProductos] = useState(null)
  const [token, setToken] = useState(false)
  const [imageUpload, setImageUpload] = useState(null)
  const options = []
  const defaultValue = []
  const router = useRouter()

  useEffect(() => {
    const tokenLocal = localStorage.getItem('frifolly-token')
    if (!tokenLocal) {
      signOut()
    }
    setToken(tokenLocal)
    if (!oferta && router && router.query && router.query.id) {
      const { id } = router.query
      Promise.all([
        fetch(`http://localhost:3001/offers/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
        fetch('http://localhost:3001/productos/all'),
      ])
        .then((data) => {
          if (data.error) {
            alert('Error el en servidor')
          } else {
            data[0].json().then((data) => {
              console.log(data.body.img)
              setOferta(data.body)
            })
            data[1].json().then((data) => setProductos(data.body))
          }
        })
        .catch((error) => {
          console.log('EL ERROROROROR', error)
          alert('Error en el servidor')
        })
    }
  }, [router])
  if (productos && oferta) {
    productos.map((data) =>
      options.push({ value: data._id, label: data.name })
    )
    oferta.producto.map((data) =>
      defaultValue.push({ value: data._id, label: data.name })
    )
  }
  const handlerSubmit = () => {
    event.preventDefault()
    let target = event.target
    let formData = new FormData()
    const product = []
    selectedOption
      ? selectedOption.map((d) => product.push(d.value))
      : defaultValue.map((d) => product.push(d.value))
    if (!image) {
      formData.append('imagen', imageUpload)
      fetch(`http://localhost:3001/offers/${oferta._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          titulo: target[0].value,
          descuento: target[1].value,
          producto: product,
          status: target[3].value === '0' ? true : false,
          description: target[5].value,
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
            console.log(response)
            notify.show('Error al editar la Oferta', 'error', 1000)
          } else
            notify.show('Oferta modificado con Exito! ', 'success', 1500)
        })
        .catch((error) => {
          notify.show('Error en el Servidor', 'error')
        })
    } else {
      formData.append('imagen', imageUpload)
      fetch(`http://localhost:3001/upload/oferta/${oferta._id}`, {
        method: 'PUT',
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.error) {
            notify.show(response.body, 'error', 2000)
          } else {
            fetch(`http://localhost:3001/offers/${oferta._id}`, {
              method: 'PATCH',
              body: JSON.stringify({
                titulo: target[0].value,
                descuento: target[1].value,
                producto: product,
                status: target[3].value === '0' ? true : false,
                description: target[5].value,
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
                  console.log(response)
                  notify.show('Error al editar la oferta', 'error', 1000)
                } else
                  notify.show(
                    'Oferta modificado con Exito! ',
                    'success',
                    1500
                  )
              })
              .catch((error) => {
                notify.show('Error en el Servidor', 'error')
              })
          }
        })
        .catch((error) => {
          console.log(error)
          notify.show('No se pudo subir la imagen', 'error')
        })
    }
  }
  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption)
  }
  function uploadFile(e) {
    setImage(URL.createObjectURL(e.target.files[0]))
    setImageUpload(e.target.files[0])
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
              <h2 className="mt-30 page-title">Ofertas</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/ofertas">
                    <a>Ofertas</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Agregar Ofertas</li>
              </ol>
              {oferta ? (
                <div className="row">
                  <div className="col-lg-6 col-md-6">
                    <div className="card card-static-2 mb-30">
                      <div className="card-title-2">
                        <h4>Agregar nueva Oferta</h4>
                      </div>
                      <div className="card-body-table">
                        <form onSubmit={handlerSubmit}>
                          <div className="news-content-right pd-20">
                            <div className="form-group">
                              <label className="form-label">Título*</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Título de la oferta"
                                defaultValue={oferta.titulo}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Descuento*
                              </label>
                              <input
                                type="number"
                                className="form-control"
                                placeholder="0%"
                                defaultValue={oferta.descuento}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Agregar Productos*
                              </label>
                              <Select
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                                placeholder={'Seleccione los productos'}
                                options={options}
                                isMulti
                                className={{ zIndex: '3' }}
                                onChange={handleChange}
                                value={
                                  selectedOption
                                    ? selectedOption
                                    : defaultValue
                                }
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Estado*</label>
                              <select
                                id="status"
                                name="status"
                                className="form-control"
                                defaultValue={oferta.status ? '0' : '1'}
                              >
                                <option value="0">Activo</option>
                                <option value="1">Inactivo</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Imagen de la Oferta*
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
                              <div className="offer-img mt-3">
                                <img
                                  src={
                                    image
                                      ? image
                                      : `http://localhost:3001/upload/oferta/${oferta.img}`
                                  }
                                  alt="Oferta"
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Descripcion*
                              </label>
                              <div className="card card-editor">
                                <div className="content-editor">
                                  <textarea
                                    className="text-control"
                                    placeholder="Ingrese la Descripcion"
                                    defaultValue={oferta.description}
                                  ></textarea>
                                </div>
                              </div>
                            </div>
                            <button
                              className="save-btn hover-btn"
                              type="submit"
                            >
                              Guardar Oferta
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
export default EditOffer
