import React, { Component } from 'react';

import { withRouter } from 'react-router-dom';
import { Container, Col, Row, Button, InputGroup } from 'reactstrap'
import * as FontAwesome from 'react-icons/lib/fa'
import TrekItem from '../TrekItem'
import PlacesAutocomplete, { geocodeByPlaceId } from 'react-places-autocomplete'
import './index.css'

class TrekDay extends Component {
    constructor(props) {
        super(props)

        this.onChange = (text) => { this.setState({ stopTextValue: text }) }

        this.state = {
            stops: props.stops,
            day: props.dayNumber,
            stopTextValue: ''
        }
    }

    constructStops() {
        if (this.state.stops === null) return;
        if (this.state.stops.length > 0) {
            console.log(this.state.stops)
            return this.state.stops.map(stop => <TrekItem key={stop.key} stop={stop} />);
        }
    }

    addStop(address) {
        if (this.state.stops === null) return;
        console.log(address)
        if (address !== null) {
            var nextStop = this.state.stops.length > 0 ? this.state.stops[this.state.stops.length - 1]["day"] + 1 : 1;
            var newStopsArr = this.state.stops.concat({
                "key": nextStop,
                "description": address,
                "day": this.state.day,                
            });

            this.setState({ stops: newStopsArr, stopTextValue: '' })
            this.props.handleNewStop(nextStop, address, this.state.day)
        }
    }

    removeDay() {
        if (window.confirm(`Are you sure you want to remove this day and all of it's stops?`)) {
            if (this.state.day !== 1) {
                this.props.handleRemoveDay(this.state.day)
            }
            else {
                alert('You cannot remove the first day')
            }            
        }           
    }


    render() {

        /* Constants for Google AutoComplete */
        const inputProps = {
            value: this.state.stopTextValue,
            onChange: this.onChange,
            onSelect: this.onSelect,
            placeholder: "Add a stop for Day " + this.state.day,
            style: {backgroundColor: 'red', width: '100%'}
        }

        const cssClasses = {
            root: 'form-group',
            input: 'form-control autocomplete-input',
            autocompleteContainer: 'autocomplete-container',
            autocompleteItem: 'autocomplete-item',
        }

        //const myStyles = {
        //    root: { position: 'absolute'},
        //    input: { width: '100%' },
        //    autocompleteContainer: { backgroundColor: 'green' },
        //    autocompleteItem: { color: 'purple'  },
        //    autocompleteItemActive: { color: 'blue' }
        //}
        
        /* End Constants for Google AutoComplete */

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
                    <PlacesAutocomplete
                        inputProps={inputProps}
                        classNames={cssClasses}
                        onSelect={(address, placeId) => {
                            geocodeByPlaceId(placeId)
                                .then((results) => {
                                    console.log(results[0])
                                    this.addStop(results[0].formatted_address);
                                    this.setState({ stopTextValue: '' })
                                })
                                .catch(error => console.error(error))
                            }}
                    />            
                </InputGroup>
            </Container>
        )
    }
}

export default withRouter(TrekDay);