import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from "./Node.css";


class Node extends Component{
  constructor(){
    super();
  }
  render() {
    let surrounding = [];
    if (this.props.active) {
      surrounding = [
        <circle key="1" className={styles.node} strokeWidth="2" cx={this.props.x} cy={this.props.y} r="3">
          <animate attributeType="XML" attributeName="r" from="3" to="21" dur="4s" repeatCount="indefinite" id="circ1"/>
          <animate attributeName="stroke-width" values="0;1;1;1;0" dur="4s" repeatCount="indefinite" begin="circ1.begin"/>
        </circle>,
        <circle key="2" className={styles.node} cx={this.props.x} strokeWidth="2" cy={this.props.y} r="3">
          <animate begin="1s;op.end+1s" attributeType="XML" attributeName="r" from="3" to="21" dur="4s" repeatCount="indefinite" id="circ2"/>
          <animate attributeName="stroke-width" values="0;1;1;1;0" dur="4s" repeatCount="indefinite" begin="circ2.begin"/>
        </circle>,
        <circle key="3" className={styles.node} cx={this.props.x} strokeWidth="2" cy={this.props.y} r="3">
          <animate begin="2s;op.end+2s" attributeType="XML" attributeName="r" from="3" to="21" dur="4s" repeatCount="indefinite" id="circ3"/>
          <animate attributeName="stroke-width" values="0;1;1;1;0" dur="4s" repeatCount="indefinite" begin="circ3.begin"/>
        </circle>
      ]
    }
    return <g>
      {surrounding}
      <circle className={styles.node} cx={this.props.x} cy={this.props.y} r="3"/>
    </g>
  }
}

const mapStateToProps = state => { return {}; };

export default connect(mapStateToProps)(Node);