import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './landing.css';
import classNames from 'classnames/bind';
import { RaisedButton } from 'material-ui';
import { FlatButton } from 'material-ui';
import appActions from '../../actions';
import { landingHeight, landingAddSection } from '../actions';
import ScrollController from '../helpers/scrollController';
import ScrollElement from './ScrollElement';
import { Card } from 'material-ui';
import inkIcon from './inkIcon.png';
import citadelIcon from './citadelIconLong.png';
import Hammer from 'hammerjs';
import {landingSectionTouch, landingSectionNav} from '../actions';
import GreyPen from './greypen';
import GreyCastle from './greycastle';
import img from './infographic.png';
import post from './LongformPost.png';
import respond from './ReferencePostV2.png';
import takeAction from './BountyPostV2.png';
import { Dialog } from 'material-ui';

import GraphVisualization from './GraphVisualization';

const {
	navigatePage,
	gotoHomePage,
	gotoPost
} = appActions;

let cx = classNames.bind(styles);


var durationFn = function(deltaTop) {
    return deltaTop;
};

class Landing extends Component {
	constructor(props) {
	 	super(props);
		this.handleClose = this.handleClose.bind(this);
		this.tryCitadelClicked = this.tryCitadelClicked.bind(this);
		var shouldOpen = true;
		if (!this.props.showMetaMaskOnLoad) {
			shouldOpen = false;
		}
		this.state = {
			open: shouldOpen
		}
		this.hammer = new Hammer(document.body);
		this.hammer.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
		this.handleSwipe = this.handleSwipe.bind(this);
		this.nav1 = this.nav1.bind(this);
		this.nav2 = this.nav2.bind(this);
		this.nav3 = this.nav3.bind(this);
		this.nav4 = this.nav4.bind(this);
		this.nav5 = this.nav5.bind(this);
		this.nav6 = this.nav6.bind(this);
		this.onCitadelWhitepaperClicked = this.onCitadelWhitepaperClicked.bind(this);
  }	
	
	componentDidMount() {
		this.scrollController = new ScrollController(this.props.dispatch.bind(this));
		this.hammer.on('swipe', this.handleSwipe);
		this.props.dispatch(landingHeight(this.contianer.clientHeight));
	}


	componentWillUnmount() {
		this.scrollController.cleanUp();
		this.scrollController = null;
		this.hammer.off('swipe', this.handleSwipe);
	}

	handleSwipe(e) {
		this.props.dispatch(landingSectionTouch(e.direction));
	}

	handleClose(e) {
		this.setState({open : false});
	}

	handleSetActive(to) {
	  console.log(to);
	}

	tryCitadelClicked(e) {
		if (this.props.network.isConnected) {
			this.props.dispatch(gotoHomePage());
		} else {
			this.setState({open : true});
		}
	}

	onMediumClicked(e) {
		window.open("https://medium.com/@team_59584/ink-citadel-dcf71be07b5", "_blank");
	}

	onCitadelWhitepaperClicked(e) {
		//http://citadel.ink/post/authorg/0xd109a0195fd5fbf8e29c28b23977cfcaa6cc74fe/sub/0x65f2d18fdcb4b6e8f1ab3d6bea2f43cf720165a8981756c1de1c22d5c5d16459/rev/0x65f2d18fdcb4b6e8f1ab3d6bea2f43cf720165a8981756c1de1c22d5c5d16459
		if (this.props.network.isConnected) {
			this.props.dispatch(gotoPost("0xd109a0195fd5fbf8e29c28b23977cfcaa6cc74fe", "0x5709eb58c16e689d752b5468c2ee33b2322c7211ceba2bd33a20eac13b45d548", "0xacad8f493e543112a43df1318829d1ecc3f3ef5a20504a61028e1894ec26cb10"))
		} else {
			this.setState({open : true})
		}
	}

	onEmailClicked(e) {
		window.location.href = "mailto:team@citadel.ink";
	}

	problemSection() {

		const problem = (
			<ul className={styles.pStyle}>
				<li>Bad actors spread <strong>disinformation</strong>.</li>
				<li><strong>Echo chambers</strong> reinforce entrenched opinions and dissent is lost amidst the <strong>noise</strong>.</li>
				<li>Hostile communication encounters no friction, and discourse turns <strong>toxic</strong>.</li>
				<li>Our social networks can be <strong>censored</strong> by corporations & authoritarians.</li>
			</ul>
		);

		const cause = (
			<ul className={styles.pStyle}>
				<li>The <strong>attention economy</strong>, where a user’s worth is measured in time exposed to ads.</li>
				<li>Platforms use <strong>psychological exploits</strong> to form habits in users and maximize time-on-site.</li>
				<li><strong>Centralized</strong> networks compile valuable private data and <strong>rigidly control</strong> the user experience to ensure that they capture attention.</li>
			</ul>
		);

		const solution = (
			<ul className={styles.pStyle}>
				<li>A <strong>decentralized</strong> social network on the Ethereum blockchain where private data isn’t collected and sold.</li>
				<li><strong>Intention economy</strong>, where users participate deliberately.</li>
				<li>Tipping and bounty systems that <strong>reward good faith users</strong>.</li>
				<li>Smart contracts that introduce <strong>economic friction</strong> to inhibit bad actors.</li>
				<li><strong>Better tools</strong> for users seeking trust.</li>
			</ul>
		)

		if (this.props.svgContainerSize.width > 450) {

			return (<ScrollElement addToScroll={landingAddSection} className={styles.elementStyle} name="problem cause solution">
					<div className={`${styles.cardStyle} ${styles.problemSection}`}>
					<h2>Problem</h2>
						{problem}
					</div>
					<div className={`${styles.cardStyle} ${styles.problemSection}`}>
					<h2>Cause</h2>
						{cause}
					</div>
					<div className={`${styles.cardStyle} ${styles.problemSection}`}>
					<h2>Solution</h2>
						{solution}
					</div>
			</ScrollElement>);
		} else {
			return [
				(<ScrollElement key="problem" addToScroll={landingAddSection} className={styles.elementStyle} name="problem">
					<div className={`${styles.cardStyle} ${styles.problemSection}`}>
					<h2>Problem</h2>
					{problem}
					</div>
				</ScrollElement>),
				(<ScrollElement key="cause" addToScroll={landingAddSection} className={styles.elementStyle} name="cause">
					<div className={`${styles.cardStyle} ${styles.problemSection}`}>
					<h2>Cause</h2>
					{cause}
					</div>
				</ScrollElement>),
				(<ScrollElement key="solution" addToScroll={landingAddSection} className={styles.elementStyle} name="solution">
					<div className={`${styles.cardStyle} ${styles.problemSection}`}>
					<h2>Solution</h2>
						{solution}
					</div>
				</ScrollElement>)
			];
		}
	}

	toolsSection(elementClassnames) {
		if (this.props.svgContainerSize.width > 450) {
			return <ScrollElement addToScroll={landingAddSection} className={elementClassnames} name="tools">
				<div className={styles.cardStyle}>
					<h2>Respond</h2>
					<img src={respond}/>
				</div>
				<div className={styles.cardStyle}>
					<h2>Post</h2>
					<img src={post}/>
				</div>
				<div className={styles.cardStyle}>
					<h2>Take Action</h2>
					<img src={takeAction}/>
				</div>
			</ScrollElement>;
		} else {
			return [
				<ScrollElement key="respond" addToScroll={landingAddSection} className={elementClassnames} name="respond">
					<div className={styles.cardStyle}>
						<h2>Respond</h2>
						<img src={respond}/>
					</div>
				</ScrollElement>,
				<ScrollElement key="post" addToScroll={landingAddSection} className={elementClassnames} name="post">
					<div className={styles.cardStyle}>
						<h2>Post</h2>
						<img src={post}/>
					</div>
				</ScrollElement>,
				<ScrollElement key="takeAction" addToScroll={landingAddSection} className={elementClassnames} name="takeAction">
					<div className={styles.cardStyle}>
						<h2>Take Action</h2>
						<img src={takeAction}/>
					</div>
				</ScrollElement>
			];
		}
	}

	active1() {
		return this.props.selected === 0;
	}
	active2() {
		if (this.props.svgContainerSize.width > 450) {
			return this.props.selected === 1;
		} else {
			return this.props.selected >= 1 && this.props.selected < 4;
		}
	}
	active3() {
		if (this.props.svgContainerSize.width > 450) {
			return this.props.selected === 2;
		} else {
			return this.props.selected === 4;
		}
	}
	active4() {
		if (this.props.svgContainerSize.width > 450) {
			return this.props.selected === 3;
		} else {
			return this.props.selected > 4 && this.props.selected <= 7;
		}
	}
	active5() {
		if (this.props.svgContainerSize.width > 450) {
			return this.props.selected === 4;
		} else {
			return this.props.selected === 8;
		}
	}
	active6() {
		if (this.props.svgContainerSize.width > 450) {
			return this.props.selected === 5;
		} else {
			return this.props.selected >= 9;
		}
	}

	nav1() {
		this.props.dispatch(landingSectionNav(0));		
	}
	nav2() {
		this.props.dispatch(landingSectionNav(1));
	}
	nav3() {
		if (this.props.svgContainerSize.width > 450) {
			this.props.dispatch(landingSectionNav(2));
		} else {
			this.props.dispatch(landingSectionNav(5));
		}
	}
	nav4() {
		if (this.props.svgContainerSize.width > 450) {
			this.props.dispatch(landingSectionNav(3));
		} else {
			this.props.dispatch(landingSectionNav(8));
		}
	}
	nav5() {
		if (this.props.svgContainerSize.width > 450) {
			this.props.dispatch(landingSectionNav(4));
		} else {
			this.props.dispatch(landingSectionNav(9));
		}
	}
	nav6() {
		if (this.props.svgContainerSize.width > 450) {
			this.props.dispatch(landingSectionNav(5));
		} else {
			this.props.dispatch(landingSectionNav(10));
		}
	}

	createEmailMarkup() {
	  return {__html: `<!-- Begin MailChimp Signup Form -->
			<link href="//cdn-images.mailchimp.com/embedcode/classic-10_7.css" rel="stylesheet" type="text/css">
			<style type="text/css">
				#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; color: #000; }
				/* Add your own MailChimp form style overrides in your site stylesheet or in this style block.
				   We recommend moving this block and the preceding CSS link to the HEAD of your HTML file. */
			</style>
			<div id="mc_embed_signup">
			<form action="https://160.us16.list-manage.com/subscribe/post?u=0b3bab930b7a7cecdd3b65b94&amp;id=d3a02644e3" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
			    <div id="mc_embed_signup_scroll">
				<h2>Subscribe to our mailing list</h2>
			<div class="indicates-required"><span class="asterisk">*</span> indicates required</div>
			<div class="mc-field-group">
				<label for="mce-EMAIL">Email Address  <span class="asterisk">*</span>
			</label>
				<input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL">
			</div>
				<div id="mce-responses" class="clear">
					<div class="response" id="mce-error-response" style="display:none"></div>
					<div class="response" id="mce-success-response" style="display:none"></div>
				</div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
			    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_0b3bab930b7a7cecdd3b65b94_d3a02644e3" tabindex="-1" value=""></div>
			    <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>
			    </div>
			</form>
			</div>
			<script type='text/javascript' src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script><script type='text/javascript'>(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='BIRTHDAY';ftypes[3]='birthday';}(jQuery));var $mcj = jQuery.noConflict(true);</script>
			<!--End mc_embed_signup-->`
		};
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
		})

		const liStyle = liStyle;
		const liClassName1 = cx({
			liStyle: true,
			active: this.active1()
		});
		const liClassName2 = cx({
			liStyle: true,
			active: this.active2()
		});
		const liClassName3 = cx({
			liStyle: true,
			active:  this.active3()
		});
		const liClassName4 = cx({
			liStyle: true,
			active: this.active4()
		});
		const liClassName5 = cx({
			liStyle: true,
			active: this.active5()
		});
		const liClassName6 = cx({
			liStyle: true,
			active: this.active6()
		});

		var elementStyle = styles.elementStyle;
		var elementClassnames = cx({
			elementStyle:true,
			"element": true
		})

		const actions = [
			<FlatButton
			label="I'll do that later"
			onClick={this.handleClose}
			/>,
		];

		 return (
			<div className={styles.bodyStyle}>
					<Dialog
						title="Install MetaMask to use prototype"
						actions={actions}
						modal={false}
						open={this.state.open}
						onRequestClose={this.handleClose}
					><p>In order to use the prototype, you must use the Google Chrome browser with the MetaMask extension installed.
						Once it is installed and set-up, please set the network to 'Custom RPC' with URL = 'http://citadel.ink:8545' and refresh the page.
					</p>
					<a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">Click here to install MetaMask</a>
					</Dialog>
				<div className={styles.scrollContainer} ref={contianer => this.contianer = contianer} style={{top: this.props.scrollPos}}>
					<div className={styles.headerStyle}>
						<div className={navDivClassnames} id="bs-example-navbar-collapse-1">
							<ul className={ulClassnames}>
								<li className={styles.topLogo}><GreyCastle size={70} /></li>
								<li onClick={this.nav1} className={`${liClassName1} ${styles.websiteName}`}>C I T A D E L .ink</li>
								<li onClick={this.nav2} className={liClassName2}>Why?</li>
								<li onClick={this.nav3} className={liClassName3}>Ecosystem</li>
								<li onClick={this.nav4} className={liClassName4}>Tools</li>
								<li onClick={this.nav5} className={liClassName5}>More Info</li>
								<li onClick={this.nav6} className={liClassName6}>Whitepaper</li>
								<li className={styles.alphaStyle}>
									<button
										className={styles.ctaDesktop}
										onClick={this.tryCitadelClicked}>
											Try the Citadel Prototype Now!
									</button>
								</li>
							</ul>
						</div>
					</div>
					<GraphVisualization className={styles.backgroundStyle}>
					</GraphVisualization>
					<div className={styles.containerStyle}>
					<ScrollElement addToScroll={landingAddSection} className={styles.elementStyle} name="citadel.ink">
						<div className={`${styles.cardStyle} ${styles.titleCard}`}>
							<h2>
								<GreyCastle size={80} /> <span>CITADEL</span>
							</h2>
							<p className={styles.pStyle}>
								A native Web 3 public social network, built on the ink protocol, 
								that gives users tools for better discussions and respects their attention.
							</p>
						</div>
						<div className={`${styles.cardStyle} ${styles.titleCard}`}>
						<h2>
								<GreyPen size={80} /> <span><i>ink</i></span>
						</h2>
							<p className={styles.pStyle}>
								A protocol for decentralized social networks that links 
								content together to form explicit 
								graphs of communication (original posts, references, 
								and responses) with a simple economic incentive 
								to discourage adding low quality content, raising signal:noise.
							</p>
						</div>
					</ScrollElement>

					
					{this.problemSection()}


					<ScrollElement addToScroll={landingAddSection} className={styles.elementStyle} name="ecosystem diagram">
						<div className={`${styles.cardStyle} ${styles.ecoCard}`}>
							<img className={styles.image} src={img} />
						</div>
					</ScrollElement>

					{this.toolsSection(elementClassnames)}


					<ScrollElement addToScroll={landingAddSection} className={elementClassnames} name="more info">
						<div className={`${styles.cardStyle} ${styles.emailForm}`} dangerouslySetInnerHTML={this.createEmailMarkup()} />
					</ScrollElement>

					<ScrollElement addToScroll={landingAddSection} className={elementClassnames} name="white paper">
						<div className={`${styles.cardStyle} ${styles.whitepaper}`}>
							<h2>Whitepaper</h2>
							<p className={styles.pStyle}>
							<a href="#" style={{"color":"white"}} onClick={this.onMediumClicked}>Read Whitepaper on Medium</a><br/>
							<a href="./whitepaper/citadel_ink_whitepaper_DRAFT_1.pdf" download style={{"color":"white"}}><u>Download whitepaper as PDF</u></a><br/>
							<a href="#" style={{"color":"white"}} onClick={this.onCitadelWhitepaperClicked}><u>Read Whitepaper on Citadel.ink</u></a> (requires metamask)<br/>
							-----------------------------<br/>
							<a href="#" style={{"color":"white"}} onClick={this.onEmailClicked}><u>Email team@citadel.ink</u></a>
							</p>
						</div>
					</ScrollElement>
					</div>
				</div>
			</div>
	    );
	}
}


const mapStateToProps = state => {
	const { landing, network } = state.core;
  
	return {
		svgContainerSize: landing.get('svgContainerSize'),
		scrollPos: landing.get('top'),
		selected: landing.get('selected'),
		network
	};
};

export default connect(mapStateToProps)(Landing)