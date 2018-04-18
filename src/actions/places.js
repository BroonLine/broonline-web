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

export const ANSWER = 'ANSWER';
export const CLOSE_SELECTION = 'CLOSE_SELECTION';
export const DESELECT_PLACE = 'DESELECT_PLACE';
export const OPEN_SELECTION = 'OPEN_SELECTION';
export const RECEIVE_PLACES = 'RECEIVE_PLACES';
export const RECEIVE_POSITION = 'RECEIVE_POSITION';
export const REQUEST_PLACES = 'REQUEST_PLACES';
export const SELECT_PLACE = 'SELECT_PLACE';
export const TOGGLE_SELECTION_OPEN = 'TOGGLE_SELECTION_OPEN';

// TODO: Move fetches to internal API for reusability
// TODO: Split selection stuff into separate actions

function answer(json) {
  return {
    type: ANSWER,
    errors: json.errors || [],
    place: json.data ? json.data.place : null
  };
}

export function closeSelection() {
  return {
    type: CLOSE_SELECTION
  };
}

export function deselectPlace() {
  return {
    type: DESELECT_PLACE
  };
}

export function getPosition() {
  return (dispatch) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => dispatch(receivePosition(position.coords))
      );
    }
  };
}

export function fetchPlaces(query) {
  return (dispatch) => {
    dispatch(requestPlaces(query));

    const params = querystring.stringify(query);
    const qs = params ? `?${params}` : '';

    return fetch(url(qs))
      .then((res) => res.json())
      .then((json) => dispatch(receivePlaces(query, json)))
      .catch((error) => dispatch(receivePlaces(query, { errors: [ error ] })));
  };
}

export function openSelection() {
  return {
    type: OPEN_SELECTION
  };
}

export function postAnswer(place, value) {
  return (dispatch) => {
    const { latitude, longitude } = place.position;
    const params = querystring.stringify({
      answer: value,
      position: [ latitude, longitude ].join(',')
    });
    const qs = params ? `?${params}` : '';

    return fetch(url(`/${place.id}/answer${qs}`), { method: 'POST' })
      .then((res) => res.json())
      .then((json) => dispatch(answer(json)))
      .catch((error) => dispatch(answer({ errors: [ error ] })));
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

export function selectPlace(place) {
  return {
    type: SELECT_PLACE,
    place
  };
}

export function toggleSelectionOpen() {
  return {
    type: TOGGLE_SELECTION_OPEN
  };
}

function url(str) {
  return `${process.env.REACT_APP_API_HOST}/places${str}`;
}
