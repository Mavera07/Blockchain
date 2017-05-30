import React from 'react';
import {InputBond, HashBond, BButton} from 'parity-reactive-ui';
import {Rspan, ReactiveComponent} from 'oo7-react';

export class Hospital extends ReactiveComponent {
  constructor() {
    super();
    this.state = {
      show : false
    };
    this.showHospital = this.showHospital.bind(this);
  }
  componentWillMount() { this.componentWillReceiveProps(this.props); }
  componentWillReceiveProps (props) {
    this.hospitalNumber = this.props.contract.getHospitalNumber();
  }


  showHospital() {
    this.setState({show : true});
  }

  render() {
    return (<div>
      <BButton content="Hospital" onClick={this.showHospital}/>
      { this.state.show ? <Rspan> {this.hospitalNumber.map(_=>_.toString())}  </Rspan>
        : <span></span> }
    </div>);
  }
};
