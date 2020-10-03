import Notifications, { notify } from 'react-notify-toast'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
const ViewPedidos = () => {
  return (
    <>
      <TopNavbar />
      <div id="layoutSidenav">
        <SideNav />
        <div id="layoutSidenav_content">
          <main>
            <Notifications options={{ zIndex: 9999, top: '56px' }} />
            <div className="container-fluid">
              <h2 className="mt-30 page-title">Pedidos</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/pedidos">
                    <a>Pedidos</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Vista de pedido</li>
              </ol>
              <div className="row">
                <div className="col-xl-12 col-md-12">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h2 className="title1458">Invoice</h2>
                      <span className="order-id">Order #ORDR-123456</span>
                    </div>
                    <div className="invoice-content">
                      <div className="row">
                        <div className="col-lg-6 col-sm-6">
                          <div className="ordr-date">
                            <b>Order Date :</b> 29 May 2020
                          </div>
                        </div>
                        <div className="col-lg-6 col-sm-6">
                          <div className="ordr-date right-text">
                            <b>Order Date :</b>
                            <br />
                            #0000, St No. 8,
                            <br />
                            Shahid Karnail Singh Nagar,
                            <br />
                            MBD Mall,
                            <br />
                            Frozpur road,
                            <br />
                            Ludhiana,
                            <br />
                            141001
                            <br />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="card card-static-2 mb-30 mt-30">
                            <div className="card-title-2">
                              <h4>Recent Orders</h4>
                            </div>
                            <div className="card-body-table">
                              <div className="table-responsive">
                                <table className="table ucp-table table-hover">
                                  <thead>
                                    <tr>
                                      <th style={{ width: '130px' }}>#</th>
                                      <th>Item</th>
                                      <th
                                        style={{ width: '150px' }}
                                        className="text-center"
                                      >
                                        Price
                                      </th>
                                      <th
                                        style={{ width: '150px' }}
                                        className="text-center"
                                      >
                                        Qty
                                      </th>
                                      <th
                                        style={{ width: '100px' }}
                                        className="text-center"
                                      >
                                        Total
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td>1</td>
                                      <td>
                                        <a href="#" target="_blank">
                                          Product Title Here
                                        </a>
                                      </td>
                                      <td className="text-center">$15</td>
                                      <td className="text-center">1</td>
                                      <td className="text-center">$15</td>
                                    </tr>
                                    <tr>
                                      <td>2</td>
                                      <td>
                                        <a href="#" target="_blank">
                                          Product Title Here
                                        </a>
                                      </td>
                                      <td className="text-center">$12</td>
                                      <td className="text-center">1</td>
                                      <td className="text-center">$12</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-7"></div>
                        <div className="col-lg-5">
                          <div className="order-total-dt">
                            <div className="order-total-left-text">
                              Sub Total
                            </div>
                            <div className="order-total-right-text">
                              $27
                            </div>
                          </div>
                          <div className="order-total-dt">
                            <div className="order-total-left-text">
                              Delivery Fees
                            </div>
                            <div className="order-total-right-text">
                              $0
                            </div>
                          </div>
                          <div className="order-total-dt">
                            <div className="order-total-left-text fsz-18">
                              Total Amount
                            </div>
                            <div className="order-total-right-text fsz-18">
                              $27
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-7"></div>
                        <div className="col-lg-5">
                          <div className="select-status">
                            <label htmlFor="status">Status*</label>
                            <div className="status-active">Pending</div>
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

export default ViewPedidos
