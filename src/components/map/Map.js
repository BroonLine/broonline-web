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

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { GoogleMap, InfoWindow, Marker, withGoogleMap, withScriptjs } from 'react-google-maps';
import HeatmapLayer from 'react-google-maps/lib/components/visualization/HeatmapLayer';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ScreenReaderOnly } from '../a11y';
import * as placesActionCreators from '../../actions/places';
import Autocomplete from './autocomplete';
import Container, { Overlay } from '../container';
import Control from './control';
import Loader from '../loader';
import PlaceInfo from './placeinfo';

import './Map.css';

const InternalMap = withScriptjs(withGoogleMap(({
  autocompleteRefProvider,
  clear,
  current,
  googleMapRefProvider,
  heatmapRefProvider,
  marker,
  onClear,
  onCurrentClose,
  onMapClick,
  onMarkerClick,
  onSearch,
  onZoom,
  placeholder,
  places = [],
  position,
  searchRefProvider,
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
          ref={searchRefProvider}
          className="map__search"
          type="text"
          placeholder={placeholder}
        />
      </Autocomplete>
      <Control controlPosition={google.maps.ControlPosition.TOP_LEFT}>
        <button
          className="map__clear"
          title={clear}
          type="button"
          onClick={onClear}
        >
          <FontAwesomeIcon icon="times" />
          <ScreenReaderOnly>{clear}</ScreenReaderOnly>
        </button>
      </Control>
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
      {current && (!marker || marker.id !== current.id) && current.isOpen && <InfoWindow
        onCloseClick={onCurrentClose}
        position={current.position}
      >
        <PlaceInfo place={current.place} />
      </InfoWindow>}
      {marker && <Marker
        onClick={onMarkerClick}
        position={marker.position}
      >
        {current && current.id === marker.id && current.isOpen && <InfoWindow onCloseClick={onMarkerClick}>
          <PlaceInfo place={current.place} />
        </InfoWindow>}
      </Marker>}
    </GoogleMap>
  );
}));

InternalMap.propTypes = {
  autocompleteRefProvider: PropTypes.func,
  clear: PropTypes.string.isRequired,
  current: PropTypes.shape({
    id: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
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
    }).isRequired
  }),
  onClear: PropTypes.func,
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
  searchRefProvider: PropTypes.func,
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
    this.searchRefProvider = this.refProvider('search');
    this.onClear = this.onClear.bind(this);
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

  onClear() {
    const { clearMarker } = this.props;
    const { search } = this.state.refs;

    search.value = '';

    clearMarker();
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
    const { clearCurrent, closeCurrent, openCurrent, places, setCurrent } = this.props;
    const { current, marker } = places;
    if (!marker) {
      return;
    }

    if (!current || current.id !== marker.id) {
      clearCurrent();
      setCurrent(marker.id, marker.position);

      openCurrent();
    } else if (current.isOpen) {
      closeCurrent();
    } else {
      openCurrent();
    }

    if (event) {
      event.stop();
    }
  }

  onSearch() {
    const { clearCurrent, clearMarker, openCurrent, places, setCurrent, setMarker, setPosition, setZoom } = this.props;
    const { marker } = places;
    const { autocomplete } = this.state.refs;
    const place = autocomplete.getPlace();

    if (!(place && place.place_id)) {
      clearMarker();
    } else {
      const { location } = place.geometry;
      const position = {
        lat: location.lat(),
        lng: location.lng()
      };

      if (!marker || marker.id !== place.place_id) {
        clearCurrent();
        clearMarker();
        setMarker(place.place_id, position);
        setCurrent(place.place_id, position);
      }

      setPosition(position);
      setZoom(17);

      openCurrent();
    }
  }

  onZoom() {
    const { setZoom } = this.props;
    const { googleMap } = this.state.refs;

    setZoom(googleMap.getZoom());
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
        clear={t('map.search.clear')}
        current={places.current}
        googleMapRefProvider={this.googleMapRefProvider}
        heatmapRefProvider={this.heatmapRefProvider}
        marker={places.marker}
        onClear={this.onClear}
        onCurrentClose={this.onCurrentClose}
        onMapClick={this.onMapClick}
        onMarkerClick={this.onMarkerClick}
        onSearch={this.onSearch}
        onZoom={this.onZoom}
        placeholder={t('map.search.placeholder')}
        places={places.places}
        position={places.position}
        searchRefProvider={this.searchRefProvider}
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
  findPlaces: PropTypes.func.isRequired,
  getPosition: PropTypes.func.isRequired,
  openCurrent: PropTypes.func.isRequired,
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
