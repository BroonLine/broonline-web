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

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { GoogleMap, withGoogleMap, withScriptjs } from 'react-google-maps';
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as placesActionCreators from '../../actions/places';
import Autocomplete from './Autocomplete';
import Container, { Overlay } from '../container';
import Loader from '../loader';

import './Map.css';

const InternalMap = withScriptjs(withGoogleMap(({
  placeholder,
  places = [],
  position,
  zoom = 8
}) => {
  const data = places.map((place) => {
    return new google.maps.LatLng(place.position.latitude, place.position.longitude);
  });

  return (
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
  );
}));

InternalMap.propTypes = {
  placeholder: PropTypes.string.isRequired,
  places: PropTypes.array,
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }).isRequired,
  zoom: PropTypes.number
};

class Map extends Component {

  componentDidMount() {
    const { fetchPlaces, getPosition } = this.props;

    fetchPlaces({ dominant: 'yes' });
    getPosition();
  }

  render() {
    const { places, t } = this.props;

    const loader = <Container center>
      <Overlay>
        <Loader />
      </Overlay>
    </Container>;

    if (places.isFetching || !places.position) {
      return loader;
    }

    return (
      <InternalMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3&libraries=places,visualization&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
        containerElement={<Container />}
        loadingElement={loader}
        mapElement={<div className="map" />}
        placeholder={t('map.search.placeholder')}
        places={places.places}
        position={places.position}
      />
    );
  }

}

Map.propTypes = {
  fetchPlaces: PropTypes.func.isRequired,
  getPosition: PropTypes.func.isRequired,
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
