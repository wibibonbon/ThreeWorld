import React, {Component} from 'react';
import './selectedBpInfo.css'
import details from '../db/bpDetails.json'


class SelectedBpInfo extends Component {


    constructor(){
        super()
        this.detailsInfo = details;
        console.log(details)
    }

    render() {
        return (
            <div>
                <h2 id='info'>Description</h2>
                <h2 id='info2'>Selected BP ID: {this.props.selectedBpId}</h2>
                <h2 id='info3'>Website {this.getSelectedInfo()}</h2>

            </div>);
    }

    getSelectedInfo(){
        const info = this.detailsInfo.find(bp => bp[0] == this.props.selectedBpId);
        if (info!==undefined){
        console.log(info)
        return info[1][1];}
        else return ''
    }

}
export default SelectedBpInfo