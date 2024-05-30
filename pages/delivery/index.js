import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import Notifications, { notify } from 'react-notify-toast'
import { useState, useEffect, useContext, useRef } from 'react'
import UserContext from '../../components/UserContext'
import mapboxgl from 'mapbox-gl'
import { API_URL, mapboxglAccessToken } from '../../components/Config'
import io from 'socket.io-client'
import GetImg from '../../components/GetImg'
var map
var markerDelivery
let socket
const Delivery = () => {
  let fechaHoy = new Date()

  const { signOut, token } = useContext(UserContext)

  const [pedidos, setPedidos] = useState([])
  const [clickPedido, setClickPedido] = useState(false)
  const [marcadores, setMarcadores] = useState([])
  const [editarEstadoPedido, setEditarEstadoPedido] = useState(false)
  const [mapaCargado, setMapaCargado] = useState(false)
  const [ubicionDelivery, setUbicacionDelivery] = useState(false)

  const [ubicacionDeliveryTiempoReal, setUbicacionDeliveryTiempoReal] =
    useState([])

  const [inputNumeroCelularCliente, setInputNumeroCelularCliente] =
    useState(false)
  const [textareaDetalleDireccion, setTextareaDetalleDireccion] =
    useState(false)

  const mapContainer = useRef(null)
  const seleccionEstado = useRef(null)

  mapboxgl.accessToken = mapboxglAccessToken

  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    const user = localStorage.getItem('fribar-user')
    if (!tokenLocal && !user) {
      signOut()
    }
    if (
      JSON.parse(user).role === 'GERENTE-ROLE' ||
      JSON.parse(user).role === 'ADMIN-ROLE' ||
      JSON.parse(user).role === 'DELIVERY-ROLE'
    ) {
      getPedidosListos(tokenLocal)
    } else signOut()
    resizeMap()
    escucharPedidos(tokenLocal)
    return () => socket.disconnect()
  }, [])
  function resizeMap() {
    try {
      if (!'geolocation' in navigator) {
        return notify.show(
          'Tu navegador no soporta el acceso a la ubicación. Intenta con otro',
          'warning',
          5000
        )
      }
      const onUbicacionConcedida = (ubicacion) => {
        const coordenadas = ubicacion.coords
        let { latitude, longitude } = coordenadas
        // var geolocate = new mapboxgl.GeolocateControl()
        map = new mapboxgl.Map({
          container: mapContainer.current,
          projection: 'globe',
          style: 'mapbox://styles/mapbox/standard-beta',
          center: [longitude, latitude],
          zoom: 15,
        })

        map.on('load', function () {
          const iconDelivery = document.createElement('div')
          iconDelivery.className = 'markerDelivery'
          map.resize()
          setMapaCargado(true)
          markerDelivery = new mapboxgl.Marker(iconDelivery)
            .setLngLat([longitude, latitude])
            .addTo(map)
          setUbicacionDelivery([longitude, latitude])
          setUbicacionDeliveryTiempoReal([longitude, latitude])
          //   geolocate.on('geolocate', function (e) {
          //     var lon = e.coords.longitude
          //     var lat = e.coords.latitude
          //     marker.setLngLat([lon, lat])
          //   })
        })
        // map.addControl(geolocate)

        map.addControl(new mapboxgl.FullscreenControl())
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
    } catch (err) {
      console.log('Error en el MAP', err)
    }
  }
  function escucharPedidos(token) {
    socket = io(API_URL, { transports: ['websocket'] })
    socket.on(`pedido-delivery`, (pedido) => {
      let existePedido = pedidos.filter(function (p) {
        return p._id == pedido._id
      })
      if (existePedido.length > 0) {
        console.log('TAMAÑO de', existePedido.length)
      } else {
        if (pedidos.length > 0) {
          setPedidos([...pedidos, pedido])
        } else {
          getPedidosListos(token)
        }
      }
    })
  }
  async function getPedidosListos(token) {
    try {
      const fechaInicio = `${fechaHoy.getFullYear()}/${
        fechaHoy.getMonth() + 1
      }/${fechaHoy.getDate() - 1}`
      let fechaFin
      if (fechaHoy.getDate() === 31 || fechaHoy.getDate() === 30) {
        fechaFin = `${fechaHoy.getFullYear()}/${
          fechaHoy.getMonth() + 2
        }/${fechaHoy.getDate()}`
      } else {
        fechaFin = `${fechaHoy.getFullYear()}/${fechaHoy.getMonth() + 1}/${
          fechaHoy.getDate() + 1
        }`
      }
      const data = await fetch(
        `${API_URL}/pedido/filtrar/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&estado=1`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      if (data.status === 401) signOut()
      const pedidosListosHoy = await data.json()
      if (pedidosListosHoy.error) {
        console.log('Error en la API ', pedidosListosHoy)
        notify.show(
          'Error al obtener el pedido de la direccion API',
          'error'
        )
      } else {
        setPedidos(pedidosListosHoy.body)
      }
    } catch (error) {
      notify.show('Error en el proceso para obtener los pedidos', 'error')
      console.log('ERROR al obtenr pedidos listos', error)
    }
  }
  async function handlerCambiarEstadoPedido() {
    try {
      const newP = await fetch(
        `${API_URL}/pedido/${editarEstadoPedido._id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            state: seleccionEstado.current.value,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      const newPedido = await newP.json()
      if (newPedido.error)
        notify.show('Error al cambiar estado', 'error', 500)
      else {
        notify.show('Estado Cambiado', 'success', 500)
      }
    } catch (err) {
      console.error('Error en el Servidor', err)
    }
  }
  async function handlerVerPedidoMapa(index, pedido) {
    setInputNumeroCelularCliente(pedido.cliente.phone)
    setTextareaDetalleDireccion(pedido.direction.referencia)

    setEditarEstadoPedido(pedido)
    for (let m of marcadores) {
      m.remove()
    }
    setClickPedido(index)

    // marcador del cliente
    const iconCliente = document.createElement('div')
    iconCliente.className = 'markerCliente'
    iconCliente.style.backgroundImage = `url(${GetImg(
      pedido.cliente.img,
      API_URL + '/upload/user'
    )})`
    const marker = new mapboxgl.Marker(iconCliente, {
      draggable: false,
      //   color: '#' + Math.floor(Math.random() * 16777215).toString(16),
    })
      .setLngLat([pedido.direction.lon, pedido.direction.lat])
      .addTo(map)
    //   */
    //   Marcador de la Sucursal
    const iconSucursal = document.createElement('div')
    iconSucursal.className = 'markerSucursal'
    const markerSucursal = new mapboxgl.Marker(iconSucursal)
      .setLngLat([
        pedido.idSucursal.direccion.lon,
        pedido.idSucursal.direccion.lat,
      ])
      .addTo(map)
    //   */

    setMarcadores([...marcadores, marker, markerSucursal])
    const corrdenadas = cargarCordenadas([
      ubicionDelivery[0],
      ubicionDelivery[1],
      pedido.direction.lon,
      pedido.direction.lat,
    ])
      .then((indicaciones) => {
        const ruta = indicaciones.geometry.coordinates
        map.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: ruta,
            },
          },
        })
        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layaut: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': 'orange',
            'line-width': 5,
          },
        })
        map.fitBounds(
          [ruta[ruta.length - 1], ubicacionDeliveryTiempoReal],
          {
            padding: 100,
          }
        )
      })
      .catch((error) => {
        console.log('Error al obtener las Indicaciones', error)
      })

    if (!'geolocation' in navigator) {
      return notify.show(
        'Tu navegador no soporta el acceso a la ubicación. Intenta con otro',
        'warning',
        5000
      )
    }
    const onErrorDeUbicacion = (err) => {
      console.log('Error obteniendo ubicación: ', err)
      return notify.show('Poca precicios en la ubicacion', 'warning', 5000)
    }
    const opcionesDeSolicitud = {
      enableHighAccuracy: true, // Alta precisión
      maximumAge: 0, // No queremos caché
      timeout: 5000, // Esperar solo 5 segundos
    }
    const onUbicacionConcedida = (ubicacion) => {
      const coordenadas = ubicacion.coords
      let { latitude, longitude } = coordenadas
      setUbicacionDeliveryTiempoReal([longitude, latitude])
      markerDelivery.setLngLat([longitude, latitude])
      socket.emit('delivery-mover', {
        _id: pedido._id,
        latitud: latitude,
        longitud: longitude,
      })
    }
    navigator.geolocation.watchPosition(
      onUbicacionConcedida,
      onErrorDeUbicacion,
      opcionesDeSolicitud
    )
  }

  async function cargarCordenadas(coordenadas) {
    const url = [
      'https://api.mapbox.com/directions/v5/mapbox/driving/',
      `${coordenadas[0]},${coordenadas[1]};${coordenadas[2]},${coordenadas[3]}`,
      `?alternatives=false&geometries=geojson&steps=true&access_token=${mapboxglAccessToken}`,
    ].join('')
    const res = await fetch(url)
    const ruta = await res.json()
    return ruta.routes[0]
  }
  return (
    <>
      {/* <Model id={id} token={token} notify={notify} ofertas={true} /> */}
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Entrega general</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href={'/'}>
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Entregas</li>
              </ol>
              <div className="row">
                <div className="col-lg-4 col-md-6">
                  <div className="left-side-tabs">
                    <div className="dashboard-left-links">
                      <a
                        className="user-item"
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="fa fa-globe"></i>
                        Mostrar todas las entregas en el mapa
                      </a>
                    </div>
                  </div>
                  <div className="left-side-tabs">
                    <div className="dashboard-left-links">
                      {mapaCargado &&
                        pedidos.length > 0 &&
                        pedidos.map((pedido, index) => (
                          <a
                            key={index}
                            style={{ cursor: 'pointer' }}
                            className={`user-item ${
                              clickPedido === index ? 'active' : ''
                            }`}
                            onClick={() =>
                              handlerVerPedidoMapa(index, pedido)
                            }
                          >
                            <i className="fa fa-map-marker"></i>
                            {pedido.cliente.idPersona.nombre_comp}
                          </a>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="col-lg-8 col-md-6">
                  <div className="card card-static-2 mb-20">
                    <div className="card-title-2">
                      <h4>Ubicación de pedidos</h4>
                      {editarEstadoPedido && (
                        <select
                          id="status"
                          name="status"
                          className="custom-select"
                          defaultValue={
                            editarEstadoPedido
                              ? editarEstadoPedido.state
                              : 0
                          }
                          onChange={handlerCambiarEstadoPedido}
                          ref={seleccionEstado}
                        >
                          <option value={0}>Pediente</option>
                          <option value={1}>Preparando</option>
                          <option value={2}>En camino</option>
                          <option value={3}>Entregado</option>
                          <option value={4}>Cancelado</option>
                        </select>
                      )}
                    </div>
                    <div className="card-body-table">
                      <div className="news-content-right pd-20">
                        <div className="row">
                          <div
                            className="col-lg-12"
                            ref={mapContainer}
                            style={{ height: '700px' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {inputNumeroCelularCliente && (
                    <>
                      <div className="card-title-2">
                        <div className="form-group">
                          <label className="form-label">
                            Numero Telefonico del cliente
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Numero celular"
                            defaultValue={inputNumeroCelularCliente}
                            disabled={true}
                          />{' '}
                        </div>
                        <div style={{ marginLeft: '10px' }}>
                          <a
                            href={`tel:+591 ${inputNumeroCelularCliente}`}
                            className="offer-link"
                          >
                            Llamar:<i className="fas fa-phone"></i>
                          </a>
                          <a
                            target="_blank"
                            style={{ marginLeft: '10px' }}
                            href={`https://api.whatsapp.com/send/?phone=${inputNumeroCelularCliente}`}
                          >
                            Mensaje: <i className="fab fa-whatsapp"></i>
                          </a>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">
                          Numero Telefonico del cliente
                        </label>
                        <textarea
                          defaultValue={textareaDetalleDireccion}
                          className="form-control"
                          placeholder="Detalle de la dirección"
                          disabled={true}
                        />
                      </div>
                    </>
                  )}
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

export default Delivery
