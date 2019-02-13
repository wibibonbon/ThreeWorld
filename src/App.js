import React, { Component } from 'react'
import Playground from './playgrounds/interactiveWorld'
import './index.css'
import PropTypes from 'prop-types'
import SelectedBpInfo from './components/selectedBpInfo.js'
import { Container, Row, Col } from 'reactstrap';


const state = {selectedBpId: ''}

class App extends Component {

    constructor () {
        super()
        this.state = {selectedBpId: 'test'}
    }

    handleChangeBp = selectedBp => {
        const selectedBpId = selectedBp;
        this.setState({selectedBpId});
    };





    render () {
        return (
            <div >

                <Playground onChangeSelectedBp={this.handleChangeBp}/>
                <SelectedBpInfo selectedBpId={this.state.selectedBpId}/>

            </div>
        )

    }

}

App.propTypes = {
    renderer: PropTypes.object,
    stats: PropTypes.object
}

export default App
