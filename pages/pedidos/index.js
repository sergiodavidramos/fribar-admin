import Notifications, { notify } from 'react-notify-toast'
import TopNavbar from '../../components/Navbar'
import SideNav from '../../components/Navbar/SideNav'
import Footer from '../../components/Footer'
import Link from 'next/link'
import chroma from 'chroma-js'
import Select from 'react-select'
const Pedidos = () => {
  const colourOptions = [
    { value: '0', label: 'Pendiente', color: 'orange' },
    { value: '1', label: 'Proceso', color: 'purple' },
    { value: '2', label: 'Completo', color: 'green' },
    { value: '3', label: 'Cancelado', color: 'red' },
  ]
  const dot = (color = '#ccc') => ({
    display: 'flex',
    alignItems: 'center',
    ':before': {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
    },
  })

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'white' }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color)
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : data.color,
        cursor: isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor:
            !isDisabled &&
            (isSelected ? data.color : color.alpha(0.3).css()),
        },
      }
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot() }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
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
              <h2 className="mt-30 page-title">Pedidos</h2>
              <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item">
                  <Link href="/">
                    <a>Tablero</a>
                  </Link>
                </li>
                <li className="breadcrumb-item active">Pedidos</li>
              </ol>
              <div className="row justify-content-between">
                <div className="col-lg-3 col-md-4">
                  <div className="bulk-section mb-30">
                    <div className="input-group">
                      <select
                        id="action"
                        name="action"
                        className="form-control"
                        defaultValue="0"
                      >
                        <option value="0">Todas las acciones</option>
                        <option value="1">Pendiente</option>
                        <option value="2">Proceso</option>
                        <option value="3">Completo</option>
                        <option value="4">Cancelado</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-lg-12 col-md-12">
                  <div className="card card-static-2 mb-30">
                    <div className="card-title-2">
                      <h4>Todos los pedidos</h4>
                    </div>
                    <div className="card-body-table">
                      <div className="table-responsive">
                        <table className="table ucp-table table-hover">
                          <thead>
                            <tr>
                              {/* <th style={{ width: '100px' }}>
                                ID de orden
                              </th> */}
                              <th>Item</th>
                              <th style={{ width: '150px' }}>Fecha</th>
                              <th style={{ width: '300px' }}>Direccion</th>
                              <th style={{ width: '130px' }}>Estado</th>
                              <th style={{ width: '80px' }}>Total</th>
                              <th style={{ width: '50px' }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {/* <td>ORDER12345</td> */}
                              <td>
                                <a href="#" target="_blank">
                                  Product Title Here
                                </a>
                              </td>
                              <td>
                                <span className="delivery-time">
                                  15/06/2020
                                </span>
                                <span className="delivery-time">
                                  4:00PM - 6.00PM
                                </span>
                              </td>
                              <td>
                                #0000, St No. 8, Shahid Karnail Singh
                                Nagar, MBD Mall, Frozpur road, Ludhiana,
                                141001
                              </td>
                              <td style={{ width: '15%' }}>
                                <Select
                                  defaultValue={colourOptions[0]}
                                  label="Single select"
                                  options={colourOptions}
                                  styles={colourStyles}
                                  instanceId="state"
                                />
                              </td>
                              <td>$9000</td>
                              <td className="action-btns">
                                <Link
                                  href="/pedidos/[id]"
                                  as={`/pedidos/sdsd`}
                                >
                                  <a className="views-btn">
                                    <i className="fas fa-eye"></i>
                                  </a>
                                </Link>
                              </td>
                            </tr>
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
export default Pedidos
