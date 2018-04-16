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

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as placesActionCreators from '../../../actions/places';
import Progress, { ProgressBar } from '../../progress';

import './PlaceInfo.css';

// TODO: Implement postAnswer support
// TODO: Handle requesting state
// TODO: Handle local/session/persisted answer state to avoid duplicate answers

class PlaceInfo extends Component {

  render() {
    const { places, t } = this.props;
    const { selected } = places;
    const entry = places.mapping[selected.place_id];
    const place = entry ? entry.place : null;
    // TODO: Remove debug
    window.console.log(place);
    const answers = {
      no: place ? place.answers.no : 0,
      yes: place ? place.answers.yes : 0
    };
    const total = answers.no + answers.yes;
    const percentages = {
      no: Math.round((answers.no / total) * 100),
      yes: Math.round((answers.yes / total) * 100)
    };

    return (
      <div className="place-info">
        <h2 className="place-info__name">{selected.name}</h2>
        <p className="place-info__address">{selected.formatted_address}</p>

        <p className="place-info__question">{t('placeInfo.question')}</p>
        <div className="place-info__answer" role="group">
          <button type="button">
            <FontAwesomeIcon icon="check" />
            {t('placeInfo.answer.yes')}
          </button>
          <button type="button">
            <FontAwesomeIcon icon="times" />
            {t('placeInfo.answer.no')}
          </button>
        </div>

        <Progress>
          <ProgressBar status="success" value={percentages.yes}>
            {t('placeInfo.answer.yes')}
          </ProgressBar>
          <ProgressBar status="danger" value={percentages.no}>
            {t('placeInfo.answer.no')}
          </ProgressBar>
        </Progress>
      </div>
    );
  }

}

PlaceInfo.propTypes = {
  places: PropTypes.object.isRequired,
  postAnswer: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  places: state.places
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(placesActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PlaceInfo));
