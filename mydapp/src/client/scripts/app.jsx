import React from 'react';
import {Bond, TimeBond} from 'oo7';
import {Rspan} from 'oo7-react';
import {InputBond, HashBond, BButton, TransactionProgressLabel} from 'parity-reactive-ui';
import {bonds, formatBalance, formatBlockNumber} from 'oo7-parity';

const CounterABI = [{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"customers","outputs":[{"name":"owner","type":"address"},{"name":"endDate","type":"uint256"},{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"duration","type":"uint256"}],"name":"payInsurance","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"host1","type":"address"}],"name":"withdraw","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getCustomerNumber","outputs":[{"name":"customerNumber","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"treatingCost","type":"uint256"}],"name":"hospitalOffer","outputs":[{"name":"","type":"bool"}],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"duration","type":"uint256"}],"name":"getInsuranceNote","outputs":[{"name":"multiplier","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getHospitalNumber","outputs":[{"name":"hospitalNumber","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"hospitals","outputs":[{"name":"owner","type":"address"},{"name":"endDate","type":"uint256"},{"name":"treatingCost","type":"uint256"}],"payable":false,"type":"function"}];

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.customerDuration = new Bond();
    this.insuranceDuration = new Bond();

    this.state = {
      func1val: false,
      func2val: false,
      func3val: false,
      func4val: false,
      func5val: false,
      func6val: false,
      func7val: false,
      func8val: false,
      func9val: false,
    };

    this.func1 = this.func1.bind(this);
    this.func2 = this.func2.bind(this);
    this.func3 = this.func3.bind(this);
    this.func4 = this.func4.bind(this);
    this.func5 = this.func5.bind(this);
    this.func6 = this.func6.bind(this);
    this.func7 = this.func7.bind(this);
    this.func8 = this.func8.bind(this);
    this.func9 = this.func9.bind(this);

    this.counter = bonds.makeContract('0x648bb3a4ac5f6c49d51c3dd13a7d855a9beccebb', CounterABI);
  };

  func1(){this.setState({func1val: true});}
  func2(){this.setState({func2val: true});}
  func3(){this.setState({func3val: false});}
  func4(){
    this.customerNote  = this.counter.getInsuranceNote(this.customerDuration);
    this.setState({func4val: true});
  }

  func5(){
    this.counter.payInsurance(this.insuranceDuration,{value: 20000, gas: 300000});
    //bonds.post({to: '0x648bb3a4ac5f6c49d51c3dd13a7d855a9beccebb', value: this.insurancePayment});
    this.setState({func5val: true});
  }
  func6(){this.setState({func6val: false});}
  func7(){this.setState({func7val: true});}
  func8(){this.setState({func8val: true});}
  func9(){this.setState({func9val: true});}

  componentWillMount() { this.componentWillReceiveProps(this.props); }
  componentWillReceiveProps (props) {
    this.customerNumber = this.counter.getCustomerNumber();
    this.hospitalNumber = this.counter.getHospitalNumber();
    this.customer = this.counter.customers(bonds.me);
    this.hospital = this.counter.hospitals(bonds.me);
    
  }



  render () {
    return (
      <div>
        
         

          <h4>Generic functions</h4>
          <BButton content="Patient Number in SS-Insurance" onClick={this.func1}/>
          { this.state.func1val ? <Rspan> {this.customerNumber.map(_=>_.toString())}  </Rspan> : <span></span> }
          <br/><br/>

          <BButton content="Hospital Number in SS-Insurance" onClick={this.func2}/>
          { this.state.func2val ? <Rspan> {this.hospitalNumber.map(_=>_.toString())}  </Rspan> : <span></span> }
          <br/><br/>

          <h4>Hospital function</h4>   
          <BButton content="Hospital : Make Contract Offer" onClick={this.func3}/>
          { this.state.func3val ? <Rspan> {this.hospitalNumber.map(_=>_.toString())}  </Rspan> : <span></span> }
          <br/><br/>


          <BButton content="Hospital : Check End Date of Contract" onClick={this.func9}/>
          { this.state.func9val ? <Rspan> {this.hospital[1].map(_=>_.toString())}  </Rspan> : <span></span> }
          <br/><br/>

          <h4>Patient functions</h4>

          <BButton content="Patient : Insurance Note" onClick={this.func4}/>
          <InputBond bond={this.customerDuration} placeholder="Planned duration"/>
          { this.state.func4val ? <Rspan> {this.customerNote.map(_=>_.toString())}  </Rspan> : <span></span> }
          <br/><br/>
          


          <BButton content="Patient : Pay Insurance" onClick={this.func5}/>
          <InputBond bond={this.insuranceDuration} placeholder="Insurance duration"/>
          <InputBond bond={this.insurancePayment} placeholder="Insurance payment"/>
          { this.state.func5val ? <span> "Done" </span> : <span></span> }
          <br/><br/>

          <BButton content="Patient : Pay to Hospital from Insurance" onClick={this.func6}/>
          { this.state.func6val ? <Rspan> {this.hospitalNumber.map(_=>_.toString())}  </Rspan> : <span></span> }
          <br/><br/>
          <BButton content="Patient : Check End Date of Insurance" onClick={this.func7}/>
          { this.state.func7val ? <Rspan> {this.customer[1].map(_=>_.toString())}  </Rspan> : <span></span> }
          <br/><br/>
          <BButton content="Patient : Check Remaining Insurance" onClick={this.func8}/>
          { this.state.func8val ? <Rspan> {this.customer[2].map(_=>_.toString())}   </Rspan> : <span></span> }
          <br/><br/>

      </div>
      );
  }
}
