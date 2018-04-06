import React, { Component } from 'react';
import { Container, Row, Col, Button, InputGroup, Input, InputGroupAddon } from 'reactstrap';
import * as FontAwesome from 'react-icons/lib/fa'
import TrekDetail from '../../TrekDetail'
import TipDetail from '../../TipDetail'
import ResourceDetail from '../../ResourceDetail'
import * as firebase from 'firebase';
import Spinner from '../../Misc/Spinner';
import * as constants from '../../../constants'
import { withRouter } from 'react-router-dom';


const WAIT_INTERVAL = 800;
const ENTER_KEY = 13;

class SearchFeed extends Component {

    state = {
        searchText: '',
        showSpinner: false
    }

    componentWillMount() {
        this.timer = null;
        this.getSearchText()

        this.triggerSearch = this.triggerSearch.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location.state.searchText !== this.state.searchText) {
            this.setState({ searchText: nextProps.location.state.searchText });
            this.searchSubmit(nextProps.location.state.searchText)
        }
    }

    componentDidMount() {
        if (this.state.searchText === '') {
            this.searchInput.focus();
        }
        else {
            this.searchSubmit(this.state.searchText)
        }
    }

    getSearchText() {
        if (this.props !== undefined) {
            if (this.props.location !== undefined) {
                if (this.props.location.state !== undefined) {
                    if (this.props.location.state.searchText !== undefined) {
                        this.setState({ searchText: this.props.location.state.searchText })
                        return;
                    }
                }
            }
        }
    }

    filterResults(type, searchText, data) {
        let text = searchText.toLowerCase();
        
        switch (type) {
            case constants.databaseSchema.TREKS.root: return this.filterForTreks(data, text)
            case constants.databaseSchema.TIPS.root: return this.filterForTips(data, text)
            case constants.databaseSchema.RESOURCES.root: return this.filterForResources(data, text)
            default: return;
        }
    }

    filterForTips(data, text) {
        //first check titles
        if (data.tipTitle.toLowerCase().indexOf(text) !== -1) {
            return true
        }

        //now check tags
        if (typeof data.tipTags !== "undefined") {
            for (var i = 0, len = data.tipTags.length; i < len; i++) {
                if (data.tipTags[i].toLowerCase() === text.replace('#', '')) return true
            }
        }

        //check tip text
        if (data.tipText.toLowerCase().indexOf(text) !== -1) {
            return true
        }
    }

    filterForResources(data, text) {

        //first check titles
        if (data.resourceTitle.toLowerCase().indexOf(text) !== -1) {
            return true
        }

        //now check tags
        if (typeof data.resourceTags !== "undefined") {
            for (var i = 0, len = data.resourceTags.length; i < len; i++) {
                if (data.resourceTags[i].toLowerCase() === text.replace('#', '')) return true
            }
        }
    }

    filterForTreks(data, text) {
        
        //first check titles
        if (data.title.toLowerCase().indexOf(text) !== -1) {
            return true
        }

        //check stops
        if (typeof data.days !== "undefined") {
            for (var i = 0, len = data.days.length; i < len; i++) {
                if (typeof data.days[i].stops !== "undefined") {
                    for (var j = 0, len2 = data.days[i].stops.length; j < len2; j++) {
                        if (data.days[i].stops[j].length > 0) {
                            if (data.days[i].stops[j].stopName.toLowerCase().indexOf(text) !== -1) return true
                        }
                    }
                }
            }
        }

        //now check tags
        if (typeof data.trekTags !== "undefined") {
            for (var k = 0, len3 = data.trekTags.length; k < len3; k++) {
                if (data.trekTags[k].toLowerCase() === text.replace('#', '')) return true
            }
        }
    }

    retrievePostsWithHashtag(tag) {
      
        this.setState({ showSpinner: true })
        var filteredList = [];
        var self = this;

        Promise.resolve(firebase.database().ref('/tags').child(tag).once('value')
            //see if we have this tag in our tags list
            .then(function (snapshot) {               
                snapshot.forEach(function (child) {                    
                    firebase.database().ref().child(child.val()).once('value')
                        //find the post in the corresponding table
                        .then(function (snapshot2) {
                            if (snapshot2.hasChild(child.key)) {
                                filteredList.push({ type: child.val(), id: snapshot2.child(child.key).key, details: snapshot2.child(child.key).val() })
                            }
                        })
                })
            }))
            .then(() => {
                filteredList.sort(this.sortFunction);
                //TODO figure out why this isn't being set at the correct time
                setTimeout(function () { self.setState({ filteredList: filteredList, showSpinner: false }) }, 100);                             
            })
            .catch((e) => {
                console.log(e)
                self.setState({ showSpinner: false })
            })
    }

    handleChange(e) {
        clearTimeout(this.timer);

        this.setState({ searchText: e.target.value});

        this.timer = setTimeout(this.triggerSearch, WAIT_INTERVAL);
    }

    handleKeyDown(e) {
        if (e.keyCode === ENTER_KEY) {
            this.triggerSearch();
        }
    }

    triggerSearch() {
        this.searchSubmit(this.state.searchText);
    }

    searchSubmit(text) {
        //Check if this was a parameter being passed or from the input
        var searchText = text;

        if (searchText !== undefined) {
            this.updateSearchText(searchText)
        }

        if (searchText.length > 1) {
            if (searchText.charAt(0) === '#' && searchText.length > 1) {
                this.retrievePostsWithHashtag(searchText.substr(1))
            }
            else {
                this.getMatches(searchText)
            }
        }
        else {
            this.setState({ filteredList: [] })
        }
    }

    getMatches(searchText) {
        this.setState({ showSpinner: true })

        var self = this;
        var keys = [
            "/treks",
            "/resources",
            "/tips"
        ];
        var promises = keys.map(function (key) {
            return firebase.database().ref(key).once("value");
        });

        var filteredList = [];
        Promise.all(promises).then(function (snapshots) {
            snapshots.forEach(function (snapshot) {
                snapshot.forEach(function (child) {
                    if (self.filterResults(snapshot.key, searchText, child.val())) {
                        filteredList.push({ type: snapshot.key, id: child.key, details: child.val() })
                    }
                })
            });
        })
        .then(() => {
            filteredList.sort(this.sortFunction)
            self.setState({ filteredList: filteredList, showSpinner: false })
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

    getResults() {
        var list = []
        if (this.state.filteredList !== undefined) {
            this.state.filteredList.forEach(item => {
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
        }
        return list
    }

    updateSearchText(text) {
        this.setState({ searchText: text })
    }

    render() {

        return (
            <Container>
                <Row style={{paddingTop: 10}}>
                    <Col xs="12">
                        <InputGroup>
                            <Input
                                innerRef={(input) => { this.searchInput = input; }}
                                value={this.state.searchText}
                                placeholder={this.state.searchText ? this.state.searchText : 'search'}
                                onChange={this.handleChange.bind(this)}
                                onKeyDown={this.handleKeyDown}
                            />
                            <InputGroupAddon addonType = "append">
                                <Button color="link" style={{color: '#f8f8f8'}}><FontAwesome.FaSearch /></Button>
                            </InputGroupAddon>
                        </InputGroup>                       
                    </Col>
                </Row>
                <hr/>
                <Row>
                    <Col xs="12">
                        {this.state.showSpinner ? <div style={{ display: 'flex', justifyContent: 'center' }}><Spinner /></div> : null}
                        {this.getResults()}
                    </Col>
                </Row>
            </Container>
        );
    }
}


export default withRouter(SearchFeed);