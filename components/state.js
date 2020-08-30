import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
} from 'react'
export const stateContext = createContext()
// let user = false
// let token = false
// useEffect(() => {
//     user = localStorage.getItem('frifolly-user')
//     token = localStorage.getItem('frifolly-token')
//     if (!user || !token) Router.replace('/login')
//   }, [])
const initialState = {
  user: null,
  token: null,
}

export const StateProvider = ({ reducer, children }) => (
  <stateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </stateContext.Provider>
)
export const useStateValue = () => useContext(stateContext)
