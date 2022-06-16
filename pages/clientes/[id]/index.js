import TopNavbar from '../../../components/Navbar'
import SideNav from '../../../components/Navbar/SideNav'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useContext, useState } from 'react'
import UserContext from '../../../components/UserContext'
import GetImg from '../../../components/GetImg'
import Notifications, { notify } from 'react-notify-toast'
const viewClient = () => {
  const { signOut } = useContext(UserContext)
  const [client, setCliente] = useState(null)
  const router = useRouter()
  useEffect(() => {
    const tokenLocal = localStorage.getItem('frifolly-token')
    if (!tokenLocal) {
      signOut()
    }
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
            notify.show('Error en el servidor', 'error', 2000)
          } else {
            console.log(data.body.users[0])
            setCliente(data.body.users[0])
          }
        })
        .catch((error) =>
          notify.show('Error en el servidor', 'error', 2000)
        )
    }
  }, [router])
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
                <li className="breadcrumb-item active">Ver Cliente</li>
              </ol>

              {client ? (
                <div className="row">
                  <div className="col-lg-5 col-md-6">
                    <div className="card card-static-2 mb-30">
                      <div className="card-body-table">
                        <div className="shopowner-content-left text-center pd-20">
                          <div className="customer_img">
                            <img
                              src={GetImg(
                                client.img,
                                'http://localhost:3001/upload/user'
                              )}
                              alt="cliente-Fribar"
                            />
                          </div>
                          <div className="shopowner-dt-left mt-4">
                            <h4>{client.nombre_comp}</h4>
                            <span>{client.role}</span>
                          </div>
                          <ul className="product-dt-purchases">
                            <li>
                              <div className="product-status">
                                Compras
                                <span className="badge-item-2 badge-status">
                                  {client.compras}
                                </span>
                              </div>
                            </li>
                            <li>
                              <div className="product-status">
                                Puntos
                                <span className="badge-item-2 badge-status">
                                  {client.puntos}
                                </span>
                              </div>
                            </li>
                          </ul>
                          <div className="shopowner-dts">
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Nombre</span>
                              <span className="right-dt">
                                {client.nombre_comp}
                              </span>
                            </div>

                            <div className="shopowner-dt-list">
                              <span className="left-dt">Email</span>
                              <span className="right-dt">
                                {client.email}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Teléfono</span>
                              <span className="right-dt">
                                {client.phone}
                              </span>
                            </div>
                            <div className="shopowner-dt-list">
                              <span className="left-dt">Direccion</span>
                              <span className="right-dt">
                                {client.direccion}
                              </span>
                            </div>
                          </div>
                        </div>
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

export default viewClient
