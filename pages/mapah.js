import { useEffect, useRef, useState } from 'react'
import Mapboxgl from 'mapbox-gl'
export default () => {
  const [lng, setLng] = useState(null)
  const [lat, setLat] = useState(null)
  const [zoom, setZoom] = useState(17.8)
  const mapContainer = useRef(null)
  let map = null

  useEffect(() => {
    if (lng === null && lat === null) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLng(position.coords.longitude)
        setLat(position.coords.latitude)
        Mapboxgl.accessToken =
          'pk.eyJ1Ijoic2VyZ2lvZGF2aWRyYW1vcyIsImEiOiJja2NjcnloMzMwN2tjMndtOXM1NTFlMzRkIn0.5LBxHw3qu5t7pLdSjf2_rQ'
        var bounds = [
          [-65.82402567137112, -19.63484996501242], // Southwest coordinates
          [-65.71398066576312, -19.533979898751795], // Northeast coordinates
        ]
        map = new Mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [position.coords.longitude, position.coords.latitude],
          zoom: zoom,
          maxBounds: bounds,
        })
        map.addControl(new Mapboxgl.NavigationControl())
        map.on('load', function () {
          map.setPaintProperty('building', 'fill-color', [
            'interpolate',
            ['exponential', 0.5],
            ['zoom'],
            15,
            '#e2714b',
            22,
            '#eee695',
          ])

          map.setPaintProperty('building', 'fill-opacity', [
            'interpolate',
            ['exponential', 0.5],
            ['zoom'],
            15,
            0,
            22,
            1,
          ])
        })
        var canvas = map.getCanvasContainer()
        var el = document.createElement('div')
        var img1 = document.createElement('img')
        var img2 = document.createElement('img')
        img1.className = 'img_pointer'
        img2.className = 'img_perfil'
        img1.src = '/img/pins.svg'
        img2.src =
          'data:image/jpeg;base64,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'
        el.appendChild(img1)
        el.appendChild(img2)
        //
        var popup = new Mapboxgl.Popup({ offset: 25 }).setText(
          'Por favor llévame hacia la ubucación exacta.'
        )

        var marker = new Mapboxgl.Marker(el, {
          draggable: true,
        })
          .setLngLat([position.coords.longitude, position.coords.latitude])
          .setPopup(popup)
          .addTo(map)
        function onDragEnd() {
          var lngLat = marker.getLngLat()
          setLng(lngLat.lng)
          setLat(lngLat.lat)
          canvas.style.cursor = ''
          getRoute([lngLat.lng, lngLat.lat])
          console.log('longitud', lngLat.lng)
          console.log('latitud', lngLat.lat)
        }
        marker.on('dragend', onDragEnd)
        // initialize the map canvas to interact with later

        var start = [-65.74347936861248, -19.5808788702292]
        function getRoute(end) {
          // make a directions request using cycling profile
          // an arbitrary start will always be the same
          // only the end or destination will change
          var start = [-65.74347936861248, -19.5808788702292]
          var url =
            'https://api.mapbox.com/directions/v5/mapbox/driving/' +
            start[0] +
            ',' +
            start[1] +
            ';' +
            end[0] +
            ',' +
            end[1] +
            '?steps=true&geometries=geojson&access_token=' +
            'pk.eyJ1Ijoic2VyZ2lvZGF2aWRyYW1vcyIsImEiOiJja2NjcnloMzMwN2tjMndtOXM1NTFlMzRkIn0.5LBxHw3qu5t7pLdSjf2_rQ'

          // make an XHR request https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
          var req = new XMLHttpRequest()
          req.open('GET', url, true)
          req.onload = function () {
            var json = JSON.parse(req.response)
            var data = json.routes[0]
            console.log(data.distance)
            console.log(Math.round(data.distance))
            console.log(Math.round(data.distance) / 1000)
            var route = data.geometry.coordinates
            var geojson = {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: route,
              },
            }
            // if the route already exists on the map, reset it using setData
            if (map.getSource('route')) {
              map.getSource('route').setData(geojson)
            } else {
              // otherwise, make a new request
              map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'LineString',
                      coordinates: geojson,
                    },
                  },
                },
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round',
                },
                paint: {
                  'line-color': '#3887be',
                  'line-width': 5,
                  'line-opacity': 0.75,
                },
              })
            }
            // add turn instructions here at the end
          }
          req.send()
        }
        map.on('load', function () {
          // make an initial directions request that
          // starts and ends at the same location
          getRoute(start)

          // Add starting point to the map
          map.addLayer({
            id: 'point',
            type: 'circle',
            source: {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      type: 'Point',
                      coordinates: start,
                    },
                  },
                ],
              },
            },
            paint: {
              'circle-radius': 10,
              'circle-color': '#3887be',
            },
          })
          // this is where the code from the next step will go
        })
        map.on('load', function () {
          getRoute([position.coords.longitude, position.coords.latitude])
        })
      })
    } else {
      alert('necesitas dar permido')
    }
  }, [])
  //   if (lng && lat)
  return (
    <div>
      <div
        ref={mapContainer}
        className="container_map"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      />
      <button id="fly">Click para confirmar su ubucación.</button>
    </div>
  )
}
