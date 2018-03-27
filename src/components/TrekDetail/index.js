import React, { Component } from 'react';

import { db } from '../../firebase';
import * as FontAwesome from 'react-icons/lib/fa'
import StaticGMap from '../StaticGMap'
import { Container, Row, Col } from 'reactstrap'
import * as constants from '../../constants';
import { withRouter } from 'react-router-dom';
import TagList from '../TagList'
import Interactions from '../Interactions'
import PostActionsButton from '../Misc/PostActionsButton'

class TrekDetail extends Component {

    constructor(props) {
        super(props)
        this.deletePost = this.deletePost.bind(this);   
    }

    componentWillMount() {  
        this.setState({ record: this.props.id, trek: this.props.trekRecord});    
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
        if (window.confirm('Are you sure you want to delete this post?')) {
            db.doRemoveTrek(key)
            this.props.handleDeletedTrek(key);
        }        
    }

    render() {
        
        //date
        var date = new Date(this.props.trekRecord.datePosted);
        date = ((date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear());
         
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
            <Col xs="12" sm={{ size: 6 }} lg={{size: 4}} onClick={() => this.goToPost()} style={{ width: 300 }}> 
                <Row style={{ backgroundColor: '#6db5ff', color: '#fff', paddingTop: 5, borderTopLeftRadius: 15, borderTopRightRadius: 15  }}>
                    <Col xs="12">
                        <h3><b>{this.props.trekRecord.title}</b></h3>                            
                    </Col>
                </Row>
                <Row style={{ color: '#fff', backgroundColor: 'rgba(109,181,255, .8)', paddingBottom: 5 }}>
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
                        : <img src={this.props.trekRecord.featuredImage} alt="trekFeatured" style={{ height: 300, width: '100%', margin: '0 auto' }} />
                    }  
                </Row>
                <Row style={{ borderLeft: '1px solid #f8f8f8', borderRight: '1px solid #f8f8f8', borderBottom: '1px solid #f8f8f8' }}>
                    <Container>
                        <Row>
                            <Col xs="12" style={{ paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0 }}>
                                <Interactions id={this.props.id} user={this.props.trekRecord.user} summary={this.props.trekRecord.summary} title={this.props.trekRecord.title} />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="12">
                                <TagList tags={this.props.trekRecord.trekTags} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {this.props.trekRecord.summary ? <p style={{ paddingTop: 5 }}>{this.props.trekRecord.summary}</p> : null}
                            </Col>
                        </Row>                        
                        <Row>
                            <Col xs="6">
                                <PostActionsButton handleDelete={() => this.deletePost(this.props.id)} />                                
                            </Col>
                            <Col xs="6">
                                <p style={{ textAlign: 'right', lineHeight: .9, overflowX: 'auto', overflowY: 'hidden' }}
                                    onClick={() => {
                                        this.props.history.push({ pathname: constants.routes.PROFILE, state: { user: this.props.trekRecord.user === null ? '' : this.props.trekRecord.user } })
                                    }}>
                                    <b>{this.props.trekRecord.user}</b>
                                    <br/>
                                    <small>{date}</small>
                                </p> 
                            </Col>
                        </Row>                        
                    </Container>
                  </Row>
            </Col>
        );
    }
}

export default withRouter(TrekDetail);