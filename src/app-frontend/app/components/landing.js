import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
import styles from './landing.css';
import classNames from 'classnames/bind';
import { RaisedButton } from 'material-ui';
import { push } from 'redux-little-router';


const {
	navigatePage
} = actions;
import actions from '../actions';

let cx = classNames.bind(styles);


var Link       = Scroll.Link;
var Element    = Scroll.Element;
var Events     = Scroll.Events;
var scroll     = Scroll.animateScroll;
var scrollSpy  = Scroll.scrollSpy;

var durationFn = function(deltaTop) {
    return deltaTop;
};

class Landing extends Component {
	constructor(props) {
	   super(props);
	   this.tryCitadelClicked = this.tryCitadelClicked.bind(this);
   	}	
	
	 componentDidMount() {
	
	   Events.scrollEvent.register('begin', function(to, element) {
		 console.log("begin", arguments);
	   });
	
	   Events.scrollEvent.register('end', function(to, element) {
		 console.log("end", arguments);
	   });
	
	   scrollSpy.update();
	
	 }

	 componentWillUnmount() {
	   Events.scrollEvent.remove('begin');
	   Events.scrollEvent.remove('end');
	 }

	 scrollToTop() {
	   scroll.scrollToTop();
	 }
	 scrollToBottom() {
	   scroll.scrollToBottom();
	 }
	 scrollTo() {
	   scroll.scrollTo(100);
	 }
	 scrollMore() {
	   scroll.scrollMore(100);
	 }
	 handleSetActive(to) {
	   console.log(to);
	 }

	tryCitadelClicked(e) {
		this.props.dispatch(push("/"));
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
				<div className={styles.headerStyle}>
					<div className={navDivClassnames} id="bs-example-navbar-collapse-1">
					<ul className={ulClassnames}>
						<li className={styles.liStyle}><Link activeClass="active" className="test1" to="test1" spy={true} smooth={true} duration={500} >Ink</Link></li>
						<li className={styles.liStyle}><Link activeClass="active" className="test2" to="test2" spy={true} smooth={true} duration={500}>Citadel</Link></li>
						<li className={styles.liStyle}><Link activeClass="active" className="test3" to="test3" spy={true} smooth={true} duration={500} >Test 3</Link></li>
						<li className={styles.liStyle}><Link activeClass="active" className="test4" to="test4" spy={true} smooth={true} duration={500}>Test 4</Link></li>
						<li className={styles.alphaStyle}><span onClick={this.tryCitadelClicked}>Try Citadel Alpha Now!</span></li>
					
					</ul>
					</div>
				</div>
				<div className={styles.backgroundStyle}>
				</div>
				<div className={styles.containerStyle}>
				<Element className={elementClassnames} name="test1">
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
				</Element>

				<Element className={elementClassnames} name="test2">
				<center>
				<span className={styles.citadelStyle}>CITADEL</span>
					<p className={styles.citadelPStyle}>A native web3 social network built on top of the Ink protocol 
						and index that gives authorgs tools for [reading, digesting, 
						publishing, endorsing, responding] to [articles, opinions, 
						works-of-all-kinds] in a format that is designed to 
						promote more meaningful and trustworthy proliferation of information.
					</p>
					</center>
				</Element>

				<Element className={elementClassnames} name="test3">
				test 3
				</Element>

				<Element className={elementClassnames} name="test4">
				test 4
				</Element>
				</div>
			</div>
	    );
	}
}


const mapStateToProps = state => {
	const {  } = state;
  
	return { };
  }
  
  export default connect(mapStateToProps)(Landing)