import React, { Component } from 'react';
import appContracts from 'app-contracts'
import { connect } from 'react-redux';
import Posts from './panels/posts';
import EmptyLeft from './panels/emptyLeft';
import EmptyRight from './panels/emptyRight';
import ComposePanel from './compose/composePanel';
import styles from './home.css';

import actions from '../actions';

const {
	getNext10Posts
} = actions;

class Home extends Component {
	 constructor(props) {
		super(props);this.handleScroll = this.handleScroll.bind(this);
	}

	componentDidMount() {
		this.scrollDiv.addEventListener('scroll', this.handleScroll);
	}

	render() {
		return (
			<div className={styles.page}>
				<div className={styles.compose}>
					<ComposePanel />		
				</div>
				<div className={styles.posts} ref={el => this.scrollDiv = el}>
					<Posts postKeys={this.props.postKeys} onScroll={this.postsScrolled}/>	
				</div>				
				<div className={styles.empty}>
					<EmptyRight />
				</div>
			</div>
		);
	}

	handleScroll(e) {
		var clientHeight = this.scrollDiv.clientHeight;
		var divPos = this.scrollDiv.scrollTop;
		var scrollHeight = this.scrollDiv.scrollHeight;
		
		var maxHeight = scrollHeight - clientHeight;

		
		if(divPos >= maxHeight - 200) {
			this.props.dispatch(getNext10Posts());
		}
		
	}
}

const mapStateToProps = state => {
  const { wallet, postKeys } = state.core;

  return { wallet, postKeys };
}

export default connect(mapStateToProps)(Home)
