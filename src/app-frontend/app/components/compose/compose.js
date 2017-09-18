import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './compose.css';
import ComposeRichText from './composeRichText';

class Compose extends Component {
	 constructor(props) {
		 super(props);
	}


	render() {
		return(
			<div className={styles.compose}>
				<ComposeRichText />
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet } = state;

  return {wallet };
}

export default connect(mapStateToProps)(Compose)
