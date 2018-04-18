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
export const OPENED_SELECTION = 'OPENED_SELECTION';
export const RECEIVE_PLACES = 'RECEIVE_PLACES';
export const REQUEST_PLACES = 'REQUEST_PLACES';
export const SELECT_PLACE = 'SELECT_PLACE';
export const SET_POSITION = 'SET_POSITION';

// TODO: Split selection stuff into separate actions

export function addAnswer(id, value) {
  return async(dispatch) => {
    const result = await places.addAnswer(id, { value });

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
        (position) => dispatch(setPositionInternal(position.coords))
      );
    }
  };
}

export function openSelection() {
  return openSelectionInternal;
}

async function openSelectionInternal(dispatch, getState) {
  dispatch(openingSelection());

  const state = getState();
  const { selected } = state.places;
  const result = selected.place ? {
    data: {
      place: selected.place
    }
  } : await places.findById(selected.id, { expand: true });

  dispatch(openedSelection(result));
}

function openedSelection(result) {
  return {
    type: OPENED_SELECTION,
    errors: result.errors || [],
    place: result.data ? result.data.place : null
  };
}

function openingSelection() {
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

function requestPlaces(query) {
  return {
    type: REQUEST_PLACES,
    query
  };
}

export function selectPlace(id, location) {
  return {
    type: SELECT_PLACE,
    id,
    location
  };
}

export function setPosition(position) {
  return (dispatch) => dispatch(setPositionInternal(position));
}

function setPositionInternal(position) {
  return {
    type: SET_POSITION,
    position: {
      lat: position.lat != null ? position.lat : position.latitude,
      lng: position.lng != null ? position.lng : position.longitude
    }
  };
}

export function toggleSelectionOpen() {
  return async(dispatch, getState) => {
    const state = getState();

    if (state.places.openSelected) {
      dispatch(closeSelection());
    } else {
      await openSelectionInternal(dispatch, getState);
    }
  };
}
