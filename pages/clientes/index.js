import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import ReactPaginate from 'react-paginate'
import Link from 'next/link'
import Notifications, { notify } from 'react-notify-toast'
import { useState, useEffect, useContext } from 'react'
import UserContext from '../../components/UserContext'
import Model from '../../components/Model'
const Clientes = ({ clientFilter }) => {
  const urlGetImg = 'http://localhost:3001/upload'
  const { signOut, token } = useContext(UserContext)
  //   const [token, setToken] = useState(false)
  const [clientes, setClientes] = useState(false)
  const [pageState, setPageState] = useState(0)
  const [count, setCount] = useState(0)
  const [id, setId] = useState(null)
  async function paginationHandler(page) {
    setPageState(page.selected)
  }
  useEffect(() => {
    if (!clientFilter) {
      if (token) {
        fetch(
          `http://localhost:3001/user?desde=${
            pageState * 10
          }&limite=${10}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        )
          .then((res) => {
            if (res.status === 401) {
              signOut()
            }
            return res.json()
          })
          .then((data) => {
            if (data.error) {
              notify.show('Error el en servidor', 'error')
            } else {
              setClientes(data.body.users)
              setCount(data.body.count)
            }
          })
          .catch((error) =>
            notify.show('Error en el servidor', 'error', 2000)
          )
      }
    } else {
      setClientes(clientFilter)
      setCount(0)
    }
  }, [pageState, token])

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
  function handlerDelete(id) {
    setId(id)
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
              <h2 className="mt-30 page-title">Clientes</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Clientes</li>
              </ol>
              <div className="row">
                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Todos los clientes</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              <th style={{ width: '60px' }}>
                                <input
                                  type="checkbox"
                                  className="check-all"
                                />
                              </th>
                              <th style={{ width: '60px' }}>ID</th>
                              <th style={{ width: '100px' }}>Imagen</th>
                              <th>Nombre</th>
                              <th>Email</th>
                              <th>Telefono</th>
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
                                  <td>
                                    <input
                                      type="checkbox"
                                      className="check-item"
                                      name="ids[]"
                                      defaultValue="10"
                                    />
                                  </td>
                                  <td>{cli._id}</td>
                                  <td>
                                    <div className="cate-img-6">
                                      <img
                                        src={obtenerImg(cli)}
                                        alt="cliente-frifolly"
                                      />
                                    </div>
                                  </td>
                                  <td>{cli.nombre_comp}</td>
                                  <td>{cli.email}</td>
                                  <td>{cli.phone}</td>
                                  <td className="action-btns">
                                    <a
                                      href="customer_view.html"
                                      className="view-shop-btn"
                                      title="View"
                                    >
                                      <i className="fas fa-eye"></i>
                                    </a>
                                    <a
                                      href="customer_edit.html"
                                      className="edit-btn"
                                      title="Edit"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </a>
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
                        <div className="pages">
                          <ReactPaginate
                            previousLabel={'previous'}
                            nextLabel={'next'}
                            breakLabel={'...'}
                            breakClassName={'break-me'}
                            activeClassName={'active-page'}
                            containerClassName={'pagination'}
                            initialPage={0}
                            pageCount={count / 10}
                            marginPagesDisplayed={3}
                            pageRangeDisplayed={5}
                            onPageChange={paginationHandler}
                          />
                        </div>
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

export default Clientes
