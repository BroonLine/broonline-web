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
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';
import { translate } from 'react-i18next';
import fontAwesome from '@fortawesome/fontawesome';
import fontAwesomeBrands from '@fortawesome/fontawesome-free-brands';
import fontAwesomeSolid from '@fortawesome/fontawesome-free-solid';

import 'normalize.css';

import ErrorBoundary from '../../components/errorboundary';
import Map from '../../components/map';
import NavBar from '../../components/navbar';
import i18n from '../../i18n';

import './App.css';

fontAwesome.library.add(fontAwesomeBrands, fontAwesomeSolid);

class App extends Component {

  render() {
    const { t } = this.props;

    return (
      <Fragment>
        <Helmet>
          <html lang={i18n.language} />

          <title>{t('title')}</title>

          <meta name="description" content={t('description')} />
        </Helmet>

        <NavBar />

        <main>
          <ErrorBoundary>
            <Map />
          </ErrorBoundary>
        </main>
      </Fragment>
    );
  }

}

App.propTypes = {
  t: PropTypes.func.isRequired
};

export default translate()(App);
