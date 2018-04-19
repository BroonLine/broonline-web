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
export const CLEAR_CURRENT = 'CLEAR_CURRENT';
export const CLEAR_MARKER = 'CLEAR_MARKER';
export const CLOSED_CURRENT = 'CLOSED_CURRENT';
export const CLOSED_MARKER = 'CLOSED_MARKER';
export const OPENED_CURRENT = 'OPENED_CURRENT';
export const OPENED_MARKER = 'OPENED_MARKER';
export const RECEIVE_PLACES = 'RECEIVE_PLACES';
export const REQUEST_PLACES = 'REQUEST_PLACES';
export const SET_CURRENT = 'SET_CURRENT';
export const SET_MARKER = 'SET_MARKER';
export const SET_POSITION = 'SET_POSITION';
export const SET_ZOOM = 'SET_ZOOM';

// TODO: Split current & marker actions into separate namespaces/files?

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

export function clearCurrent() {
  return {
    type: CLEAR_CURRENT
  };
}

export function clearMarker() {
  return {
    type: CLEAR_MARKER
  };
}

export function closeCurrent() {
  return (dispatch, getState) => {
    const state = getState();
    const { current } = state.places;

    if (current) {
      dispatch(closedCurrent());
    }
  };
}

export function closeMarker() {
  return (dispatch, getState) => {
    const state = getState();
    const { marker } = state.places;

    if (marker) {
      dispatch(closedMarker());
    }
  };
}

function closedCurrent() {
  return {
    type: CLOSED_CURRENT
  };
}

function closedMarker() {
  return {
    type: CLOSED_MARKER
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
        (position) => dispatch(setPosition(position.coords))
      );
    }
  };
}

export function openCurrent() {
  return async(dispatch, getState) => {
    const state = getState();
    const { current } = state.places;
    if (!current) {
      return;
    }

    closeMarker()(dispatch, getState);

    const result = current.place ? {
      data: {
        place: current.place
      }
    } : await places.findById(current.id, { expand: true });

    dispatch(openedCurrent(result));
  };
}

export function openMarker() {
  return async(dispatch, getState) => {
    const state = getState();
    const { marker } = state.places;
    if (!marker) {
      return;
    }

    closeCurrent()(dispatch, getState);

    const result = marker.place ? {
      data: {
        place: marker.place
      }
    } : await places.findById(marker.id, { expand: true });

    dispatch(openedMarker(result));
  };
}

function openedCurrent(result) {
  return {
    type: OPENED_CURRENT,
    errors: result.errors || [],
    place: result.data ? result.data.place : null
  };
}

function openedMarker(result) {
  return {
    type: OPENED_MARKER,
    errors: result.errors || [],
    place: result.data ? result.data.place : null
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

export function setCurrent(id, position) {
  return {
    type: SET_CURRENT,
    id,
    position: {
      lat: position.lat != null ? position.lat : position.latitude,
      lng: position.lng != null ? position.lng : position.longitude
    }
  };
}

export function setMarker(id, position) {
  return {
    type: SET_MARKER,
    id,
    position: {
      lat: position.lat != null ? position.lat : position.latitude,
      lng: position.lng != null ? position.lng : position.longitude
    }
  };
}

export function setPosition(position) {
  return {
    type: SET_POSITION,
    position: {
      lat: position.lat != null ? position.lat : position.latitude,
      lng: position.lng != null ? position.lng : position.longitude
    }
  };
}

export function setZoom(zoom) {
  return {
    type: SET_ZOOM,
    zoom
  };
}
