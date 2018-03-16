import React, { Component } from 'react';

import { db } from '../../firebase';
import * as FontAwesome from 'react-icons/lib/fa'
import StaticGMap from '../StaticGMap'
import { Row, Col } from 'reactstrap'

class TrekDetail extends Component {

    constructor(props) {
        super(props)
        this.deletePost = this.deletePost.bind(this);
    }

    componentWillMount() {  
        this.setState({ open: false, record: this.props.id, trek: this.props.trekRecord });    
    }

    goToPost() {
       // this.props.navigation.navigate('ViewTrek', { trekRecord: this.props.trekRecord, navigation: this.props.navigation })
    }

    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
        }
        return 0;
    }
    
    deletePost(key) {        
        db.doRemoveTrek(key)
        this.props.handleDeletedTrek(key);
    }

    render() {
        
        //date
        var date = new Date(this.props.trekRecord.datePosted);
        date = ((date.getMonth() + 1)
            + '/' + date.getDate()
            + '/' + date.getFullYear());

        //budget
        var budget = this.formatNumber(this.props.trekRecord.budget)

        //stops
        var totalStops = 0;
        if (this.props.trekRecord.days !== undefined && this.props.trekRecord.days !== null) {
            for (var i = 0; i < this.props.trekRecord.days.length; i++) {
                if (this.props.trekRecord.days[i].stops !== undefined && this.props.trekRecord.days[i].stops !== null) {
                    totalStops = totalStops + this.props.trekRecord.days[i].stops.length
                }
            }
        }

        return (
            <Col xs="12" sm={{ size: 4, offset: 4 }} onClick={() => this.goToPost()} style={{ width: 300 }}> 
                <Row style={{ backgroundColor: '#6db5ff', color: '#fff', paddingTop: 5, borderTopLeftRadius: 15, borderTopRightRadius: 15  }}>
                    <Col xs="12">
                        <h5>{this.props.trekRecord.title} </h5>                            
                    </Col>
                </Row>
                <Row style={{ color: 'rgba(255,255,255, .8)', backgroundColor: '#6db5ff', paddingBottom: 5 }}>
                    <Col className="col-xs-3">                                             
                        <h5 style={{ display: 'inline' }}><FontAwesome.FaCalendarO /></h5>
                        <h6 style={{ display: 'inline' }}> {this.props.trekRecord.days.length}</h6>                       
                    </Col>
                    <Col className="col-xs-6">                        
                        <h5 style={{ display: 'inline' }}><FontAwesome.FaDollar /></h5>
                        <h6 style={{ display: 'inline' }}> {budget}</h6>
                    </Col>
                    <Col className="col-xs-3">                       
                        <h5 style={{ display: 'inline' }}><FontAwesome.FaMapPin /></h5>
                        <h6 style={{ display: 'inline' }}>  {totalStops}</h6> 
                    </Col>
                </Row>
                <Row>
                    {
                        (this.props.trekRecord.featuredImage === '' || this.props.trekRecord.featuredImage) === undefined
                        ? <StaticGMap trekDays={this.props.trekRecord.days} />
                        : <img src={this.props.trekRecord.featuredImage} alt="trek-image" style={{ height: 300, width: '100%', margin: '0 auto' }} />
                    }  
                </Row>
                <Row>
                    <Col xs="12">
                        {/* <TagList tags={this.props.trekRecord.trekTags} navigation={this.props.navigation} /> */}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {this.props.trekRecord.summary ? <p style={{ paddingTop: 5 }}>{this.props.trekRecord.summary}</p> : null}
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        <p style={{ textAlign: 'right', lineHeight: .9 }}
                            onClick={() => {
                            //  this.props.navigation.navigate('UserProfile', { user: this.props.trekRecord.user, navigation: this.props.navigation })
                        }}>
                            <b>{this.props.trekRecord.displayName}</b>
                            <br/>
                            <small>{date}</small>
                        </p> 
                    </Col>
                </Row>
                <Row>
                    <Col xs="12" style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }}>
                        {/*<Interactions handleDelete={this.deletePost} id={this.props.id} user={this.props.trekRecord.user} summary={this.props.trekRecord.summary} title={this.props.trekRecord.title} />*/}
                    </Col>
                </Row>
                <hr />
            </Col>
        );
    }
}

const updateByPropertyName = (propertyName, value) => () => ({
    [propertyName]: value,
});

const authCondition = (authUser) => !!authUser;

export default TrekDetail;