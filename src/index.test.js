import React from 'react';
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import store from './store'
import { configure, mount } from 'enzyme';
import renderer from 'react-test-renderer'
import 'jest-styled-components'
import Adapter from 'enzyme-adapter-react-16';
import Home from './containers/home'
import SearchBox from './components/search-box'
import {
   SearchBoxContainer,
   SearchBoxLabel,
} from './components/search-box/styles'
import {
   SearchInput
} from './components/search-select/styles'

configure({ adapter: new Adapter() });

describe('Test 1', () => {
   describe('AC1) I am a visitor to the rentalcars.com homepage', () => {

      let wrapper = mount(
         <Provider store={store}>
            <Home/>
         </Provider>
      );

      it('displays a search widget', () => {
         expect(wrapper.find('SearchBox').exists()).toBe(true);
      })

      it('has a text box labelled \'Pick-up Location\' ', () => {
         expect(wrapper.find('.search-box label[htmlFor="pu-location-search"]').text()).toBe('Pick-up Location');
      })

      it('has the styling as per the rentalcars.com homepage.', () => {
         let tree = renderer.create(<SearchBoxContainer/>).toJSON();
         expect(tree).toHaveStyleRule('background-color', '#f5d361');
         expect(tree).toHaveStyleRule('padding', '5%');
      })

   });

   describe('AC2) I am on the Search box within the rentalcars.com homepage', () => {

      let wrapper = mount(
         <Provider store={store}>
            <Home/>
         </Provider>
      );

      it('displays the placeholder text within the \'Pick Up Location\' input box: \'city, airport, station, region and district...\'.', () => {
         expect(wrapper.find('input#pu-location-search').props()).toHaveProperty('placeholder', 'city, airport, station, region and district...');
      })

      it('has the styling as per the rentalcars.com homepage.', () => {
         let tree = renderer.create(<SearchBoxLabel/>).toJSON();
         expect(tree).toHaveStyleRule('color', '#444');
         expect(tree).toHaveStyleRule('text-shadow', 'none');
         expect(tree).toHaveStyleRule('font-size', '0.875em');

         tree = renderer.create(<SearchInput/>).toJSON();
         expect(tree).toHaveStyleRule('padding', '12px 8% 12px 2%');
         expect(tree).toHaveStyleRule('line-height', '15px');
      })
   });

   describe('AC3) I am on the Search box within the rentalcars.com homepage', () => {

      let wrapper = mount(
         <Provider store={store}>
            <Home/>
         </Provider>
      );

      it('I click/tap into \'Pick Up Location\' box', () => {
         wrapper.find('input#pu-location-search').simulate('focus');
      })

      it('a focus state is applied (browser default)', () => {
         // focus state is applied
         expect(wrapper.find('input#pu-location-search').hasClass('active')).toBe(true);
      })

   });
});


describe('Test 2', () => {
   describe('AC1) I am a visitor on the Search Box within the rentalcars.com homepage', () => {

      let wrapper = mount(
         <Provider store={store}>
            <Home/>
         </Provider>
      );

      it('I enter a single alphanumeric character into the pick up location', () => {
         wrapper.find('input#pu-location-search').simulate('focus')
         wrapper.find('input#pu-location-search').simulate('change', { target: { value: 'a' } })
      })

      it('the placeholder text disappears AND no search results list is displayed', () => {
         expect(wrapper.find('#pu-location-search-container .select-menu').exists()).toBe(false);
      })

   });

   describe('AC2) I am a visitor on the Search Box within the rentalcars.com homepage', () => {

      let wrapper = mount(
         <Provider store={store}>
            <Home/>
         </Provider>
      );


      it('I enter 2 or more alphanumeric characters into the pick up location ', () => {

         wrapper.find('input#pu-location-search').simulate('focus')
         wrapper.find('input#pu-location-search').simulate('change', { target: { value: 'ma' } })

      })

      it('I see a list of search results ', () => {

         expect.assertions(3);
         return Promise.resolve(wrapper.find('LocationSelect').instance().getOptions())
         .then(() => {

            wrapper.update()
            expect(store.getState().searchBox.getIn(['locationOptions', 'pu-location-search']).length > 0).toBe(true);
            expect(wrapper.find('.select-menu').exists()).toBe(true);
            expect(wrapper.find('.select-menu .item').exists()).toBe(true);
         })

      })

   });

   describe('AC3) I have entered a matched search term for pick up location on desktop', () => {

      let wrapper = mount(
         <Provider store={store}>
            <Home/>
         </Provider>
      );


      wrapper.find('input#pu-location-search').simulate('focus')
      wrapper.find('input#pu-location-search').simulate('change', { target: { value: 'man' } })

      it('the maximum number of search results displayed is 6 ', () => {

         expect.assertions(3);
         return Promise.resolve(wrapper.find('LocationSelect').instance().getOptions())
         .then(() => {

            wrapper.update()
            expect(store.getState().searchBox.getIn(['locationOptions', 'pu-location-search']).length).toBe(6);
            expect(wrapper.find('#pu-location-search-container .select-menu').exists()).toBe(true);
            expect(wrapper.find('#pu-location-search-container .select-menu .item')).toHaveLength(6);


         });

      });


   });

   describe('AC4) I am a visitor on the Search Box within the rentalcars.com homepage', () => {

      let wrapper = mount(
         <Provider store={store}>
            <Home/>
         </Provider>
      );

      it('I enter a search term in the pick up location that is not recognised eg XX', () => {
         wrapper.find('input#pu-location-search').simulate('focus')
         wrapper.find('input#pu-location-search').simulate('change', { target: { value: 'xxxxxxxx' } })

      });

      it('I should see the message \'No results found\'', () => {

         expect.assertions(1);
         return Promise.resolve(wrapper.find('LocationSelect').instance().getOptions())
            .then(() => {

               wrapper.update();
               expect(wrapper.find('#pu-location-search-container .select-menu .item').text()).toBe('No results found');

            });

      })

   });

   describe('AC5)  I am a visitor on the Search Box within the rentalcars.com homepage', () => {

      let wrapper = mount(
         <Provider store={store}>
            <Home/>
         </Provider>
      );

      it('the search results list is displayed', () => {
         wrapper.find('input#pu-location-search').simulate('focus')
         wrapper.find('input#pu-location-search').simulate('change', { target: { value: 'man' } })

         expect.assertions(1);
         return Promise.resolve(wrapper.find('LocationSelect').instance().getOptions())
            .then(() => {
               wrapper.update();
               expect(wrapper.find('#pu-location-search-container .select-menu').exists()).toBe(true);
            })
      });

      it('I remove the search term leaving only 1 character', () => {
         wrapper.find('input#pu-location-search').simulate('change', { target: { value: 'm' } })

      });

      it('the search results list no longer displayed', () => {
         expect.assertions(1);
         return Promise.resolve(wrapper.find('LocationSelect').instance().getOptions())
            .then(() => {
               wrapper.update();
               expect(wrapper.find('#pu-location-search-container .select-menu').exists()).toBe(false);
            })
      })

   });

});