import React from 'react';
import {InputBond, HashBond} from 'parity-reactive-ui';
import {Rspan, ReactiveComponent} from 'oo7-react';


export class Hospital extends ReactiveComponent {
  constructor() {
    super();
  }
  componentWillMount() { this.componentWillReceiveProps(this.props); }
  componentWillReceiveProps (props) {
    this.hospitalNumber = this.props.contract.getHospitalNumber();
  }
  render() {
    return (<div>
      Neden ben
      <Rspan> {this.hospitalNumber.map(_=>_.toString())} </Rspan>
    </div>);
  }
};
