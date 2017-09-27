import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import Posts from './panels/posts';
import EmptyLeft from './panels/emptyLeft';
import EmptyRight from './panels/emptyRight';
import Compose from './compose/compose';
import styles from './home.css';

class Home extends Component {
	 constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className={styles.page}>
				<div className={styles.compose}>
					<Compose />		
				</div>
				<div className={styles.posts}>
					<Posts postKeys={this.props.postKeys}/>	
				</div>				
				<div className={styles.empty}>
					<EmptyRight />
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
  const { wallet, postKeys } = state.core;

  return { wallet, postKeys };
}

export default connect(mapStateToProps)(Home)
