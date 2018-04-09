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

// TODO: Add answer action

import {
  RECEIVE_PLACES,
  RECEIVE_POSITION,
  REQUEST_PLACES
} from '../actions/places';

function places(
  state = {
    errors: [],
    isFetching: false,
    places: [],
    position: null,
    query: {
      dominant: 'yes'
    }
  },
  action
) {
  // TODO: Test polyfill of Object.assign
  switch (action.type) {
  case RECEIVE_PLACES:
    return Object.assign({}, state, {
      errors: action.errors,
      isFetching: false,
      places: action.places,
      query: action.query
    });
  case RECEIVE_POSITION:
    return Object.assign({}, state, {
      position: action.position
    });
  case REQUEST_PLACES:
    return Object.assign({}, state, {
      errors: [],
      isFetching: true,
      query: action.query
    });
  default:
    return state;
  }
}

export default places;
