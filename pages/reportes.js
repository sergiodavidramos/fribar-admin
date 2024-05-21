import TopNavbar from '../components/Navbar'
import SideNav from '../components/Navbar/SideNav'
import Footer from '../components/Footer'
import Link from 'next/link'
import Notifications, { notify } from 'react-notify-toast'
import { useState, useEffect, useContext, useRef } from 'react'
import UserContext from '../components/UserContext'
var map
const Reportes = () => {
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
                <li className="breadcrumb-item active">Reportes</li>
              </ol>
              <div className="row">
                <div className="col-lg-4 col-md-5">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Generar nuevo reporte</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="news-content-right pd-20">
                        <div className="form-group">
                          <label className="form-label">Reportes*</label>
                          <select
                            id="categeory"
                            name="categeory"
                            className="form-control"
                            defaultValue={'0'}
                          >
                            <option value="0">
                              --Seleccione un tipo de reporte--
                            </option>
                            <option value="1">Reort 1</option>
                            <option value="2">Reort 2</option>
                            <option value="3">Reort 3</option>
                            <option value="4">Reort 4</option>
                            <option value="5">Reort 5</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">
                            Seleccionar Sucursal*
                          </label>
                          <select
                            id="categeory"
                            name="categeory"
                            className="form-control"
                          >
                            <option value="0">--sucursales--</option>
                            {/* <option value="1">Reort 1</option>
                            <option value="2">Reort 2</option>
                            <option value="3">Reort 3</option>
                            <option value="4">Reort 4</option>
                            <option value="5">Reort 5</option> */}
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            Inicio de fecha*
                          </label>
                          <input
                            type="date"
                            className="form-control datepicker-here"
                            data-language="en"
                            placeholder="Fecha inicio"
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">
                            Fin de fecha*
                          </label>
                          <input
                            type="date"
                            className="form-control datepicker-here"
                            data-language="en"
                            placeholder="Fecha limite"
                            onChange={(e) => console.log(e.target.value)}
                          />
                        </div>
                        <button
                          className="save-btn hover-btn"
                          type="submit"
                        >
                          Filtro de busqueda
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-8 col-md-7">
                  <div className="all-cate-tags">
                    <div className="row">
                      <div className="col-lg-12 col-md-12">
                        <div className="card card-static-2 mb-30">
                          <div className="card-title-2">
                            <h4>Ventas por hora</h4>
                          </div>
                          <div className="card-body-table">
                            <div className="table-responsive">
                              <table className="table ucp-table table-hover">
                                <thead>
                                  <tr>
                                    <th>Horas</th>
                                    <th>Pedidos totales</th>
                                    <th>Ventas totales</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* <tr>
                                    <td>00.00</td>
                                    <td>5</td>
                                    <td>$50</td>
                                  </tr>
                                  <tr>
                                    <td>01.00</td>
                                    <td>4</td>
                                    <td>$35</td>
                                  </tr>
                                  <tr>
                                    <td>02.00</td>
                                    <td>1</td>
                                    <td>$13</td>
                                  </tr>
                                  <tr>
                                    <td>03.00</td>
                                    <td>8</td>
                                    <td>$150</td>
                                  </tr>
                                  <tr>
                                    <td>04.00</td>
                                    <td>4</td>
                                    <td>$45</td>
                                  </tr>
                                  <tr>
                                    <td>05.00</td>
                                    <td>7</td>
                                    <td>$80</td>
                                  </tr> */}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="card-body-table-footer">
                            <ul>
                              {/* <li>
                                <button className="download-btn hover-btn">
                                  Download JPG
                                </button>
                              </li>
                              <li>
                                <button className="download-btn hover-btn">
                                  Download PNG
                                </button>
                              </li> */}
                              <li>
                                <button className="download-btn hover-btn">
                                  Esportar en exel
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="card card-static-2 mb-30">
                          <div className="card-title-2">
                            <h4>Ventas por dia</h4>
                          </div>
                          <div className="card-body-table">
                            <div className="table-responsive">
                              <table className="table ucp-table table-hover">
                                <thead>
                                  <tr>
                                    <th>Año</th>
                                    <th>Mes</th>
                                    <th>Dia</th>
                                    <th>Pedidos totales</th>
                                    <th>Ventas Totales</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* <tr>
                                    <td>2020</td>
                                    <td>5</td>
                                    <td>15</td>
                                    <td>25</td>
                                    <td>$523</td>
                                  </tr>
                                  <tr>
                                    <td>2020</td>
                                    <td>4</td>
                                    <td>20</td>
                                    <td>32</td>
                                    <td>$723</td>
                                  </tr> */}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="card-body-table-footer">
                            <ul>
                              <li>
                                <button className="download-btn hover-btn">
                                  Export to Excel
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="card card-static-2 mb-30">
                          <div className="card-title-2">
                            <h4>Ventas por mes</h4>
                          </div>
                          <div className="card-body-table">
                            <div className="table-responsive">
                              <table className="table ucp-table table-hover">
                                <thead>
                                  <tr>
                                    <th>Año</th>
                                    <th>Mes</th>
                                    <th>Pedodos Totales</th>
                                    <th>Ventas totales</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* <tr>
                                    <td>2020</td>
                                    <td>5</td>
                                    <td>400</td>
                                    <td>$25523</td>
                                  </tr>
                                  <tr>
                                    <td>2020</td>
                                    <td>4</td>
                                    <td>250</td>
                                    <td>$10723</td>
                                  </tr> */}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="card-body-table-footer">
                            <ul>
                              <li>
                                <button className="download-btn hover-btn">
                                  Export to Excel
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className="card card-static-2 mb-30">
                          <div className="card-title-2">
                            <h4>Sucursales mas vendidas</h4>
                          </div>
                          <div className="card-body-table">
                            <div className="table-responsive">
                              <table className="table ucp-table table-hover">
                                <thead>
                                  <tr>
                                    <th>Nombre</th>
                                    <th>Pedidos totales</th>
                                    <th>Ventas Totales</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {/* <tr>
                                    <td>Ludhiana</td>
                                    <td>2530</td>
                                    <td>$125523</td>
                                  </tr> */}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="card-body-table-footer">
                            <ul>
                              <li>
                                <button className="download-btn hover-btn">
                                  Export to Excel
                                </button>
                              </li>
                            </ul>
                          </div>
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

export default Reportes
