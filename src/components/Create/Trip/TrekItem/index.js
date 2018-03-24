import React, { Component } from 'react';

import { Row, Col } from 'reactstrap'

const TrekItem = (props) => {

    var location = props.stop.description
    //var notes = props.stop.notes

    //  makeNotes() {
    //  notes.map(n => <Text note>{n}</Text>)
    //}

    return (
        <Row>
            <Col xs={{size: 11, offset: 1}}>
                <p>{location}</p>
            </Col>            
        </Row>
    )
}

export default TrekItem;