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

import * as places from '../api/places';

export const ANSWER = 'ANSWER';
export const CLOSE_SELECTION = 'CLOSE_SELECTION';
export const DESELECT_PLACE = 'DESELECT_PLACE';
export const OPEN_SELECTION = 'OPEN_SELECTION';
export const RECEIVE_PLACES = 'RECEIVE_PLACES';
export const RECEIVE_POSITION = 'RECEIVE_POSITION';
export const REQUEST_PLACES = 'REQUEST_PLACES';
export const SELECT_PLACE = 'SELECT_PLACE';
export const TOGGLE_SELECTION_OPEN = 'TOGGLE_SELECTION_OPEN';

// TODO: Split selection stuff into separate actions

export function addAnswer(placeId, value) {
  return async(dispatch) => {
    const result = await places.addAnswer(placeId, { value });

    dispatch(answer(result));
  };
}

function answer(result) {
  return {
    type: ANSWER,
    errors: result.errors || [],
    place: result.data ? result.data.place : null
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

export function findPlaces(query) {
  return async(dispatch) => {
    dispatch(requestPlaces(query));

    const result = await places.find(query);

    dispatch(receivePlaces(query, result));
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

export function openSelection() {
  return {
    type: OPEN_SELECTION
  };
}

function receivePlaces(query, result) {
  return {
    type: RECEIVE_PLACES,
    errors: result.errors || [],
    places: (result.data && result.data.places) || [],
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
