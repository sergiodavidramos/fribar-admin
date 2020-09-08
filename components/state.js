import React, { createContext, useContext, useReducer } from 'react'
export const StateContext = createContext()
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
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
)
export const useStateValue = () => useContext(StateContext)
