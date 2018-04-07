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

// TODO: Remove workaround once available in react-google-maps

/* global google */

import canUseDOM from 'can-use-dom';
import invariant from 'invariant';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import {
  construct,
  componentDidMount,
  componentDidUpdate,
  componentWillUnmount,
} from 'react-google-maps/lib/utils/MapChildHelper';

import { MAP } from 'react-google-maps/lib/constants';

const AUTO_COMPLETE = '__SECRET_AUTO_COMPLETE_DO_NOT_USE_OR_YOU_WILL_BE_FIRED';

/**
 * A wrapper around `google.maps.places.Autocomplete` on the map
 *
 * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Autocomplete
 */
export class Autocomplete extends PureComponent {
  static propTypes = {
    /**
     * Where to put `<Autocomplete>` inside a `<GoogleMap>`
     *
     * @example google.maps.ControlPosition.TOP_LEFT
     * @type number
     */
    controlPosition: PropTypes.number,

    /**
     * @type LatLngBounds|LatLngBoundsLiteral
     */
    defaultBounds: PropTypes.any,

    /**
     * @type ComponentRestrictions
     */
    defaultComponentRestrictions: PropTypes.any,

    /**
     * @type AutocompleteOptions
     */
    defaultOptions: PropTypes.any,

    /**
     * @type Array<string>
     */
    defaultTypes: PropTypes.any,

    /**
     * @type LatLngBounds|LatLngBoundsLiteral
     */
    bounds: PropTypes.any,

    /**
     * @type ComponentRestrictions
     */
    componentRestrictions: PropTypes.any,

    /**
     * @type AutocompleteOptions
     */
    options: PropTypes.any,

    /**
     * @type Array<string>
     */
    types: PropTypes.any,

    /**
     * function
     */
    onPlaceChanged: PropTypes.func
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  state = {
    [AUTO_COMPLETE]: null,
  }

  componentWillMount() {
    if (!canUseDOM || this.containerElement) {
      return;
    }
    invariant(google.maps.places, 'Did you include "libraries=places" in the URL?');
    this.containerElement = document.createElement('div');
    this.handleRenderChildToContainerElement();
    if (React.version.match(/^16/)) {
      return;
    }
    this.handleInitializeAutocomplete();
  }

  componentDidMount() {
    let autocomplete = this.state[AUTO_COMPLETE];
    if (React.version.match(/^16/)) {
      autocomplete = this.handleInitializeAutocomplete();
    }
    componentDidMount(this, autocomplete, eventMap);
    this.handleMountAtControlPosition();
  }

  componentWillUpdate(nextProp) {
    if (this.props.controlPosition !== nextProp.controlPosition) {
      this.handleUnmountAtControlPosition();
    }
  }

  componentDidUpdate(prevProps) {
    componentDidUpdate(this, this.state[AUTO_COMPLETE], eventMap, updaterMap, prevProps);
    if (this.props.children !== prevProps.children) {
      this.handleRenderChildToContainerElement();
    }
    if (this.props.controlPosition !== prevProps.controlPosition) {
      this.handleMountAtControlPosition();
    }
  }

  componentWillUnmount() {
    componentWillUnmount(this);
    this.handleUnmountAtControlPosition();
    if (React.version.match(/^16/)) {
      return;
    }
    if (this.containerElement) {
      ReactDOM.unmountComponentAtNode(this.containerElement);
      this.containerElement = null;
    }
  }

  handleInitializeAutocomplete() {
    /*
     * @see https://developers.google.com/maps/documentation/javascript/3.exp/reference#Autocomplete
     */
    const autocomplete = new google.maps.places.Autocomplete(this.containerElement.querySelector('input'),
        this.props.options);
    construct(Autocomplete.propTypes, updaterMap, this.props, autocomplete);
    this.setState({
      [AUTO_COMPLETE]: autocomplete,
    });
    return autocomplete;
  }

  handleRenderChildToContainerElement() {
    if (React.version.match(/^16/)) {
      return;
    }
    ReactDOM.unstable_renderSubtreeIntoContainer(this, React.Children.only(this.props.children), this.containerElement);
  }

  handleMountAtControlPosition() {
    if (isValidControlPosition(this.props.controlPosition)) {
      this.mountControlIndex = -1 + this.context[MAP].controls[this.props.controlPosition].push(
          this.containerElement.firstChild);
    }
  }

  handleUnmountAtControlPosition() {
    if (isValidControlPosition(this.props.controlPosition)) {
      const child = this.context[MAP].controls[this.props.controlPosition].removeAt(this.mountControlIndex);
      if (child !== undefined) {
        this.containerElement.appendChild(child);
      }
    }
  }

  render() {
    if (React.version.match(/^16/)) {
      return ReactDOM.createPortal(React.Children.only(this.props.children), this.containerElement);
    }
    return false;
  }

  /**
   * Returns the bounds to which query predictions are biased.
   * @type LatLngBounds
   * @public
   */
  getBounds() {
    return this.state[AUTO_COMPLETE].getBounds();
  }

  /**
   * Returns the query selected by the user, or `null` if no places have been found yet, to be used with `places_changed` event.
   * @type Array<PlaceResult>nullplaces_changed
   * @public
   */
  getPlaces() {
    return this.state[AUTO_COMPLETE].getPlaces();
  }
}

export default Autocomplete;

const isValidControlPosition = _.isNumber;

const eventMap = {
  onPlacesChanged: 'places_changed'
};

const updaterMap = {
  bounds(instance, bounds) {
    instance.setBounds(bounds);
  }
};
