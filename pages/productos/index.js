import Head from 'next/head'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import CardTable from '../../components/Productos/CardTable'
import Link from 'next/link'
import Notifications, { notify } from 'react-notify-toast'
import { useState, useContext } from 'react'
import UserContext from '../../components/UserContext'
export default function Productos() {
  const [proFiltrado, setProFiltrado] = useState(null)
  const { categorias } = useContext(UserContext)
  const handleChange = () => {
    if (event.target.value) {
      fetch(
        `http://localhost:3001/productos/buscar/${event.target.value}`,
        {
          method: 'GET',
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notify.show('Error el en servidor', 'error')
          } else {
            setProFiltrado(data.body)
          }
        })
        .catch((error) => console.log('errorrr', error))
    } else {
      setProFiltrado(null)
    }
  }
  const handleChangeCategory = () => {
    if (event.target.value !== '0') {
      fetch(`http://localhost:3001/productos/${event.target.value}`, {
        method: 'GET',
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            notify.show('Error el en servidor', 'error')
          } else {
            setProFiltrado(data.body)
          }
        })
        .catch((error) => console.log('errorrr', error))
    } else {
      setProFiltrado(null)
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
              <h2 className="mt-30 page-title">Products</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Productos</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-12">
                  <Link href="/productos/nuevo">
                    <a className="add-btn hover-btn">
                      Agregar Nuevo Producto
                    </a>
                  </Link>
                </div>
                <div className="col-lg-8 col-md-6">
                  <div className="bulk-section mt-30">
                    <div className="search-by-name-input">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Buscar Producto"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="input-group">
                      <select
                        id="categeory"
                        name="categeory"
                        className="form-control"
                        defaultValue="0"
                        onChange={handleChangeCategory}
                      >
                        <option value="0">Todas las Categorias</option>
                        {categorias.map((cate) => (
                          <option value={cate._id} key={cate._id}>
                            {cate.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mt-30 mb-30">
                    <div className="card-title-2">
                      <h4>All Areas</h4>
                    </div>

                    <CardTable proFilter={proFiltrado} />
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
