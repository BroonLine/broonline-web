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
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import 'typeface-roboto/index.css';

import * as placesActionCreators from '../../actions/places';
import Autocomplete from './Autocomplete';

import './Map.css';

const InternalMap = withScriptjs(withGoogleMap(({
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
            className="map-search"
            type="text"
            placeholder="Find a chippie"
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
    return (
      <InternalMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=places,visualization&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&signed_in=true`}
        containerElement={<div className="map-container" />}
        loadingElement={<div className="map-loading">Loading</div>}
        mapElement={<div className="map" />}
        places={this.props.places.places}
      />
    );
  }

}

Map.propTypes = {
  fetchPlaces: PropTypes.func.isRequired,
  places: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  places: state.places
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(placesActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
