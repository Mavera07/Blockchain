import React from 'react';
import {Bond, TimeBond} from 'oo7';
import {Rspan} from 'oo7-react';
import {InputBond, HashBond, BButton, TransactionProgressLabel} from 'parity-reactive-ui';
import {bonds, formatBalance, formatBlockNumber} from 'oo7-parity';

const CounterABI = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "_option",
        "type": "uint256"
      }
    ],
    "name": "vote",
    "outputs": [],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "hasVoted",
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
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "votes",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "myVal",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "who",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "option",
        "type": "uint256"
      }
    ],
    "name": "Voted",
    "type": "event"
  }
];

export class App extends React.Component {
  constructor() {
    super();
    this.counter = bonds.makeContract('0x020d6021d1F4225BeE4a6BCD4364e9A2FEA8061F', CounterABI);
  }
  render () {
    return (<div>
    	<a
    		href = '#'
           onClick = {() => alert(this.counter.vote(1))}
           >
           	kkk{this.counter.myVal}
           </a>
  </div>);
  }
}