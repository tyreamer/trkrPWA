import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class TagList extends Component {

    constructor(props) {
        super(props)
    }

    renderList() {
        
        if (this.props.tags === undefined || this.props.tags === null) return null

        var list = []
        this.props.tags.forEach((tag) => {
            list.push(<a key={tag} style={{ height: 20, paddingLeft: 0, marginBottom: 5, paddingBottom: 18, borderBottomWidth: 0, marginLeft: 0 }}
                        onClick={() => {
                            //this.props.history.push(routes.SEARCH, '#' + tag )
                        }}>
                        <p style={{ paddingRight: 10, paddingBottom: 10, color: '#A6C3D7', display: 'inline' }}><small>#{tag}</small></p>
                    </a>)
        })
        return list;
    }

    render() {

        return this.renderList()
    }
}

export default withRouter(TagList);