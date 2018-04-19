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

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { ScreenReaderOnly } from '../a11y';

import './ProgressBar.css';

class ProgressBar extends Component {

  render() {
    const { children, max, min, status, value } = this.props;
    const minValue = min != null ? min : Math.min(value, 0);
    const maxValue = max != null ? max : Math.max(value, 100);
    const formattedValue = `${value}%`;

    return (
      <div
        className={`progress__bar progress__bar--${status || 'default'}`}
        style={{ width: formattedValue }}
        title={formattedValue}
        role="progressbar"
        aria-valuemax={maxValue}
        aria-valuemin={minValue}
        aria-valuenow={value}
      >
        {children}
        <ScreenReaderOnly>
          &nbsp;
          {formattedValue}
        </ScreenReaderOnly>
      </div>
    );
  }

}

ProgressBar.propTypes = {
  children: PropTypes.any,
  max: PropTypes.number,
  min: PropTypes.number,
  status: PropTypes.oneOf([ 'default', 'negative', 'positive' ]),
  value: PropTypes.number.isRequired
};

export default ProgressBar;
