import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class TagList extends Component {
    
    renderList() {
        
        if (this.props.tags === undefined || this.props.tags === null) return null

        var list = []
        var i = 0;
        this.props.tags.forEach((tag) => {
           
            list.push(<a key={tag + i} style={{ height: 20, paddingLeft: 0, marginBottom: 5, paddingBottom: 18, borderBottomWidth: 0, marginLeft: 0 }}
                        onClick={() => {
                            //this.props.history.push(constants.routes.SEARCH, '#' + tag )
                        }}>
                        <p style={{ paddingRight: 10, paddingBottom: 10, color: '#fff', display: 'inline' }}><small>#{tag}</small></p>
            </a>)
            i++;
        })
        return list;
    }

    render() {

        return this.renderList()
    }
}

export default withRouter(TagList);