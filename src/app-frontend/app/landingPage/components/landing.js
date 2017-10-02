import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './landing.css';
import classNames from 'classnames/bind';
import { RaisedButton } from 'material-ui';
import appActions from '../../actions';
import { landingHeight, landingAddSection } from '../actions';
import ScrollController from '../helpers/scrollController';
import ScrollElement from './ScrollElement';

const {
	navigatePage
} = appActions;

let cx = classNames.bind(styles);


var durationFn = function(deltaTop) {
    return deltaTop;
};

class Landing extends Component {
	constructor(props) {
	  super(props);
	  this.tryCitadelClicked = this.tryCitadelClicked.bind(this);
  }	
	
	componentDidMount() {
		this.scrollController = new ScrollController(this.props.dispatch.bind(this));
		this.props.dispatch(landingHeight(this.contianer.clientHeight));
	}

	componentWillUnmount() {
		this.ScrollController.cleanUp();
	}

	handleSetActive(to) {
	  console.log(to);
	}

	tryCitadelClicked(e) {
		this.props.dispatch(navigatePage({page:'home', route:'/'}));
	}

	render() {
		var menu = styles.menu;
		var toolbarMenu = styles.toolbarMenu;
		var navDivClassnames = cx({
			"collapse": true,
			"navbar-collapse":true
		});

		var ulStyle = styles.ulStyle;
		var ulClassnames = cx({
			ulStyle: true,
			"nav": true,
			"navbar-var": true
		})

		var elementStyle = styles.elementStyle;
		var elementClassnames = cx({
			elementStyle:true,
			"element": true
		})

		 return (
			<div className={styles.bodyStyle}>
				<div className={styles.scrollContainer} ref={contianer => this.contianer = contianer} style={{top: this.props.scrollPos}}>
					<div className={styles.headerStyle}>
						<div className={navDivClassnames} id="bs-example-navbar-collapse-1">
						<ul className={ulClassnames}>
							<li className={styles.liStyle}>Ink</li>
							<li className={styles.liStyle}>Citadel</li>
							<li className={styles.liStyle}>Test 3</li>
							<li className={styles.liStyle}>Test 4</li>
							<li className={styles.alphaStyle}><span onClick={this.tryCitadelClicked}>Try Citadel Alpha Now!</span></li>
						</ul>
						</div>
					</div>
					<div className={styles.backgroundStyle}>
					</div>
					<div className={styles.containerStyle}>
					<ScrollElement addToScroll={landingAddSection} className={elementClassnames} name="test1">
						<center>
						<span className={styles.inkStyle}>INK</span>
						<p className={styles.inkPStyle}>A web3-based public index consisting of content 
							hashes that can be linked together to form explicit 
							graphs of communication (original posts, references, 
							and responses) and the protocol needed to add to and 
							read from the index, with a simple economic incentive 
							to discourage adding low quality content.
						</p>
						</center>
					</ScrollElement>

					<ScrollElement addToScroll={landingAddSection} className={elementClassnames} name="test2">
						<center>
							<span className={styles.citadelStyle}>CITADEL</span>
							<p className={styles.citadelPStyle}>A native web3 social network built on top of the Ink protocol 
								and index that gives authorgs tools for [reading, digesting, 
								publishing, endorsing, responding] to [articles, opinions, 
								works-of-all-kinds] in a format that is designed to 
								promote more meaningful and trustworthy proliferation of information.
							</p>
						</center>
					</ScrollElement>

					<ScrollElement addToScroll={landingAddSection} className={elementClassnames} name="test3">
						test 3
					</ScrollElement>

					<ScrollElement addToScroll={landingAddSection} className={elementClassnames} name="test4">
						test 4
					</ScrollElement>
					</div>
				</div>
			</div>
	    );
	}
}


const mapStateToProps = state => {
	const { landing } = state.core;
  
	return { 
		scrollPos: landing.get('top')
	};
};

export default connect(mapStateToProps)(Landing)