import Footer from '../../components/Footer'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Notifications, { notify } from 'react-notify-toast'
import Link from 'next/link'
import { useEffect, useContext, useState, useRef } from 'react'
import UserContext from '../../components/UserContext'
import { useRouter } from 'next/router'
import { API_URL } from '../../components/Config'

import mapboxgl from 'mapbox-gl'
import { mapboxglAccessToken } from '../../components/Config'
const ciudadNueva = () => {
  const { signOut } = useContext(UserContext)
  const [token, setToken] = useState(false)
  const [ciudad, setCiudad] = useState(null)
  const router = useRouter()

  const mapContainer = useRef(null)
  const longitudRegistro = useRef(null)
  const latitudRegistro = useRef(null)

  mapboxgl.accessToken = mapboxglAccessToken
  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    const user = localStorage.getItem('fribar-user')
    if (!tokenLocal && !user) {
      signOut()
    }
    if (JSON.parse(user).role !== 'GERENTE-ROLE') signOut()
    if (!ciudad && router && router.query.id) {
      const { id } = router.query
      fetch(`${API_URL}/ciudad/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${tokenLocal}`,
          'Content-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 401) signOut()
          return res.json()
        })
        .then((data) => {
          if (data.error)
            notify.show('Error en el servidor', 'error', 2000)
          else {
            setCiudad(data.body)
            setToken(tokenLocal)
          }
        })
        .catch((err) => {
          notify.show('Error en el servidor', 'error', 2000)
        })
    }
  }, [router])

  const handlerEditCiudad = () => {
    let target = event.target
    event.preventDefault()
    if ((!target[0].value, !target[2].value, !target[3].value))
      notify.show(
        'Por favor todos los campos deben ser llenados',
        'warning',
        2000
      )
    else {
      fetch(`${API_URL}/ciudad/${ciudad._id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          nombre: target[0].value,
          status: target[1].value,
          lat: target[2].value,
          lon: target[3].value,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          'COntent-Type': 'application/json',
        },
      })
        .then((res) => {
          if (res.status === 401) signOut()
          return res.json()
        })
        .then((res) => {
          if (res.error) notify.show(res.body, 'error', 2000)
          else notify.show('Ciudad editado con Exito! ', 'success', 2000)
        })
        .catch((error) => {
          console.log(error)
          notify.show('Error en el Servidor', 'error')
        })
    }
  }
  function resizeMap() {
    if (!'geolocation' in navigator) {
      return notify.show(
        'Tu navegador no soporta el acceso a la ubicación. Intenta con otro',
        'warning',
        5000
      )
    }
    const onUbicacionConcedida = (ubicacion) => {
      var map = new mapboxgl.Map({
        container: mapContainer.current,
        projection: 'globe',
        style: 'mapbox://styles/mapbox/standard-beta',
        center: [
          ciudad.lon ? ciudad.lon : ubicacion.coords.longitude,
          ciudad.lat ? ciudad.lat : ubicacion.coords.latitude,
        ],
        zoom: 15.8,
      })
      map.on('load', function () {
        map.resize()
        const marker = new mapboxgl.Marker({
          draggable: true,
        })
          .setLngLat([
            ciudad.lon ? ciudad.lon : ubicacion.coords.longitude,
            ciudad.lat ? ciudad.lat : ubicacion.coords.latitude,
          ])
          .addTo(map)
        obtenerUbicacionArrastrar(marker)
      })
    }
    const onErrorDeUbicacion = (err) => {
      console.log('Error obteniendo ubicación: ', err)
      return notify.show('Error al obtener la ubicacion', 'error', 5000)
    }
    const opcionesDeSolicitud = {
      enableHighAccuracy: true, // Alta precisión
      maximumAge: 0, // No queremos caché
      timeout: 5000, // Esperar solo 5 segundos
    }
    navigator.geolocation.getCurrentPosition(
      onUbicacionConcedida,
      onErrorDeUbicacion,
      opcionesDeSolicitud
    )
  }
  const obtenerUbicacionArrastrar = (marker) => {
    marker.on('drag', () => {
      const lnglat = marker.getLngLat()
      longitudRegistro.current.value = lnglat.lng
      latitudRegistro.current.value = lnglat.lat
    })
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
              <h2 className="mt-30 page-title">Ubicaciones</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/ciudades">
                    <a>Ciudades</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Editar ciudad</li>
              </ol>
              {ciudad ? (
                <div className="row">
                  <div className="col-lg-5 col-md-6">
                    <div className="card card-static-2 mb-30">
                      <div className="card-title-2">
                        <h4>Agregar nueva ciudad</h4>
                      </div>
                      <div className="card-body-table">
                        <form onSubmit={handlerEditCiudad}>
                          <div className="news-content-right pd-20">
                            <div className="form-group">
                              <label className="form-label">Nombre*</label>
                              <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre de la ciudad"
                                required
                                defaultValue={ciudad.nombre}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">Estado*</label>
                              <select
                                id="status"
                                name="status"
                                className="form-control"
                                defaultValue={ciudad.status}
                              >
                                <option value={true}>Activo</option>
                                <option value={false}>Inactivo</option>
                              </select>
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Latitud*
                              </label>
                              <input
                                ref={latitudRegistro}
                                className="form-control"
                                placeholder="Latitud de la ubiciación"
                                defaultValue={ciudad.lat ? ciudad.lat : ''}
                              />
                            </div>
                            <div className="form-group">
                              <label className="form-label">
                                Longitud*
                              </label>
                              <input
                                ref={longitudRegistro}
                                className="form-control"
                                placeholder="Longitud de la ubicación"
                                defaultValue={ciudad.lon ? ciudad.lon : ''}
                              />
                            </div>
                            <div className="shopowner-dt-list">
                              <div className="col-lg-12">
                                <a
                                  href="add_shop.html"
                                  className="add-btn hover-btn"
                                  data-toggle="modal"
                                  data-target="#mapa_model"
                                  onClick={resizeMap}
                                >
                                  Marcar direccion en el mapa
                                </a>
                              </div>
                            </div>

                            <button className="save-btn hover-btn">
                              Modificar ciudad
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
      {/* Modal del papa con su CSS */}
      <div
        id="mapa_model"
        className="header-cate-model main-gambo-model modal fade"
        tabIndex="-1"
        role="dialog"
        aria-modal="false"
      >
        <div className="modal-dialog category-area" role="document">
          <div className="category-area-inner">
            <div className="modal-header" style={{ alignItems: 'end' }}>
              <center>
                <p className="h7">
                  Arrastre el marcador en la ubicacion exacta y cierre la
                  ventana
                </p>
              </center>
              <button
                type="button"
                className="btn btn-close close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div
              className="category-model-content modal-content"
              style={{ width: 'auto' }}
            >
              <div ref={mapContainer} className="map-container"></div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .h7 {
            color: #ffffff;
            font-size: 16px;
            margin: 0;
          }
          .btn-confirmation {
            text-align: center;
            padding: 10px;
          }
          .btn-margin {
            margin: 10px;
            padding: 10px 40px;
          }
          .main-gambo-model {
            background-image: -webkit-linear-gradient(
              left,
              rgba(230, 92, 91, 0.9),
              rgba(245, 93, 44, 0.9)
            );
            background-image: linear-gradient(
              to right,
              rgba(230, 92, 91, 0.9),
              rgba(245, 93, 44, 0.9)
            );
          }

          .category-area-inner .modal-header {
            border-bottom: 0;
          }

          .category-area-inner .btn-close {
            color: #fff !important;
            opacity: 1 !important;
            padding: 30px 0 15px !important;
            font-size: 30px !important;
            cursor: pointer !important;
          }

          .category-model-content {
            background: #fff;
            border: 0 !important;
            border-radius: 0 !important;
          }

          .catey__icon {
            display: none;
          }

          .search__icon {
            display: none;
          }

          .sub-header-icons-list {
            display: inline-block;
            font-size: 20px;
          }

          .cate__btn {
            font-size: 20px;
            color: #8f91ac !important;
            padding: 20px 20px 19px;
          }

          .cate__btn:hover {
            color: #f55d2c !important;
          }

          .search__btn {
            font-size: 20px;
            color: #fff !important;
            padding: 20px 20px 21px;
            background: #2b2f4c;
          }

          /* --- Category Mode --- */

          .cate-header {
            background: #2b2f4c;
            color: #fff;
            padding: 15px 20px;
          }

          .cate-header h4 {
            font-size: 18px;
            font-weight: 500;
            line-height: 24px;
          }

          .category-by-cat {
            width: 100%;
            display: inline-table;
          }

          .category-by-cat li {
            width: 33.333%;
            vertical-align: middle;
            display: inline-block;
            list-style: none;
            float: left;
          }

          .single-cat-item {
            text-align: center;
            padding: 20px 10px;
            display: block;
          }

          .single-cat-item:hover {
            background: #f9f9f9;
          }

          .single-cat-item .text {
            font-size: 14px;
            font-weight: 500;
            color: #2b2f4c;
          }

          .single-cat-item .icon {
            width: 100%;
            text-align: center;
            margin-bottom: 15px;
          }

          .single-cat-item .icon img {
            width: 50px;
          }

          .morecate-btn {
            display: block;
            text-align: center;
            border-top: 1px solid #efefef;
            padding: 20px;
            font-size: 16px;
            font-weight: 500;
            color: #2b2f4c;
          }

          .morecate-btn i {
            margin-right: 5px;
          }

          .morecate-btn:hover {
            color: #f55d2c !important;
          }

          .search-ground-area {
            max-width: 400px !important;
          }

          .search-header {
            position: relative;
            width: 100%;
            border-bottom: 1px solid #efefef;
          }

          .search-header input {
            width: 100%;
            border: 0;
            padding: 20px;
            position: relative;
          }

          .search-header button {
            position: absolute;
            right: 0px;
            background: transparent;
            border: 0;
            padding: 17px;
            font-size: 20px;
          }

          .search-by-cat {
            width: 100%;
            height: 321px;
            overflow: hidden scroll;
          }

          .search-by-cat .single-cat {
            -ms-filter: 'progid:DXImageTransform.Microsoft.Alpha(Opacity=85)';
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -ms-flex-wrap: wrap;
            flex-wrap: wrap;
            margin-bottom: 0;
            -webkit-transition: all 0.25s;
            transition: all 0.25s;
            padding: 15px 20px;
          }

          .search-by-cat .single-cat .icon {
            background-color: #f9f9f9;
            border-radius: 5%;
            color: #fff;
            font-size: 22px;
            height: 50px;
            line-height: 47px;
            text-align: center;
            width: 50px;
          }

          .search-by-cat .single-cat .icon img {
            width: 30px;
          }

          .search-by-cat .single-cat .text {
            color: #2b2f4c;
            font-weight: 400;
            padding-left: 20px;
            font-size: 16px;
          }

          .search-by-cat .single-cat:hover .text {
            color: #f55d2c;
          }
          .map-container {
            height: 700px;
          }
        `}</style>
      </div>

      {/* ----------Modal del papa con su CSS---------- */}
    </>
  )
}

export default ciudadNueva
