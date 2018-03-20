import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { withRouter } from 'react-router-dom';

class TagList extends Component {

    renderList() {
        var list = []
        this.props.tags.map((tag) => {
            list.push(<a key={tag} style={{ height: 20, paddingLeft: 0, marginBottom: 5, paddingBottom: 18, borderBottomWidth: 0, marginLeft: 0 }}
                        onClick={() => {
                            //this.props.history.push(routes.SEARCH, '#' + tag )
                        }}>
                        <p style={{ paddingLeft: 10, paddingBottom: 10, color: '#5b4fff', display: 'inline' }}><small>#{tag}</small></p>
                    </a>)
        })
        return list;
    }

    render() {

        return this.renderList()
    }
}

export default withRouter(TagList);