import React, { Component } from 'react';
import localWeb3 from "../helpers/web3Helper"
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import PostSection from './postSection';


class ComposeBody extends Component {

	constructor(props) {
		super(props);
		this.state = { width: '0', height: '0' };
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

		var stateHeight = parseInt(this.state.height);
		var remainingHeight = stateHeight - 200;
		const calcheight = remainingHeight + 'px';
		const inputHeight = (remainingHeight - 2) + 'px';
		const style = {
			position:'absolute',
			background:'#F0F0F0',
			height:calcheight,
			top:'60px',
			bottom:'40px',			
			padding: '10px',
			width:'100%',
			overflow:'scroll'
		}

		const textStyle = {
			position:'absolute',
			top:'0',
			bottom:'0',
			left:'0',
			rigth:'0',
			//padding:'1em',
			minHeight:inputHeight,
			width:'100%'
		}
			

		return (			
			<div style={style}>
				<textarea style={textStyle} onChange={this.handlePostTextChange} value={this.props.wallet.get('postTextInput')}/><br />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, submissions } = state;

  return {wallet, submissions };
}

export default connect(mapStateToProps)(ComposeBody)
