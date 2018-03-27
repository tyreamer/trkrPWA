import React, {Component} from 'react';
import { ButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap'
import * as FontAwesome from 'react-icons/lib/fa'

class PostActionsButton extends Component {

    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this);
    }

    componentWillMount() {
        this.setState({ dropdownOpen: false });
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        return (<ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle} direction="up" >
                    <DropdownToggle style={{ backgroundColor: '#fff', border: 'none' }}>
                        <FontAwesome.FaEllipsisH style={{ color: 'grey' }} />
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem>
                            <div onClick={() => this.props.handleDelete(this.props.id)}>
                                <h6>
                                    <FontAwesome.FaTrash style={{ marginBottom: 5 }} />
                                    &nbsp;
                                    Delete Post
                                </h6>
                            </div>
                        </DropdownItem>
                        <DropdownItem>
                            <div onClick={() => { /*  Share  */ }} >
                                <h6>
                                    <FontAwesome.FaShareSquare style={{ marginBottom: 5 }} />
                                    &nbsp;
                                    Share
                                </h6>
                            </div>
                        </DropdownItem>
                    </DropdownMenu>
                </ButtonDropdown >);
    }
}

export default PostActionsButton;
