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

// TODO: Complete

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import './Button.css';

class Button extends Component {

  render() {
    const { children, disabled, onClick, status, type } = this.props;

    return (
      <button
        className={`button button--${status || 'default'}`}
        disabled={disabled}
        onClick={onClick}
        tabIndex={disabled ? -1 : null}
        type={type || 'button'}
        aria-disabled={disabled}
      >
        {children}
      </button>
    );
  }

}

Button.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ])),
    PropTypes.element,
    PropTypes.string
  ]),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  status: PropTypes.oneOf([ 'default', 'negative', 'positive' ]),
  type: PropTypes.oneOf([ 'button', 'reset', 'submit' ])
};

export default Button;
