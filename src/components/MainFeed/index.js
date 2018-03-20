import React, { Component } from 'react';

import withAuthorization from '../Session/withAuthorization';
import { Container, Col, Row } from 'reactstrap'
import TrekDetail from '../TrekDetail'
import TipDetail from '../TipDetail'
import ResourceDetail from '../ResourceDetail'
import { db } from '../../firebase';
import * as FontAwesome from 'react-icons/lib/fa'

class MainFeed extends Component {

    constructor(props) {
        super(props);

        this.state = {
            feedList: []
        };
    }

    componentWillMount() {  
        var self = this;

        var promises = [
            db.onceGetTreks(),
            db.onceGetResources(),
            db.onceGetTips()
        ]

        var masterList = [];
        Promise.all(promises).then(function (snapshots) {
            snapshots.forEach(function (snapshot) {
                //merge into one feed list
                snapshot.forEach(function (child) {
                    masterList.unshift({ type: snapshot.key, id: child.key, details: child.val() })
                })
            });
        })
        .then(() => {
            masterList.sort(this.sortFunction)
            self.setState({ feedList: masterList })
        });
    
    }

    sortFunction(a, b) {
        if (a.details.datePosted === b.details.datePosted) {
            return 0;
        }
        else {
            return (a.details.datePosted < b.details.datePosted) ? 1 : -1;
        }
    }

    removeItem(key) {
        var idx;

        for (var i = 0; i < this.state.feedList.length; i++) {
            if (this.state.feedList[i].id === key) {
                idx = i;
                break;
            }
        }

        var newFeedList = this.state.feedList;
        newFeedList.splice(idx, 1);
        this.setState({ feedList: newFeedList })
    }

    createFeed() {
        var list=[]
        this.state.feedList.forEach(item => {
            switch (item.type) {
                case "treks": list.push(<div style={{ display: 'flex', justifyContent: 'center', marginBottom: 50 }} key={item.id}><TrekDetail id={item.id} trekRecord={item.details} handleDeletedTrek={this.removeItem} /></div>)
                    break;

                case "resources": list.push(<ResourceDetail key={item.id} resource={item.details} handleDeletedResource={this.removeItem} />)
                    break;

                case "tips": list.push(<TipDetail key={item.id} id={item.id} tip={item.details} handleDeletedTip={this.removeItem} />)
                    break;

                default:
                    break;
            }
        })

        return list
    }

    render() {
        return (<Container style={{ paddingTop: 10 }}>
                        {this.createFeed()}
                    </Container>);
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(MainFeed);