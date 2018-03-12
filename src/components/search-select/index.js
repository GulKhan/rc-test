import React from 'react'
import PropTypes from 'prop-types'
import onClickOutside from "react-onclickoutside";

import {
   SearchSelectContainer,
   SearchInput,
   SelectMenu,
   Link,
   OptionNameLabel,
   Spinner
} from './styles.js';

/**
 * A re-usable search select field.
 */
class SearchSelect extends React.Component {

   input;
   typingTimer;

   constructor(props) {
      super(props);
      this.changeHandler = this.changeHandler.bind(this);
      this.getOptions = this.getOptions.bind(this);
      this.handleKeyUp = this.handleKeyUp.bind(this);
      this.displayValue = this.displayValue.bind(this);
      this.state = {
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

         if (this.state.searchPhrase.length > 1 && this.props.url) {
            this.setState({isFetched: false, isFetching: true});
            return this.props.fetchData(this.searchURL())
               .then(() => {
                  this.setState({isFetched: true, isFetching: false})
               });
         }
      }
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
                     this.props.renderOptions(this.state.searchPhrase)
                  }
               </SelectMenu>
            }
            {this.props.children}
         </SearchSelectContainer>
      )
   }
}

SearchSelect.defaultProps = {
   placeholderText: 'Search...',
   value: '',
   url: '',
   options: []
};

SearchSelect.propTypes = {
   id: PropTypes.string.isRequired,
   value: PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
   }).isRequired,
   placeholderText: PropTypes.string,
   /**
    * The select menu options, passes to renderOptions method
    */
   options: PropTypes.array.isRequired,
   /**
    * The endpoint url
    */
   url: PropTypes.string,
   /**
    * The method to fetch options using the provided url
    */
   fetchData: PropTypes.func.isRequired,
   /**
    * method to render the options for the select menu
    */
   renderOptions: PropTypes.func.isRequired,
}

export default onClickOutside(SearchSelect)