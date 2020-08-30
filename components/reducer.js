export default (state, action) => {
  switch (action.type) {
    case 'addUser':
      return {
        ...state,
        user: action.newUser,
      }
    case 'addToken':
      return {
        ...state,
        token: action.newToken,
      }
    case 'addProducts':
      return {
        ...state,
        products: action.newProducts,
      }
    case 'addCategories':
      return {
        ...state,
        categories: action.newCategories,
      }
    default:
      return state
  }
}
