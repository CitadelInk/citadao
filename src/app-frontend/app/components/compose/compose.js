import React, { Component } from 'react';
import { connect } from 'react-redux';
import ComposeHeader from './composeHeader'
import ComposeBody from './composeBody'
import ComposeFooter from './composeFooter'

class Compose extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		/*const style = {
				position:'relative',
				background:'#FFFFFF',
				width:'100%',
				overflow:'hidden',
				float:'left'
		}*/

		return(
			<div/* style={style}*/>
				<ComposeHeader />
				<ComposeBody />
				<ComposeFooter />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(Compose)
