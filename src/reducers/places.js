/*
 * Copyright (C) 2018 Alasdair Mercer
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import {
  ANSWER,
  CLOSE_SELECTION,
  DESELECT_PLACE,
  OPEN_SELECTION,
  RECEIVE_PLACES,
  RECEIVE_POSITION,
  REQUEST_PLACES,
  SELECT_PLACE,
  TOGGLE_SELECTION_OPEN
} from '../actions/places';

const actionHandlers = {
  [ANSWER]: (action, state) => {
    const { errors, place } = action;
    let mapping = state.mapping;
    let placesArray = state.places;

    if (place) {
      const entry = mapping[place._id] || { index: placesArray.length };
      entry.place = place;

      mapping = Object.assign({}, mapping, {
        [place._id]: entry
      });
      placesArray = placesArray.slice();
      placesArray.splice(entry.index, 1, place);
    }

    return {
      hasErrors: errors.length > 0,
      mapping,
      places: placesArray
    };
  },
  [CLOSE_SELECTION]: () => ({
    openSelected: false
  }),
  [DESELECT_PLACE]: () => ({
    openSelected: false,
    selected: null
  }),
  [OPEN_SELECTION]: () => ({
    openSelected: true
  }),
  [RECEIVE_PLACES]: (action) => ({
    hasErrors: action.errors.length > 0,
    isFetching: false,
    mapping: action.places.reduce((mapping, place, index) => {
      mapping[place._id] = {
        index,
        place
      };

      return mapping;
    }, {}),
    places: action.places,
    query: action.query
  }),
  [RECEIVE_POSITION]: (action) => ({
    position: action.position
  }),
  [REQUEST_PLACES]: (action) => ({
    hasErrors: false,
    isFetching: true,
    query: action.query
  }),
  [SELECT_PLACE]: (action, state) => ({
    openSelected: false,
    position: action.place ? {
      lat: action.place.geometry.location.lat(),
      lng: action.place.geometry.location.lng()
    } : state.position,
    selected: action.place
  }),
  [TOGGLE_SELECTION_OPEN]: (action, state) => ({
    openSelected: !state.openSelected
  })
};

function places(
  state = {
    defaultPosition: {
      lat: 56.074968,
      lng: -3.4633847
    },
    hasErrors: false,
    isFetching: false,
    mapping: {},
    openSelected: false,
    places: [],
    position: null,
    query: {
      dominant: 'yes'
    },
    selected: null
  },
  action = {}
) {
  const handler = actionHandlers[action.type];
  if (handler) {
    // TODO: Test polyfill of Object.assign
    return Object.assign({}, state, handler(action, state));
  }

  return state;
}

export default places;
