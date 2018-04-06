import React from 'react';
import * as helpers from '../../helpers'

const StaticGMap = (props) => {

  var days = props.trekDays
  var totalStops = 0;
  var staticMapURL = 'https://maps.googleapis.com/maps/api/staticmap?'
  var markers = generateMarkers();
  var zoomLevel = totalStops === 1 ? "&zoom=9" : null;
  var size = props.size

  function generateMarkers() {
    //Marker logic
    var markers = '';
    var stopNum = 0;

    if (days !== undefined && days !== null) {
      for (var i=0; i < days.length; i++) {
        if (days[i].stops !== null && days[i].stops !== undefined) {
          for (var j=0; j<days[i].stops.length; j++) {              
            totalStops++;
            stopNum++;
            var randomColor = helpers.getColorFromString(days[i].stops[j].stopName)
            markers += "&markers=color:"+ randomColor +"%7Clabel:" + stopNum;
            markers +=  "%7C" + days[i].stops[j].stopName
          }
        }
      }
    }

    return markers
  }
            
  var mapImage = `${staticMapURL}?center=` + days[0].stops[0].stopName + zoomLevel + `&key=AIzaSyAOMW7lrMuV3zSfeRroBstSu5tEbbtxdTQ&size=` + size + markers

  return (<div style={{ display: 'block', backgroundImage: `url(${mapImage})`, width: '100%', margin: '0 auto', backgroundPosition: '50% 50%', lineHeight: 0 }}>
            <img src={mapImage} alt="google-map" style={{ maxWidth: '100%', opacity: 1, width: '100%' }} />
          </div>);
}

export default StaticGMap;
