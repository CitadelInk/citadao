import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './landing.css';
import classNames from 'classnames/bind';
import { RaisedButton } from 'material-ui';
import appActions from '../../actions';
import { landingHeight, landingAddSection } from '../actions';
import ScrollController from '../helpers/scrollController';
import ScrollElement from './ScrollElement';
import { Card } from 'material-ui';


const {
	navigatePage,
	gotoHomePage
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
		this.props.dispatch(gotoHomePage());
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
							<li className={styles.liStyle}>C I T A D E L .ink</li>
							<li className={styles.liStyle}>Why?</li>
							<li className={styles.liStyle}>Tools</li>
							<li className={styles.liStyle}>More Info</li>
							<li className={styles.alphaStyle}><RaisedButton primary onClick={this.tryCitadelClicked} label="Try the Citadel Prototype Now!"/></li>
						</ul>
						</div>
					</div>
					<div className={styles.backgroundStyle}>
					</div>
					<div className={styles.containerStyle}>
					<ScrollElement addToScroll={landingAddSection} className={styles.elementStyle} name="citadel.ink">
						<Card className={styles.cardStyle}>
							<span className={styles.citadelHeader}>C I T A D E L</span>
							<p className={styles.pStyle}>
								A native Web 3 public social network
							</p>
						</Card>
						<Card className={styles.cardStyle}>
							<span className={styles.inkHeader}>.ink</span>
							<p className={styles.pStyle}>
								A protocol for decentralized social networks that links 
								content together to form explicit 
								graphs of communication (original posts, references, 
								and responses). With simple economic incentive 
								to discourage adding low quality content.
							</p>
						</Card>
					</ScrollElement>

					

					<ScrollElement addToScroll={landingAddSection} className={styles.elementStyle} name="problem cause solution">
							<Card className={styles.cardStyle}>
							<span className={styles.citadelH2Style}>Problem</span><br/>
							<span className={styles.bulletSpan}>Censorship</span><br/>
							<span className={styles.bulletSpan}h4>Disinformation</span><br/>
							<span className={styles.bulletSpan}h4>Echo Chambers & Noise</span><br/>
							<span className={styles.bulletSpan}>Toxic Discourse</span><br/>
							</Card>
							<Card className={styles.cardStyle}>
							<span className={styles.citadelH2Style}>Cause</span><br/>
							<span className={styles.bulletSpan}>Centralization</span><br/>
							<span className={styles.bulletSpan}>Destructive Economic Model</span><br/>
							</Card>
							<Card className={styles.cardStyle}>
							<span className={styles.citadelH2Style}>Solution</span><br/>
							<span className={styles.bulletSpan}>Decentralize</span><br/>
							<span className={styles.bulletSpan}>New Economic Model</span><br/>
							<span className={styles.bulletSpan}>Better Tools</span><br/>
							</Card>
					</ScrollElement>

					<ScrollElement addToScroll={landingAddSection} className={styles.elementStyle} name="ecosystem diagram">
						<Card className={styles.cardStyle}>
							<span className={styles.bulletSpan}>Diagram 1 - ecosystem</span><br/>
						</Card>
					</ScrollElement>

					<ScrollElement addToScroll={landingAddSection} className={elementClassnames} name="tools">
						<Card className={styles.cardStyle}>
							<span className={styles.bulletSpan}>Reference</span><br/>
						</Card>
						<Card className={styles.cardStyle}>
							<span className={styles.bulletSpan}>Reactions</span><br/>
						</Card>
						<Card className={styles.cardStyle}>
							<span className={styles.bulletSpan}>Request Response/Critique</span><br/>
						</Card>
					</ScrollElement>


					<ScrollElement addToScroll={landingAddSection} className={elementClassnames} name="more info">
						<Card className={styles.cardStyle}>
							email list sign up<br/>
							other links<br/>
						</Card>
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