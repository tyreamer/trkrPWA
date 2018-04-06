import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import * as constants from '../../constants';

class TagList extends Component {
    
    renderList() {
        
        if (this.props.tags === undefined || this.props.tags === null) return null

        var list = []
        var i = 0;
        this.props.tags.forEach((tag) => {
           
            list.push(
                <Link
                    key={tag + i}
                    state={'#' + tag}
                    style={{ height: 20, paddingLeft: 0, marginBottom: 5, paddingBottom: 18, borderBottomWidth: 0, marginLeft: 0 }}
                    to={{ pathname: constants.routes.SEARCH, state: { searchText: '#' + tag } }}>
                    <p style={{ paddingRight: 10, paddingBottom: 10, color: '#fff', display: 'inline' }}><small>#{tag}</small></p>
                </Link>)
            i++;
        })
        return list;
    }

    render() {

        return this.renderList()
    }
}

export default withRouter(TagList);