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

import querystring from 'querystring';

import fetch from '../fetch';

export const RECEIVE_PLACES = 'RECEIVE_PLACES';
export const RECEIVE_POSITION = 'RECEIVE_POSITION';
export const REQUEST_PLACES = 'REQUEST_PLACES';

export function getPosition() {
  return (dispatch) => {
    const defaultAction = receivePosition({
      latitude: 56.074968,
      longitude: -3.4633847
    });

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => dispatch(receivePosition(position.coords)),
        () => dispatch(defaultAction)
      );
    } else {
      dispatch(defaultAction);
    }
  };
}

export function fetchPlaces(query) {
  return (dispatch) => {
    dispatch(requestPlaces(query));

    const params = querystring.stringify(query);

    return fetch(url(params ? `?${params}` : ''))
      .then((res) => res.json())
      .then((json) => dispatch(receivePlaces(query, json)))
      .catch((error) => dispatch(receivePlaces(query, { errors: [ error ] })));
  };
}

function receivePlaces(query, json) {
  return {
    type: RECEIVE_PLACES,
    errors: json.errors || [],
    places: (json.data && json.data.places) || [],
    query
  };
}

function receivePosition(coords) {
  return {
    type: RECEIVE_POSITION,
    position: {
      lat: coords.latitude,
      lng: coords.longitude
    }
  };
}

function requestPlaces(query) {
  return {
    type: REQUEST_PLACES,
    query
  };
}

function url(str) {
  return `${process.env.REACT_APP_API_HOST}/places${str}`;
}
