import React, { Component } from 'react';

export default class GreyCastle extends Component{
  render() {
    return <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
	 		width={this.props.size} height={this.props.size} viewBox="0 0 164.783 164.784" style={{"enableBackground": "new 0 0 164.783 164.784"}}>
			<path style={{fill:"#000000"}} d="M164.783,82.393c0,45.504-36.889,82.392-82.393,82.392C36.888,164.784,0,127.896,0,82.393
				S36.888,0,82.391,0C127.895,0,164.783,36.889,164.783,82.393"/>
			<g>
				<g>
					<defs>
						<rect id="SVGID_1_" x="25.711" y="29.634" width="56.681" height="108.84"/>
					</defs>
					<clipPath id="SVGID_2_">
						<use href="#SVGID_1_"  style={{overflow: "visible"}}/>
					</clipPath>
					<polygon style={{"clipPath":"url(#SVGID_2_)",fill:"#eeeeee"}} points="82.391,138.474 25.71,105.748 53.259,29.634 		"/>
				</g>
			</g>
			<g>
				<g>
					<defs>
						<rect id="SVGID_3_" x="82.392" y="29.634" width="56.683" height="108.84"/>
					</defs>
					<clipPath id="SVGID_4_">
						<use href="#SVGID_3_"  style={{overflow:"visible"}}/>
					</clipPath>
					<polygon style={{"clipPath":"url(#SVGID_4_)", fill:"#eeeeee"}} points="82.391,138.474 139.072,105.748 111.523,29.634 		"/>
				</g>
			</g>
			<g>
				<g>
					<defs>
						<rect id="SVGID_5_" x="25.711" y="29.634" width="113.363" height="108.84"/>
					</defs>
					<clipPath id="SVGID_6_">
						<use href="#SVGID_5_"  style={{overflow:"visible"}}/>
					</clipPath>
					<polygon style={{"clipPath":"url(#SVGID_6_)", fill:"#aaaaaa"}} points="25.711,105.749 82.392,29.633 139.071,105.749 82.392,138.474 		
						"/>
				</g>
			</g>
			</svg>;
  }
}

