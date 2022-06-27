import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import ReactPaginate from 'react-paginate'
import Link from 'next/link'
import Notifications, { notify } from 'react-notify-toast'
import { useState, useEffect, useContext } from 'react'
import UserContext from '../../components/UserContext'
import Model from '../../components/Model'
import GetImg from '../../components/GetImg'
const Users = () => {
  const [token, setToken] = useState(false)
  const { signOut } = useContext(UserContext)
  const [clientes, setClientes] = useState(false)
  const [id, setId] = useState(null)
  function getUserAPi(tokenLocal) {
    fetch(`http://localhost:3001/user/role?role=GERENTE-ROLE`, {
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
        if (data.error) notify.show('Error el en servidor', 'error')
        else {
          setClientes(data.body)
        }
      })
      .catch((error) => {
        console.log(error)
        notify.show('Error en el servidor', 'error', 2000)
      })
  }
  useEffect(() => {
    const tokenLocal = localStorage.getItem('fribar-token')
    if (!tokenLocal) {
      signOut()
    }
    setToken(tokenLocal)
    getUserAPi(tokenLocal)
  }, [])
  function handlerDelete(id) {
    setId(id)
  }
  function handleChangeClientes() {
    if (event.target.value !== '0') {
      fetch(`http://localhost:3001/user/role?role=${event.target.value}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
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
            console.log(data)
            notify.show('Error el en servidor', 'error')
          } else {
            setClientes(data.body)
          }
        })
        .catch((error) => {
          notify.show('Error en el servidor', 'error', 2000)
        })
    } else {
      getUserAPi(token)
    }
  }
  return (
    <>
      <Model id={id} token={token} notify={notify} />
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Usuarios</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Usuarios</li>
              </ol>
              <div className="col-lg-4 col-md-4">
                <div className="bulk-section mt-30">
                  <div className="input-group">
                    <select
                      id="action"
                      name="action"
                      className="form-control"
                      defaultValue="0"
                      onChange={handleChangeClientes}
                    >
                      <option value="0">Todos los Usuarios</option>
                      <option value={'ADMIN-ROLE'}>Administradores</option>
                      <option value={'USER-ROLE'}>Vendedores</option>
                      <option value={'DELIVERY-ROLE'}>Repartidores</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Todos los Usuarios</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th style={{ width: '60px' }}>ID</th>
                              <th style={{ width: '100px' }}>Imagen</th>
                              <th>Nombre</th>
                              <th>Email</th>
                              <th>Telefono</th>
                              <th>Rol</th>
                              <th>Estado</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!clientes ? (
                              <tr>
                                <td>...</td>
                              </tr>
                            ) : (
                              clientes.map((cli) => (
                                <tr key={cli._id}>
                                  <td>{cli._id}</td>
                                  <td>
                                    <div className="cate-img-6">
                                      <img
                                        src={GetImg(
                                          cli.img,
                                          'http://localhost:3001/upload/user'
                                        )}
                                        alt="cliente-frifolly"
                                      />
                                    </div>
                                  </td>
                                  <td>{cli.idPersona.nombre_comp}</td>
                                  <td>{cli.email}</td>
                                  <td>{cli.phone}</td>
                                  <td>{cli.role}</td>
                                  <td>
                                    {cli.idPersona.status ? (
                                      <span className="badge-item badge-status">
                                        Activo
                                      </span>
                                    ) : (
                                      <span className="badge-item badge-status-false">
                                        Inactivo
                                      </span>
                                    )}
                                  </td>
                                  <td className="action-btns">
                                    <Link
                                      href="/clientes/[id]"
                                      as={`/clientes/${cli._id}`}
                                    >
                                      <a
                                        className="view-shop-btn"
                                        title="View"
                                      >
                                        <i className="fas fa-eye"></i>
                                      </a>
                                    </Link>
                                    <Link
                                      href="/clientes/editar/[id]"
                                      as={`/clientes/editar/${cli._id}`}
                                    >
                                      <a className="edit-btn" title="Edit">
                                        <i className="fas fa-edit"></i>
                                      </a>
                                    </Link>
                                    <a
                                      className="delete-btn"
                                      title="Edit"
                                      data-toggle="modal"
                                      data-target="#category_model"
                                      onClick={() =>
                                        handlerDelete(cli._id)
                                      }
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
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

export default Users
