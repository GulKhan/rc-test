import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import SearchBox from '../../components/search-box'
import {
   setPULocation
} from '../../modules/search-box'


const mapStateToProps = (state, ownProps) => {
   return {
      // props from state
      puLocationID: state.searchBox.get('puLocationID'),
      puLocationLabel: state.searchBox.get('puLocationLabel')
   }
}

const mapDispatchToProps = dispatch => bindActionCreators({
   setPULocation
}, dispatch);


export default connect(
   mapStateToProps,
   mapDispatchToProps
)(SearchBox)