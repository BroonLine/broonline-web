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
import ReactGA from 'react-ga';
import { translate } from 'react-i18next';

import Container, { Overlay } from '../container';

class ErrorBoundary extends Component {

  constructor(props) {
    super(props);

    this.state = { hasError: false };
  }

  componentDidCatch(error) {
    this.setState({ hasError: true });

    ReactGA.exception({
      description: error.message,
      fatal: true
    });
  }

  render() {
    const { hasError } = this.state;
    const { t } = this.props;

    if (hasError) {
      return (
        <Container center>
          <Overlay>
            <h1>{t('error.header')}</h1>
            <p>{t('error.message')}</p>
          </Overlay>
        </Container>
      );
    }

    return this.props.children;
  }

}

ErrorBoundary.propTypes = {
  children: PropTypes.any,
  t: PropTypes.func.isRequired
};

export default translate()(ErrorBoundary);
