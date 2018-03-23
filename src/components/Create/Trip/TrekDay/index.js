import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { Container, Col, Row, Button, InputGroup, InputGroupAddon, Input } from 'reactstrap'
import * as FontAwesome from 'react-icons/lib/fa'
import TrekItem from '../TrekItem'

class TrekDay extends Component {
    constructor(props) {
        super(props)
        this.state = {
            stops: props.stops,
            day: props.dayNumber,
            stopTextValue: ''
        }
    }

    constructStops() {
        if (this.state.stops === null) return;
        if (this.state.stops.length > 0) {
            return this.state.stops.map(stop => <TrekItem key={stop.key} stop={stop} />);
        }
    }

    addStop(stopName) {
        if (this.state.stops === null) return;

        if (stopName != '') {
            var nextStop = this.state.stops.length > 0 ? this.state.stops[this.state.stops.length - 1]["day"] + 1 : 1;
            var newStopsArr = this.state.stops.concat({
                "key": nextStop,
                "description": stopName,
                "day": this.state.day
            });

            this.setState({ stops: newStopsArr, stopTextValue: '' })
            this.props.handleNewStop(nextStop, stopName, this.state.day)
        }
    }

    removeDay() {
        if (window.confirm(`Are you sure you want to remove this day and all of it's stops?`)) {
            if (this.state.day != 1) {
                this.props.handleRemoveDay(this.state.day)
            }
            else {
                alert('You cannot remove the first day')
            }            
        }           
    }


    render() {
        var self = this;
        return (
            <Container style={{marginTop: 40}}>
                <Row style={{ backgroundColor: '#ff8142' }}>
                    <Col xs="8">
                        <h5 style={{ color: '#fff' }}>Day {this.state.day}</h5>
                    </Col>
                    <Col xs="4">
                        <Button
                            color="link"
                            style={{ float: 'right' }}
                            onClick={() => { this.removeDay() }}>
                            <FontAwesome.FaMinusCircle style={{ fontSize: 25, color: '#fff' }} />
                        </Button>
                    </Col>
                </Row>
                <br/>
                {this.constructStops()}
                <InputGroup>                   
                    <Input
                        type="text"
                        value={this.state.stopTextValue}
                        placeholder={"Add a stop for Day " + `${this.state.day}`}
                        onChange={(text) => { self.setState({ stopTextValue: text.target.value }) }}
                    />
                    <InputGroupAddon addonType="append" onClick={() => { this.addStop(this.state.stopTextValue); this.setState({ stopTextValue: '' }) }}>
                        <Button color="link"><FontAwesome.FaPlusCircle style={{color: 'grey'}}/></Button>
                    </InputGroupAddon>                   
                </InputGroup>
            </Container>
        )
    }
}

export default withRouter(TrekDay);