import React from 'react';
import {Bond, TimeBond} from 'oo7';
import {Rspan} from 'oo7-react';
import {InputBond} from 'parity-reactive-ui';
import {bonds, formatBalance, formatBlockNumber} from 'oo7-parity';
import {Hospital} from './hospital';


const InsuranceABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "payInsurance",
    "outputs": [],
    "payable": true,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "host1",
        "type": "address"
      }
    ],
    "name": "withdraw",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "getCustomerNumber",
    "outputs": [
      {
        "name": "customerNumber",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "treatingCost",
        "type": "uint256"
      }
    ],
    "name": "hospitalOffer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "payable": true,
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "duration",
        "type": "uint256"
      }
    ],
    "name": "getInsuranceNote",
    "outputs": [
      {
        "name": "multiplier",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getHospitalNumber",
    "outputs": [
      {
        "name": "hospitalNumber",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  }
];

export class App extends React.Component {
  constructor() {
    super();
    this.state = { insurance: bonds.makeContract('0x8eEac30303757a28CEE3A236a56F96863850a096',InsuranceABI) };
  }
  render () {
    return (<div>
      Hello World!
      <Hospital contract={this.state.insurance} />
    </div>);
  }
}
