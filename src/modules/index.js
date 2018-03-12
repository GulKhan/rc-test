import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import searchBox  from './search-box'

export default combineReducers({
   routing: routerReducer,
   searchBox
})