import Head from 'next/head'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { useState } from 'react'
import moment from 'moment'
import Notifications, { notify } from 'react-notify-toast'
import axios from 'axios'
import FormData from 'form-data'
const ProductoNuevo = ({ categorias }) => {
  if (categorias.error === true) {
    categorias.body = []
  }
  const [butt, setButt] = useState(false)
  const [images, setImages] = useState([])
  const [im, setIm] = useState([])
  var fileObj = []
  var fileArray = []
  const handlerSubmit = () => {
    let target = event.target
    event.preventDefault()

    let formData = new FormData()

    // =========================        ======================
    // axios(
    //   'http://localhost:3001/upload/producto/5f334d02a48bc91da819f725s',
    //   {
    //     method: 'PUT',
    //     formData,
    //     'content-type': 'multipart/form-data',
    //   }
    // )
    //   .then((response) => console.log('Success:', response))
    //   .catch((error) => console.error('Error:', error))

    if (target[1].value === '0') {
      notify.show('Por favor seleccione una Categoria', 'warning', 2000)
    } else {
      if (images.length < 0) {
        notify.show(
          'Por favor seleccione al menos una imagen',
          'warning',
          2000
        )
      } else {
        setButt(true)
        fetch('http://localhost:3001/productos', {
          method: 'POST',
          body: JSON.stringify({
            name: target[0].value,
            detail: target[6].value,
            stock: target[2].value,
            precioCompra: target[3].value,
            precioVenta: target[4].value,
            category: target[1].value,
            vence: target[5].value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((res) => res.json())
          .then((response) => {
            if (response.error) {
              notify.show(response.body, 'error', 2000)
              setButt(false)
            } else {
              for (const file of im) {
                formData.append('imagen', file)
              }
              fetch(
                `http://localhost:3001/upload/producto/${response.body._id}`,
                {
                  method: 'PUT',
                  body: formData,
                }
              )
                .then((response) => response.json())
                .then((response) => {
                  target[0].value = ''
                  target[6].value = ''
                  target[2].value = ''
                  target[3].value = ''
                  target[4].value = ''
                  target[1].value = '0'
                  setImages([])
                  notify.show(
                    'Producto agregado con Exito! ',
                    'success',
                    2000
                  )
                  setButt(false)
                })
                .catch((error) => {
                  notify.show('No se pudo subir las imagenes', 'error')
                  setButt(false)
                })
            }
          })
          .catch((error) => {
            notify.show('Error en el Servidor', 'error')
            setButt(false)
          })
      }
    }
  }
  const uploadMultipleFile = (e) => {
    fileObj.push(e.target.files)
    setIm(e.target.files)
    if (fileObj[0].length < 4) {
      for (let i = 0; i < fileObj[0].length; i++) {
        fileArray.push(URL.createObjectURL(fileObj[0][i]))
      }
      setImages(fileArray)
    } else {
      notify.show('Solo puede seleccionar 4 imagenes', 'warning', 2000)
      for (let i = 0; i < 4; i++) {
        fileArray.push(URL.createObjectURL(fileObj[0][i]))
      }
      setImages(fileArray)
    }
  }
  return (
    <>
      <Head></Head>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />

            <div className="container-fluid">
              <h2 className="mt-30 page-title">Producto</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/productos">
                    <a>Productos</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">
                  Agregar producto
                </li>
              </ol>

              <div className="row">
                <div className="col-lg-6 col-md-6">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Agregar Nuevo Producto</h4>
                    </div>
                    <div className="card-body-table">
                      <form onSubmit={handlerSubmit}>
                        <div className="news-content-right pd-20">
                          <div className="form-group">
                            <label className="form-label">Nombre*</label>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Nombre del Producto"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">
                              Categoria*
                            </label>
                            <select
                              id="categtory"
                              name="categtory"
                              className="form-control"
                              defaultValue={0}
                            >
                              <option value="0">
                                --Seleccionar Categoria--
                              </option>
                              {categorias.body.map((cate) => (
                                <option value={cate._id} key={cate._id}>
                                  {cate.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Stock*</label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Cantidad disponible"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Precio Compra*
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Bs 0"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Precio Venta*
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Bs 0"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Fecha de Vencimineto*
                            </label>
                            <input
                              type="date"
                              className="form-control"
                              placeholder="Bs 0"
                              defaultValue={moment().format('YYYY-MM-DD')}
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">
                              Descripción*
                            </label>
                            <textarea
                              type="textarea"
                              className="form-control"
                              required
                            />
                            <div className="card card-editor">
                              <div className="content-editor">
                                <div id="edit"></div>
                              </div>
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Images*</label>
                            <div className="input-group">
                              <div className="custom-file">
                                <input
                                  type="file"
                                  className="custom-file-input"
                                  id="inputGroupFile05"
                                  aria-describedby="inputGroupFileAddon05"
                                  required
                                  multiple
                                  onChange={uploadMultipleFile}
                                  accept="image/x-png,image/gif,image/jpeg"
                                />
                                <label
                                  className="custom-file-label"
                                  htmlFor="inputGroupFile05"
                                >
                                  Seleccione Images
                                </label>
                              </div>
                            </div>
                            <ul className="add-produc-imgs">
                              {images.map((url) => (
                                <li key={url}>
                                  <div
                                    className="add-cate-img-1"
                                    htmlFor="inputGroupFile05"
                                  >
                                    <img
                                      src={url}
                                      alt="Seleecione una imagen de producto frifolly"
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <button
                            disabled={butt}
                            className="save-btn hover-btn"
                            type="submit"
                          >
                            Agregar Nuevo Producto
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
    const res = await fetch('http://localhost:3001/categoria')
    const categorias = await res.json()
    return {
      props: {
        categorias,
      },
      revalidate: 1,
    }
  } catch (err) {
    const categorias = { error: true }
    return {
      props: {
        categorias,
      },
      revalidate: 1,
    }
  }
}

export default ProductoNuevo
