import Fila from './Fila'
import ReactPaginate from 'react-paginate'
import Notifications, { notify } from 'react-notify-toast'
import { useState, useEffect } from 'react'
import { useContext } from 'react'
import UserContext from '../UserContext'
const CardTable = ({ token }) => {
  const [product, setProduct] = useState(false)
  const [pageState, setPageState] = useState(0)
  //   const { token, user, signOut } = useContext(UserContext)
  console.log('EL token', token)
  //   console.log('EL user', user)
  async function paginationHandler(page) {
    setPageState(page.selected)
  }
  useEffect(() => {
    fetch(
      `http://localhost:3001/productos?desde=${pageState * 10}&limite=${
        pageState * 10 + 10
      }`,
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
          //   signOut()
          //   notify.show('No estas Autorizado', 'error')
        }
        return res.json()
      })
      .then((data) => {
        console.log(data)
        setProduct(data.body)
      })
      .catch((error) => console.log('errorrr', error))
  }, [token])

  return (
    <div className="card-body-table">
      <Notifications options={{ zIndex: 9999, top: '56px' }} />
      <div className="table-responsive">
        <table className="table ucp-table table-hover">
          <thead>
            <tr>
              <th style={{ width: '60px' }}>
                <input type="checkbox" className="check-all" />
              </th>
              <th style={{ width: '60px' }}>ID</th>
              <th style={{ width: '100px' }}>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Created</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {!product ? (
              <tr>
                <td>...</td>
              </tr>
            ) : (
              product.products.map((pro, index) => (
                <Fila key={index} pro={pro} />
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
            pageCount={product.count / 10}
            marginPagesDisplayed={3}
            pageRangeDisplayed={5}
            onPageChange={paginationHandler}
          />
        </div>
      </div>
    </div>
  )
}

export default CardTable
