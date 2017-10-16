import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import styles from "./Node.css";


class Node extends Component{
  constructor(){
    super();
    this.name = uuid().substring(0, 12);
  }
  render() {
    return <g>
      <rect className={styles.node} width="120" height="25" x={this.props.x} y={this.props.y} rx="8" ry="8" />
      <text className={styles.text} x={this.props.x + 11} y={this.props.y + 18} fontSize="15">
        {this.name}
      </text>
    </g>
  }
}

const mapStateToProps = state => { return {}; };

export default connect(mapStateToProps)(Node);