import React from 'react';
import {Bond} from 'oo7';
import {Rspan} from 'oo7-react';
import {InputBond} from 'parity-reactive-ui';

import {bonds, formatBalance, formatBlockNumber} from 'oo7-parity';

export class App extends React.Component {
	constructor() {
		super();
		this.bond = new Bond();
	}
	render() {
		return (
			<div>
				<h1>Blockchain</h1>
				<InputBond bond={this.bond} placeholder="Go ahead and type some text"/>
				<Rspan>{this.bond}</Rspan>
				<br/><br/>
				
				<Rspan>{bonds.height}</Rspan>
				<br/><br/>

				Accounts available:&nbsp;
				<Rspan>
					{bonds.accounts.map(_=>_.join(', '))}
				</Rspan>

				<br/><br/>
				Default account:&nbsp;
				<Rspan>{bonds.me}</Rspan>



				<br/><br/>
				<Rspan>{bonds.registry.lookupAddress('Ahmet', 'A')}</Rspan>

				<br/><br/>
				<br/>
				Given the name of&nbsp;<Rspan>
					{bonds.accountsInfo[bonds.me].name}
				</Rspan>
			</div>
		);
	}
}