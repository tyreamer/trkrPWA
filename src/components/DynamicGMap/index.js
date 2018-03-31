import React, { Component} from 'react';
import { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from "react-google-maps";
import Spinner from '../Misc/Spinner'

class DynamicGMap extends Component {

    state = {
        markers: [],
        loading: false
    }

    componentWillMount() {
        this.generateMarkers(this.props.trekDays).then((markers) => {
            this.setState({ markers: markers })
        })
    }
        
    generateMarkers(days) {
        //Marker logic
        var result = [];

        return new Promise(function (resolve, reject) {
            if (days !== undefined && days !== null) {
                for (var i = 0; i < days.length; i++) {
                    if (days[i].stops !== null && days[i].stops !== undefined) {
                        for (var j = 0; j < days[i].stops.length; j++) {
                            var stopName = days[i].stops[j].stopName
                            setTimeout(function () {
                                geocodeByAddress(stopName)
                                    .then(results => getLatLng(results[0])
                                        .then(latLngResults => {
                                            if (latLngResults != undefined && latLngResults != null) {
                                                result.push({ lat: latLngResults.lat, lng: latLngResults.lng })
                                            }
                                        }))
                            }
                            , 1000)
                        }
                    }
                }

                return resolve(result)
            }    
        })   
    }

    render() {
        console.log('m', this.state.markers)

        if (this.state.markers.length == 0) return (<Spinner />);
        
        return (
            <Map markers={this.state.markers}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
            />    
        )
    }    
}

const Map = withGoogleMap(props => (
    <GoogleMap
        ref={props.onMapLoad}
        zoom={13}
        center={{ lat: 21.178574, lng: 72.814149 }}
        googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyCc4yAdfLx6KxSYMPP5A3tVZzRJeCflIBQ&v=3.exp&libraries=geometry,drawing,places"       
    >
        { props.markers.map(marker => (
            <Marker
                key={marker.lat + marker.lat}
                position={{ lat: marker.lat, lng: marker.lng }}
                onRightClick={() => props.onMarkerRightClick(marker)}
            />
        ))}
    </GoogleMap>))

export default DynamicGMap