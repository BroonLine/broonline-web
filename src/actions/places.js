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

export const CLEAR_CURRENT = 'CLEAR_CURRENT';
export const CLEAR_MARKER = 'CLEAR_MARKER';
export const CLOSED_CURRENT = 'CLOSED_CURRENT';
export const CONFIRM_ANSWER = 'CONFIRM_ANSWER';
export const FAIL = 'FAIL';
export const OPENED_CURRENT = 'OPENED_CURRENT';
export const RECEIVE_PLACES = 'RECEIVE_PLACES';
export const REQUEST_PLACES = 'REQUEST_PLACES';
export const SEND_ANSWER = 'SEND_ANSWER';
export const SET_CURRENT = 'SET_CURRENT';
export const SET_MARKER = 'SET_MARKER';
export const SET_POSITION = 'SET_POSITION';
export const SET_ZOOM = 'SET_ZOOM';

export function addAnswer(id, value) {
  return async(dispatch) => {
    dispatch(sendAnswer());

    const result = await places.addAnswer(id, { answer: value });

    dispatch(handleErrors(result, () => confirmAnswer(result)));
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

function closedCurrent() {
  return {
    type: CLOSED_CURRENT
  };
}

function confirmAnswer(result) {
  return {
    type: CONFIRM_ANSWER,
    place: result
  };
}

export function fail(errors) {
  return {
    type: FAIL,
    errors: errors || []
  };
}

export function findPlaces(query) {
  return async(dispatch) => {
    dispatch(requestPlaces(query));

    const result = await places.find(query);

    dispatch(handleErrors(result, () => receivePlaces(query, result)));
  };
}

export function getPosition() {
  return (dispatch) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        dispatch(setPosition([ latitude, longitude ]))
      });
    }
  };
}

function handleErrors(result, actionProvider) {
  const { errors } = result;

  if (errors && errors.length) {
    return fail(errors);
  }

  return actionProvider(result);
}

export function openCurrent() {
  return async(dispatch, getState) => {
    const state = getState();
    const { current } = state.places;
    if (!current) {
      return;
    }

    const result = current.place || await places.findById(current.id, { expand: true });

    dispatch(handleErrors(result, () => openedCurrent(result)));
  };
}

function openedCurrent(result) {
  return {
    type: OPENED_CURRENT,
    place: result
  };
}

function receivePlaces(query, result) {
  return {
    type: RECEIVE_PLACES,
    places: result.content || [],
    query
  };
}

function requestPlaces(query) {
  return {
    type: REQUEST_PLACES,
    query
  };
}

function sendAnswer() {
  return {
    type: SEND_ANSWER
  };
}

export function setCurrent(id, position) {
  return {
    type: SET_CURRENT,
    id,
    position: position.slice()
  };
}

export function setMarker(id, position) {
  return {
    type: SET_MARKER,
    id,
    position: position.slice()
  };
}

export function setPosition(position) {
  return {
    type: SET_POSITION,
    position: position.slice()
  };
}

export function setZoom(zoom) {
  return {
    type: SET_ZOOM,
    zoom
  };
}
