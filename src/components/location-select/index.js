import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { fetchLocationData } from '../../modules/search-box';
import onClickOutside from "react-onclickoutside";
import {
   SearchSelectContainer,
   OptionTypeLabel,
   OptionNameLabel,
   SearchInput,
   SelectMenu,
   Link,
   Error,
   Spinner
} from '../location-select/styles.js';

/**
 * Component which displays a location selection input field.
 */
class LocationSelect extends React.Component {

   input;
   typingTimer;

   constructor(props) {
      super(props);

      this.changeHandler = this.changeHandler.bind(this);
      this.getOptions = this.getOptions.bind(this);
      this.handleKeyUp = this.handleKeyUp.bind(this);
      this.displayValue = this.displayValue.bind(this);
      this.state = {
         error: '',
         isFocused: false,
         isFetched: false,
         isFetching: false,
         placeholderText: props.placeholderText,
         searchPhrase: '',
      }
   }

   componentDidUpdate(prevProps, prevState) {
      if (prevProps.value.id !== this.props.value.id) {
         // close menu as new value selected
         this.setState({isFocused: false});
      }
   }

   /**
    * What to display in the search field
    *
    * @returns {string}
    */
   displayValue() {
      if (this.state.isFocused) {
         return this.state.searchPhrase;
      } else {
         return this.props.value ? this.props.value.label : '';
      }
   }

   /**
    * The endpoint url with the search phrase added
    * @returns {string}
    */
   searchURL() {
      return this.props.url.replace(/{search_term}/, this.state.searchPhrase);
   }

   /**
    * Change handler for input field.
    * Triggers a fetch to data source at url if more than 1 character entered
    *
    * @param event
    */
   changeHandler(event) {
      this.setState({searchPhrase: event.target.value});
   }

   /**
    * To detect click outside component and close the select menu by losing focus
    * @param evt
    */
   handleClickOutside = evt => {
      this.setState({isFocused: false});
   };

   /**
    * Key up handler to initiate countdown for fetching results. This is to prevent too many unnecessary calls
    * while the user is typing
    */
   handleKeyUp() {
      clearTimeout(this.typingTimer);
      if (this.state.searchPhrase) {
         this.typingTimer = setTimeout(this.getOptions, 500);
      }
      return true;
   }

   /**
    * Get the options
    * @returns {Promise|Promise.<TResult>}|false
    */
   getOptions() {

      if (this.state.searchPhrase.length > 1) {
         this.setState({isFetched: false, isFetching: true});
         return this.props.fetchLocationData(this.props.id, this.state.searchPhrase)
            .then(() => {
               this.setState({isFetched: true, isFetching: false})
            });
      }

   }

   /**
    * Render the select menu options using the data returned from the endpoint
    * @param searchPhrase
    * @returns {Array}
    */
   renderOptions() {

      let searchPhrase = this.state.searchPhrase;

      return this.props.options.map(option => {
         let type = option.bookingId.split('-')[0];
         let phraseInName = searchPhrase && option.name.toUpperCase().indexOf(searchPhrase.toUpperCase()) !== -1;
         let splitName = phraseInName ? option.name.toLowerCase().split(searchPhrase.toLowerCase()) : option.name;

         let name = option.name+(option.hasOwnProperty('iata') ? ' ('+option.iata+')' : '');
         let displayName = name;
         let location = [];
         if (option.hasOwnProperty('region')) {
            displayName += ', '+option.region;
            location.push(option.region);
         }
         if (option.hasOwnProperty('country')) {
            displayName += ', '+option.country;
            location.push(option.country);
         }
         location = location.join(', ');

         return (
            <li key={option.bookingId} className={'item'} onClick={() => this.props.onSelect(option.bookingId, displayName)}>
               <Link>
                  <OptionTypeLabel className={type}>{type}</OptionTypeLabel>
                  <OptionNameLabel className={'text'}>
                     {phraseInName && splitName.length === 1 &&
                        <span>
                           {option.name.toUpperCase().indexOf(searchPhrase.toUpperCase()) !== 0 ? splitName[0] : ''}
                           <em style={{fontWeight: 'bold'}}>{searchPhrase}</em>
                           {option.name.toUpperCase().indexOf(searchPhrase.toUpperCase()) === 0 ? splitName[0] : ''}
                        </span>
                     }
                     {phraseInName && splitName.length === 2 &&
                        <span>
                           {splitName[0]}<em style={{fontWeight: 'bold'}}>{searchPhrase}</em>{splitName[1]}
                        </span>
                     }
                     {!phraseInName && name}
                     <br/>
                     {location}
                  </OptionNameLabel>
               </Link>
            </li>
         )
      })
   }

   render() {

      return (
         <SearchSelectContainer id={this.props.id+'-container'}>
            <SearchInput type="text"
                id={this.props.id}
                value={this.displayValue()}
                ref={node => { this.input = node }}
                className={"search-select form-control"+(this.state.isFocused ? ' active' : '')}
                placeholder={this.props.placeholderText}
                onChange={this.changeHandler}
                onFocus={() => {this.setState({isFocused: true})}}
                onKeyUp={this.handleKeyUp}
            />

            {this.state.isFetching &&
               <Spinner />
            }

            {this.state.isFocused && this.state.searchPhrase.length > 1 && this.state.isFetched &&
               <SelectMenu className="select-menu">
                  {this.props.options.length === 0 &&
                  <li className={'item'}>
                     <Link>
                        <OptionNameLabel>No results found</OptionNameLabel>
                     </Link>

                  </li>
                  }

                  {this.props.options.length !== 0 &&
                     this.renderOptions()
                  }
               </SelectMenu>
            }

            {this.state.error &&
               <Error>{this.state.error}</Error>
            }
         </SearchSelectContainer>
      )
   }
}

LocationSelect.defaultProps = {
   placeholderText: 'city, airport, station, region and district...',
   value: null,
   options: []
};

LocationSelect.propTypes = {
   id: PropTypes.string.isRequired,
   value: PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
   }).isRequired,
   placeholderText: PropTypes.string,
   onSelect: PropTypes.func.isRequired,

   /**
    * The select menu options, passes to renderOptions method
    */
   options: PropTypes.array.isRequired,
   /**
    * The endpoint url
    */
   url: PropTypes.string,

}

const mapStateToProps = (state, ownProps) => {
   return {
      // props from state
      options: state.searchBox.getIn(['locationOptions', ownProps.id])
   }
}

const mapDispatchToProps = dispatch => bindActionCreators({
   fetchLocationData: fetchLocationData
}, dispatch);


export default connect(
   mapStateToProps,
   mapDispatchToProps
)(onClickOutside(LocationSelect))
