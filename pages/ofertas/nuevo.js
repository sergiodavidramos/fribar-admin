import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Notifications, { notify } from 'react-notify-toast'
import Select from 'react-select'
import makeAnimated from 'react-select/animated'
import { PostUrl } from '../../components/PostUrl'
import { useState, useContext } from 'react'
import UserContext from '../../components/UserContext'
import Link from 'next/link'
const OfertaNueva = ({ productos }) => {
  const { signOut, token } = useContext(UserContext)
  const [selectedOption, setSelectedOption] = useState([])
  const [image, setImage] = useState(null)
  const [imageUpload, setImageUpload] = useState(null)
  const options = []
  productos.error
    ? ''
    : productos.body.map((data) =>
        options.push({ value: data._id, label: data.name })
      )
  const handlerSubmit = async () => {
    let target = event.target

    event.preventDefault()
    let formData = new FormData()
    if (selectedOption.length <= 0) {
      notify.show('Por favor seleccione un Producto', 'warning', 2000)
    } else {
      if (image.length < 0) {
        notify.show(
          'Por favor seleccione al menos una imagen',
          'warning',
          2000
        )
      } else {
        const product = []
        selectedOption.map((d) => product.push(d.value))
        const data = {
          titulo: target[0].value,
          descuento: target[1].value,
          producto: product,
          status: target[3].value === '0' ? true : false,
          description: target[5].value,
        }
        const newOffer = await PostUrl(
          'http://localhost:3001/offers',
          data,
          signOut,
          token
        )
        const res = await newOffer.json()
        if (res.error) {
          notify.show('Error en el servidor', 'error', 2000)
        } else {
          formData.append('imagen', imageUpload)
          fetch(`http://localhost:3001/upload/oferta/${res.body._id}`, {
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
                target[0].value = ''
                target[0].value = ''
                target[1].value = ''
                setSelectedOption([])
                target[3].value = ''
                target[5].value = ''
                setImage([])
                notify.show(
                  'Producto agregado con Exito! ',
                  'success',
                  2000
                )
              }
            })
            .catch((error) => {
              console.log(error)
              notify.show('No se pudo subir las imagenes', 'error')
            })
        }
      }
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
                              value={selectedOption}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Estado*</label>
                            <select
                              id="status"
                              name="status"
                              className="form-control"
                              defaultValue="0"
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
                                  required
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
                              {image ? (
                                <img src={image} alt="Oferta" />
                              ) : (
                                ''
                              )}
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
                                  required
                                ></textarea>
                              </div>
                            </div>
                          </div>
                          <button
                            className="save-btn hover-btn"
                            type="submit"
                          >
                            Agregar nueva Oferta
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
export async function getStaticProps() {
  try {
    const res = await fetch('http://localhost:3001/productos/all')
    const productos = await res.json()
    return {
      props: {
        productos,
      },
      revalidate: 1,
    }
  } catch (err) {
    const productos = { error: true }
    return {
      props: {
        productos,
      },
      revalidate: 1,
    }
  }
}

export default OfertaNueva
