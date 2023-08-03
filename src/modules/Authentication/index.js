import React, { Component } from 'react'
import { connect } from 'react-redux'

class Authentication extends Component {
    render() {
        return (
            <div>Authentication</div>
        )
    }
}

export default connect(state => (
    { ...state.user }
))(Authentication)
