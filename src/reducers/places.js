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
  CLEAR_CURRENT,
  CLEAR_MARKER,
  CLOSED_CURRENT,
  CONFIRM_ANSWER,
  FAIL,
  OPENED_CURRENT,
  RECEIVE_PLACES,
  REQUEST_PLACES,
  SEND_ANSWER,
  SET_CURRENT,
  SET_MARKER,
  SET_POSITION,
  SET_ZOOM
} from '../actions/places';

const actionHandlers = {
  [CLEAR_CURRENT]: () => ({
    current: null
  }),
  [CLEAR_MARKER]: () => ({
    marker: null
  }),
  [CLOSED_CURRENT]: (action, state) => ({
    current: Object.assign({}, state.current, { isOpen: false })
  }),
  [CONFIRM_ANSWER]: (action, state) => {
    const { place } = action;
    let { mapping, places } = state;

    const entry = mapping[place.id] || { index: places.length };
    entry.place = place;

    mapping = Object.assign({}, mapping, {
      [place.id]: entry
    });
    places = places.slice();
    places.splice(entry.index, 1, place);

    return {
      mapping,
      places
    };
  },
  [FAIL]: (action) => ({
    hasErrors: action.errors.length > 0
  }),
  [OPENED_CURRENT]: (action, state) => ({
    current: Object.assign({}, state.current, {
      isOpen: true,
      place: action.place
    })
  }),
  [RECEIVE_PLACES]: (action) => ({
    isFetching: false,
    mapping: action.places.reduce((mapping, place, index) => {
      mapping[place.id] = {
        index,
        place
      };

      return mapping;
    }, {}),
    places: action.places,
    query: action.query
  }),
  [REQUEST_PLACES]: (action) => ({
    hasErrors: false,
    isFetching: true,
    query: action.query
  }),
  [SEND_ANSWER]: () => ({
    hasErrors: false
  }),
  [SET_CURRENT]: (action) => ({
    current: {
      id: action.id,
      isOpen: false,
      position: action.position
    }
  }),
  [SET_MARKER]: (action) => ({
    marker: {
      id: action.id,
      position: action.position
    }
  }),
  [SET_POSITION]: (action) => ({
    position: action.position
  }),
  [SET_ZOOM]: (action) => ({
    zoom: action.zoom
  })
};

function places(
  state = {
    current: null,
    hasErrors: false,
    isFetching: false,
    mapping: {},
    marker: null,
    places: [],
    position: [ 56.074968, -3.4633847 ],
    query: {
      dominant: true
    },
    zoom: 8
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
