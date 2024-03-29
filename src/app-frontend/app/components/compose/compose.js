import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './compose.css';
import ComposeRichText from './composeRichText';
import UserWidget from '../post/userWidget';

class Compose extends Component {
	constructor(props) {
		 super(props);
		 this.state = { image: null, width: '0', height: '0' };
		 this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		 }
	 
	 componentDidMount() {
		 this.updateWindowDimensions();
		 window.addEventListener('resize', this.updateWindowDimensions);
	 }
 
	 componentWillUnmount() {
		 window.removeEventListener('resize', this.updateWindowDimensions);
	 }
 
	 updateWindowDimensions() {
		 this.setState({ width: window.innerWidth, height: window.innerHeight });
	 }
 

	render() {
		var height = this.state.height - 210; //total height - header + tabs + name + file picker height
		return(
			<div className={styles.compose}>
				<UserWidget authorg={this.props.wallet.get('account')}/>
				<ComposeRichText 				
					value={this.props.value}
					  callback={this.props.callback}
					  onPostComplete={this.props.onPostComplete}
					height={height}
				/>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet } = state.core;

  return {wallet };
}

export default connect(mapStateToProps)(Compose)
