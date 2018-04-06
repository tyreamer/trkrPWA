import React, { Component } from 'react';
import SearchFeed from './SearchFeed'
import withAuthorization from '../Session/withAuthorization';

class SearchPage extends Component {
    
    render() {      
        return (
            <div>
                <SearchFeed />
            </div>
        );
    }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(SearchPage);