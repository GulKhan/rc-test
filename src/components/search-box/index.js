import React from 'react'
import PropTypes from 'prop-types'
import LocationSelect from "../location-select";
import {
   SearchBoxContainer,
   H2,
   SearchBoxLabel
} from './styles.js';

/**
 * The rental cars search box. At the moment it only contains the pickup location field
 */
class SearchBox extends React.Component { //= ({searchSelectChanged}) => (

   render() {
      return (
         <SearchBoxContainer className='search-box'>
            <H2>Where are you going?</H2>

            <SearchBoxLabel htmlFor="pu-location-search">Pick-up Location</SearchBoxLabel>
            <LocationSelect
               id={"pu-location-search"}
               value={{id: this.props.puLocationID, label: this.props.puLocationLabel}}
               onSelect={(id, label) => this.props.setPULocation(id, label)}
            />

         </SearchBoxContainer>
      )
   }
}

SearchBox.propTypes = {
   setPULocation: PropTypes.func.isRequired,
   puLocationID: PropTypes.string.isRequired,
   puLocationLabel: PropTypes.string.isRequired
}

export default SearchBox