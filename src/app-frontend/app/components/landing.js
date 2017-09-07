import React, { Component } from 'react';
import { connect } from 'react-redux';
import Scroll from 'react-scroll';
 
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
	 render() {
		var bodyStyle = {
			margin: '0 !important',
			padding: '0 !important',
			position:'relative'
		}
		var elementStyle = {
			height:'1000px',
			backgroundColor: '#ededed',
			fontSize: '45px',
			borderTop:'1px solid #000',
			paddingTop:'55px',
			paddingLeft:'10px'
		}

		var headerStyle = {
			position:'fixed',
			top:'0px',
			zIndex:'1000',
			width:'100%',
			height:'50px'
		}

		var containerStyle = {
			position:'relative',
			top:'50px'
		}
		
		var activeStyle = {
			color:'red !important'
		}
		
		var ulStyle = {
			listStyleType: 'none',
			margin: '0',
			padding: '0',
			overflow: 'hidden',
			backgroundColor: '#333333'
		}
		var liStyle = {
			float:'left',
			display:'block',
			color:'white',
			textAlign:'center',
			padding:'16px',
			textDecoration:'none'
		}

		var inkPStyle = {
			maxWidth:'400px',
			fontSize:'20pt',
			font:'arial',
			fontFamily:'sans-serif'
		}

		const inkStyle = {
			fontSize:'40pt',
			font:'arialBlack',
			fontFamily:'sans-serif'
		}

		var citadelPStyle = {
			maxWidth:'400px',
			fontSize:'20pt',
			font:'arial',
			fontFamily:'sans-serif'
		}

		const citadelStyle = {
			fontSize:'40pt',
			font:'arialBlack',
			fontFamily:'sans-serif'
		}
		
		 return (
			<div style={bodyStyle}>
				<div style={headerStyle}>
					<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul style={ulStyle} className="nav navbar-nav">
						<li style={liStyle}><Link activeClass="active" className="test1" to="test1" spy={true} smooth={true} duration={500} >Ink</Link></li>
						<li style={liStyle}><Link activeClass="active" className="test2" to="test2" spy={true} smooth={true} duration={500}>Citadel</Link></li>
						<li style={liStyle}><Link activeClass="active" className="test3" to="test3" spy={true} smooth={true} duration={500} >Test 3</Link></li>
						<li style={liStyle}><Link activeClass="active" className="test4" to="test4" spy={true} smooth={true} duration={500}>Test 4</Link></li>
					</ul>
					</div>
				</div>
				<div style={containerStyle}>
				<Element style={elementStyle} name="test1" className="element" >
					<center>
					<span style={inkStyle}>INK</span>
					<p style={inkPStyle}>A web3-based public index consisting of content 
						hashes that can be linked together to form explicit 
						graphs of communication (original posts, references, 
						and responses) and the protocol needed to add to and 
						read from the index, with a simple economic incentive 
						to discourage adding low quality content.
					</p>
					</center>
				</Element>

				<Element style={elementStyle} name="test2" className="element">
				<center>
				<span style={citadelStyle}>CITADEL</span>
					<p style={citadelPStyle}>A native web3 social network built on top of the Ink protocol 
						and index that gives authorgs tools for [reading, digesting, 
						publishing, endorsing, responding] to [articles, opinions, 
						works-of-all-kinds] in a format that is designed to 
						promote more meaningful and trustworthy proliferation of information.
					</p>
					</center>
				</Element>

				<Element style={elementStyle} name="test3" className="element">
				test 3
				</Element>

				<Element style={elementStyle} name="test4" className="element">
				test 4
				</Element>
				</div>
				
				<a onClick={this.scrollToTop}>To the top!</a>

			</div>
	    );
	}
}


const mapStateToProps = state => {
	const {  } = state;
  
	return { };
  }
  
  export default connect(mapStateToProps)(Landing)