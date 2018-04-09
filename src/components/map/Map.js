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

/* global google */

// TODO: Derive position from geolocation if possible

import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { GoogleMap, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as placesActionCreators from '../../actions/places';
import Autocomplete from './Autocomplete';
import Container, { Overlay } from '../container';

import './Map.css';

const InternalMap = withScriptjs(withGoogleMap(({
  placeholder,
  places = [],
  position = { lat: 55.9410656, lng: -3.2053836 },
  zoom = 8
}) => {
  const data = places.map((place) => {
    return new google.maps.LatLng(place.position.latitude, place.position.longitude);
  });

  // TODO: Localize
  return (
    <Fragment>
      <GoogleMap
        defaultCenter={position}
        defaultZoom={zoom}
      >
        <Autocomplete
          controlPosition={google.maps.ControlPosition.TOP_LEFT}
        >
          <input
            className="map__search"
            type="text"
            placeholder={placeholder}
          />
        </Autocomplete>
        <HeatmapLayer
          data={data}
          options={{
            gradient: [
              'rgba(160, 82, 45, 0)',
              'rgba(160, 82, 45, 0)',
              'rgba(160, 82, 45, 1)',
              'rgba(160, 82, 45, 1)',
              'rgba(160, 82, 45, 1)',
              'rgba(160, 82, 45, 1)',
              'rgba(160, 82, 45, 1)',
              'rgba(160, 82, 45, 1)',
              'rgba(160, 82, 45, 1)',
              'rgba(160, 82, 45, 1)',
              'rgba(160, 82, 45, 1)',
              'rgba(160, 82, 45, 1)',
              'rgba(160, 82, 45, 1)',
              'rgba(160, 82, 45, 1)'
            ],
            maxIntensity: 1,
            opacity: 0.75,
            radius: 25
          }}
        />
      </GoogleMap>
    </Fragment>
  );
}));

InternalMap.propTypes = {
  placeholder: PropTypes.string.isRequired,
  places: PropTypes.array,
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }),
  zoom: PropTypes.number
};

class Map extends Component {

  componentDidMount() {
    const { fetchPlaces } = this.props;

    fetchPlaces({ dominant: 'yes' });
  }

  render() {
    const { places, t } = this.props;

    return (
      <InternalMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places,visualization&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
        containerElement={<Container />}
        loadingElement={<div className="map-loading">Loading</div>}
        mapElement={<div className="map" />}
        placeholder={t('map.search.placeholder')}
        places={places.places}
      />
    );
  }

}

Map.propTypes = {
  fetchPlaces: PropTypes.func.isRequired,
  places: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  places: state.places
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(placesActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Map));
