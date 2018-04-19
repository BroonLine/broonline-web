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

import canUseDOM from 'can-use-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { componentWillUnmount } from 'react-google-maps/lib/utils/MapChildHelper';

import { MAP } from 'react-google-maps/lib/constants';

/**
 * A wrapper around any component as a control on the map
 *
 * @see https://developers.google.com/maps/documentation/javascript/reference/3.exp/#control
 */
export class Control extends PureComponent {
  static propTypes = {
    /**
     * Where to put `<Control>` inside a `<GoogleMap>`
     *
     * @example google.maps.ControlPosition.TOP_LEFT
     * @type number
     */
    controlPosition: PropTypes.number
  }

  static contextTypes = {
    [MAP]: PropTypes.object,
  }

  componentWillMount() {
    if (!canUseDOM || this.containerElement) {
      return;
    }
    this.containerElement = document.createElement('div');
    this.handleRenderChildToContainerElement();
    if (React.version.match(/^16/)) {
      return;
    }
  }

  componentDidMount() {
    this.handleMountAtControlPosition();
  }

  componentWillUpdate(nextProp) {
    if (this.props.controlPosition !== nextProp.controlPosition) {
      this.handleUnmountAtControlPosition();
    }
  }

  componentDidUpdate(prevProps) {
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
}

export default Control;

const isValidControlPosition = _.isNumber;
