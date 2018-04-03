import React from 'react';

import { Row, Col } from 'reactstrap'
import * as helpers from '../../../../helpers'
import * as FontAwesome from 'react-icons/lib/fa'

const TrekItem = (props) => {

    var location = props.stop.description
    //var notes = props.stop.notes

    //  makeNotes() {
    //  notes.map(n => <Text note>{n}</Text>)
    //}

    function renderSVG() {
        return (
            <div style={{ position: 'relative', left: 0, top: 0, zIndex: -1 }}>
                <svg style={{ position: 'absolute', top: 18, left: 2, width: 15 }} >
                    <line className="markerLine" x1="10" x2="10" y1="10" y2="50" stroke="#c9f4ff" strokeWidth="5" strokeDasharray="3, 4" />
                </svg>
            </div>
        );
    }

    function renderStopName() {
        if (location.length > 50) {
            return location.substring(0, 50) + "...";
        }

        return location;
    }

    return (
        <div>
            <Row>        
                <Col xs="2">
                    <h4 style={{ position: 'absolute', zIndex: 15 }}>
                        {
                            props.totalStops !== props.stop.key ? renderSVG() : null
                        }
                        <FontAwesome.FaDotCircleO style={{ color: '#' + helpers.getColorFromString(location).substring(2) }} />
                    </h4>
                </Col>
                <Col xs="10">
                    <p>{renderStopName()}</p>
                </Col>   
            </Row>
            <br />
        </div>
    )
}

export default TrekItem;