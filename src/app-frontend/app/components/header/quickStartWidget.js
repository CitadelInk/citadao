import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import styles from './quickStartWidget.css';
import { RaisedButton } from 'material-ui';

const {
	handleQuickStart
} = actions;

class QuickStartWidget extends Component {
	 constructor(props) {
		 super(props);

		 this.handleQuickStartClicked = this.handleQuickStartClicked.bind(this);
	}


	render() {			
		var ethBalance = this.props.wallet.get('ethBalance');
		var button = (<RaisedButton primary className={styles.button} onClick={this.handleQuickStartClicked} label="Click for Private ETH" />);
		if (ethBalance >= 1) {
			button = (<RaisedButton disabled className={styles.button} label="Click for Private ETH" />);
		}
		return (			
			<div className={styles.buyMoreWidget}>
				{button}
			</div>
		);
	}

	handleQuickStartClicked(e) {
		this.props.dispatch(handleQuickStart());
	}
}

const mapStateToProps = state => {
  const { router } = state;
  const { wallet } = state.core;

  return { wallet, router };
}

export default connect(mapStateToProps)(QuickStartWidget)
