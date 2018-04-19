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
import { GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as placesActionCreators from '../../actions/places';
import Autocomplete from './autocomplete';
import Container, { Overlay } from '../container';
import Loader from '../loader';
import PlaceInfo from './placeinfo';

import './Map.css';

const InternalMap = withScriptjs(withGoogleMap(({
  autocompleteRefProvider,
  current,
  googleMapRefProvider,
  heatmapRefProvider,
  marker,
  onCurrentClose,
  onMapClick,
  onMarkerClick,
  onSearch,
  onZoom,
  placeholder,
  places = [],
  position,
  zoom
}) => {
  const data = places.map((place) => {
    return new google.maps.LatLng(place.position.latitude, place.position.longitude);
  });

  return (
    <GoogleMap
      ref={googleMapRefProvider}
      center={position}
      defaultOptions={{
        fullscreenControl: false,
        mapTypeControl: false
      }}
      onClick={onMapClick}
      onZoomChanged={onZoom}
      zoom={zoom}
    >
      <Autocomplete
        ref={autocompleteRefProvider}
        controlPosition={google.maps.ControlPosition.TOP_LEFT}
        onPlaceChanged={onSearch}
        options={{
          types: [ 'establishment' ]
        }}
      >
        <input
          className="map__search"
          type="text"
          placeholder={placeholder}
        />
      </Autocomplete>
      <HeatmapLayer
        ref={heatmapRefProvider}
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
      {current && current.isOpen && <InfoWindow
        onCloseClick={onCurrentClose}
        position={current.position}
      >
        <PlaceInfo place={current.place} />
      </InfoWindow>}
      {marker && <Marker
        onClick={onMarkerClick}
        position={marker.position}
      >
        {marker.isOpen && <InfoWindow onCloseClick={onMarkerClick}>
          <PlaceInfo place={marker.place} />
        </InfoWindow>}
      </Marker>}
    </GoogleMap>
  );
}));

InternalMap.propTypes = {
  autocompleteRefProvider: PropTypes.func,
  current: PropTypes.shape({
    id: PropTypes.string.isRequired,
    position: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    }).isRequired,
    place: PropTypes.object
  }),
  googleMapRefProvider: PropTypes.func,
  heatmapRefProvider: PropTypes.func,
  marker: PropTypes.shape({
    id: PropTypes.string.isRequired,
    position: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired
    }).isRequired,
    place: PropTypes.object
  }),
  onCurrentClose: PropTypes.func,
  onMapClick: PropTypes.func,
  onMarkerClick: PropTypes.func,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string.isRequired,
  places: PropTypes.array,
  position: PropTypes.shape({
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired
  }),
  zoom: PropTypes.number
};

class Map extends Component {

  constructor(props) {
    super(props);

    this.state = {
      refs: {}
    };

    this.autocompleteRefProvider = this.refProvider('autocomplete');
    this.googleMapRefProvider = this.refProvider('googleMap');
    this.heatmapRefProvider = this.refProvider('heatmap');
    this.onCurrentClose = this.onCurrentClose.bind(this);
    this.onMapClick = this.onMapClick.bind(this);
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onZoom = this.onZoom.bind(this);
    this.refProvider = this.refProvider.bind(this);
  }

  componentDidMount() {
    const { findPlaces, getPosition } = this.props;

    findPlaces({ dominant: 'yes' });
    getPosition();
  }

  onCurrentClose(event) {
    const { closeCurrent } = this.props;

    closeCurrent();

    if (event) {
      event.stop();
    }
  }

  onMapClick(event) {
    const { placeId } = event;
    if (!placeId) {
      return;
    }

    const { clearCurrent, closeCurrent, openCurrent, places, setCurrent } = this.props;
    const { current } = places;
    const { latLng: location } = event;
    const position = {
      lat: location.lat(),
      lng: location.lng()
    };

    if (current) {
      if (current.id !== placeId) {
        clearCurrent();
        setCurrent(placeId, position);

        openCurrent();
      } else if (current.isOpen) {
        closeCurrent();
      } else {
        openCurrent();
      }
    } else {
      setCurrent(placeId, position);

      openCurrent();
    }

    if (event) {
      event.stop();
    }
  }

  onMarkerClick(event) {
    const { closeMarker, places, openMarker } = this.props;
    const { marker } = places;
    if (!marker) {
      return;
    }

    if (marker.isOpen) {
      closeMarker();
    } else {
      openMarker();
    }

    if (event) {
      event.stop();
    }
  }

  onSearch() {
    const { clearMarker, openMarker, places, setMarker, setPosition, setZoom } = this.props;
    const { marker } = places;
    const place = this.state.refs.autocomplete.getPlace();

    if (!(place && place.place_id)) {
      clearMarker();
    } else {
      const { location } = place.geometry;
      const position = {
        lat: location.lat(),
        lng: location.lng()
      };

      if (!marker || marker.id !== place.place_id) {
        clearMarker();
        setMarker(place.place_id, position);
      }

      setPosition(position);
      setZoom(17);

      openMarker();
    }
  }

  onZoom() {
    const { setZoom } = this.props;

    setZoom(this.state.refs.googleMap.getZoom());
  }

  refProvider(name) {
    return (ref) => {
      this.setState((prevState) => ({
        refs: Object.assign({}, prevState.refs, {
          [name]: ref
        })
      }));
    };
  }

  render() {
    const { places, t } = this.props;

    const loader = <Container center>
      <Overlay>
        <Loader />
      </Overlay>
    </Container>;

    if (places.isFetching) {
      return loader;
    }

    return (
      <InternalMap
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3&libraries=places,visualization&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`}
        containerElement={<Container />}
        loadingElement={loader}
        mapElement={<div className="map" />}
        autocompleteRefProvider={this.autocompleteRefProvider}
        current={places.current}
        googleMapRefProvider={this.googleMapRefProvider}
        heatmapRefProvider={this.heatmapRefProvider}
        marker={places.marker}
        onCurrentClose={this.onCurrentClose}
        onMapClick={this.onMapClick}
        onMarkerClick={this.onMarkerClick}
        onSearch={this.onSearch}
        onZoom={this.onZoom}
        placeholder={t('map.search.placeholder')}
        places={places.places}
        position={places.position}
        zoom={places.zoom}
      />
    );
  }

}

Map.propTypes = {
  addAnswer: PropTypes.func.isRequired,
  clearCurrent: PropTypes.func.isRequired,
  clearMarker: PropTypes.func.isRequired,
  closeCurrent: PropTypes.func.isRequired,
  closeMarker: PropTypes.func.isRequired,
  findPlaces: PropTypes.func.isRequired,
  getPosition: PropTypes.func.isRequired,
  openCurrent: PropTypes.func.isRequired,
  openMarker: PropTypes.func.isRequired,
  places: PropTypes.object.isRequired,
  setCurrent: PropTypes.func.isRequired,
  setMarker: PropTypes.func.isRequired,
  setPosition: PropTypes.func.isRequired,
  setZoom: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  places: state.places
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(placesActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(translate()(Map));
