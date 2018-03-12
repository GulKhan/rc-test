const { fromJS } = require('immutable')

export const SET_PU_LOCATION_ID = 'search-box/SET_PU_LOCATION_ID'
export const SET_LOCATION_OPTIONS = 'search-box/SET_LOCATION_OPTIONS'
export const SET_ERROR = 'search-box/SET_ERROR'


const initialState = fromJS({
   puLocationID: '',
   puLocationLabel: '',
   locationOptions: {},
   error: ''
})

export default (state = initialState, action) => {
   switch (action.type) {
      case SET_PU_LOCATION_ID:
         state = state.set('puLocationID', action.id);
         return state.set('puLocationLabel', action.label);
      case SET_LOCATION_OPTIONS:
         return state.setIn(['locationOptions', action.id], action.options);
      case SET_ERROR:
         return state.set('error', action.error);
      default:
         return state
   }
}

export const setPULocation = (id, label) => {
   return dispatch => {
      dispatch({
         type: SET_PU_LOCATION_ID,
         id,
         label
      })
   }
}

export const setLocationOptions = (id, options) => {
   return dispatch => {
      dispatch({
         type: SET_LOCATION_OPTIONS,
         id,
         options
      })
   }
}

export const setError = (error) => {
   return dispatch => {
      dispatch({
         type: SET_ERROR,
         error
      })
   }
}

export const fetchLocationData = (id, searchPhrase) => {

   let url = "https://cors.io/?https://www.rentalcars.com/FTSAutocomplete.do?solrIndex=fts_en&solrRows=6&solrTerm="+searchPhrase;

   return (dispatch, state) => {
      try {

         return fetch(url)
            .then(res => {
               if (!res.ok) {
                  return setError(res.statusText)(dispatch)
               } else {
                  return res.json()
               }
            })
            .then(res => {
               setLocationOptions(id, res.results.numFound > 0 ? res.results.docs : [])(dispatch);
            })
            .catch((e) => {
               return new Promise((resolve, reject) => {
                  setError(e)(dispatch);
                  resolve();
               })
            })
      } catch (e) {
         return new Promise((resolve, reject) => {
            setError(e)(dispatch);
            resolve();
         })
      }
   }



}
