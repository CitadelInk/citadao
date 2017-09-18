import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';
import ComposeRichText from './composeRichText';

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
		const style = {
			position:'relative',
			//maxHeight:calcheight,
			top:'15px',
			bottom:'0px',			
			//padding: '10px',
			//width:'100%',
			overflow:'scroll'
		}

		return (			
			<div style={style}>
				<ComposeRichText />
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
