import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions'

const {
	setWalletData
} = actions;

class ComposeBody extends Component {

	constructor(props) {
		super(props);
		this.state = { width: '0', height: '0' };
		this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
		this.handlePostTextChange = this.handlePostTextChange.bind(this);
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
			maxHeight:calcheight,
			top:'60px',
			bottom:'40px',			
			padding: '10px',
			width:'100%',
			overflow:'scroll'
		}

		const textStyle = {
			position:'absolute',
			top:'1',
			bottom:'1',
			left:'0',
			rigth:'0',
			//padding:'1em',
			minHeight:inputHeight,
			width:'98%'
		}
			

		return (			
			<div style={style}>
				<textarea style={textStyle} onChange={this.handlePostTextChange} value={this.props.wallet.get('postTextInput')}/><br />
			</div>
		);
	}

	handlePostTextChange(e) {
		this.props.dispatch(setWalletData({postTextInput : e.target.value}))
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(ComposeBody)
