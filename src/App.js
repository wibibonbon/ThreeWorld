import React, { Component } from 'react'
import Playground from './playgrounds/interactiveWorld'
import queryString from 'query-string'
import './index.css'
import PropTypes from 'prop-types'
import SelectedBpInfo from './components/selectedBpInfo.js'


const state = {selectedBpId: ''}

class App extends Component {

    constructor () {
        super()
        this.state = {selectedBpId: 'test'}
        // Bind `this` to the animate functions
        //this.animate = this.animate.bind(this)

/*
        if (module.hot) {
            // If hot reloading, stop events
            module.hot.dispose(() => {
                this.stopped = true
            })
        }*/
    }
    componentDidMount () {
        //this.refs.app.appendChild(this.props.renderer.domElement)

        this.getCanvas()
            .then(() => {
                // Create a playground by passing it the reference to the canvas
                // along with the canvas element we want to display
                //this.playground = new Playground(this.props.renderer, this.refs.image)
                // Start the animation
                window.requestAnimationFrame(this.animate.bind(this))
            })
            .catch((e) => { throw new Error(e) })

    }

    getCanvas () {
        return new Promise((resolve, reject) => {
            let canvas = this.refs.image
            resolve()
        })
    }

    animate () {
        // Measure the stats and loop the playground
        //this.props.stats.begin()
        //this.playground.loop()
        //this.props.stats.end()

        // Keep looping the animation
        //if (!this.stopped) window.requestAnimationFrame(this.animate)
    }

    handleChangeBp = selectedBp => {
        const selectedBpId = selectedBp;
        this.setState({selectedBpId});
    };

    render () {
        return (
            <div className='App' ref='app'>
                <Playground onChangeSelectedBp={this.handleChangeBp}/>
                <SelectedBpInfo selectedBpId={this.state.selectedBpId}/>
            </div>
        )
           /* <canvas ref='image' width='1000' height='400' style={{display: 'none'}} />*/

    }

}

App.propTypes = {
    renderer: PropTypes.object,
    stats: PropTypes.object
}

export default App
