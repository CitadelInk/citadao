import React, { Component } from 'react';
import { connect } from 'react-redux';
import actions from '../../actions';

const {
	gotoUserPage,
	setWalletData
} = actions;


class ComposeHeader extends Component {
	 constructor(props) {
		 super(props);
		  this.handlePostTitleChange = this.handlePostTitleChange.bind(this);
	}


	render() {
		const style = {
				height: '50px',
				background:'#7FDBFF',
				width:'100%',
				position:'absolute',
				top:'0'
		}

		const titleStyle = {
			position:'relative',
			top:'15px'			
		}

		const inputStyle = {
			position:'relative',
			width:'90%',
			padding:'4px 6px',
			boxSizing:'border-box',
			border:'2px solid #ccc',
			borderRadius:'4px',
			resize:'none',
			height:'80%',
			top:'6px'
		}
			
		return (			
			<div style={style}>
				<span style={titleStyle}>Title: </span><input style={inputStyle} onChange={this.handlePostTitleChange} value={this.props.wallet.get('postTitleInput')} />
 			</div>
		);
	}



	handlePostTitleChange(e) {
		this.props.dispatch(setWalletData({postTitleInput : e.target.value}));
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(ComposeHeader)
