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
import Button from '../../button';
import Progress, { ProgressBar } from '../../progress';

import './PlaceInfo.css';

// TODO: Implement addAnswer support
// TODO: Handle requesting state
// TODO: Handle local/session/persisted answer state to avoid duplicate answers

class PlaceInfo extends Component {

  render() {
    const { place, t } = this.props;

    const total = place.answers.no + place.answers.yes;
    const percentages = {
      no: Math.round((place.answers.no / total) * 100),
      yes: Math.round((place.answers.yes / total) * 100)
    };
    const progressBars = [];
    if (percentages.yes > 0) {
      progressBars.push(<ProgressBar key="yes" status="positive" value={percentages.yes}>
        {t('placeInfo.answer.yes')}
      </ProgressBar>);
    }
    if (percentages.no > 0) {
      progressBars.push(<ProgressBar key="no" status="negative" value={percentages.no}>
        {t('placeInfo.answer.no')}
      </ProgressBar>);
    }

    return (
      <div className="place-info">
        <h2 className="place-info__name">{place.name}</h2>
        <p className="place-info__address">{place.address}</p>

        <p className="place-info__question">{t('placeInfo.question')}</p>

        <Progress>{progressBars}</Progress>

        <div className="place-info__actions">
          <Button status="positive">
            <FontAwesomeIcon icon="check" />
            &nbsp;
            {t('placeInfo.answer.yes')}
          </Button>
          &nbsp;
          <Button status="negative">
            <FontAwesomeIcon icon="times" />
            &nbsp;
            {t('placeInfo.answer.no')}
          </Button>
        </div>
      </div>
    );
  }

}

PlaceInfo.propTypes = {
  addAnswer: PropTypes.func.isRequired,
  place: PropTypes.object.isRequired,
  places: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  places: state.places
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(placesActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(PlaceInfo));
