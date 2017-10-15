import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from "./GraphVisualization.css";

class GraphVisualization extends Component{
  render() {
    return <div className={this.props.className}>
      <svg width="100%" height="100%">
        <circle cx="94%" cy="50px" r="10px" className={styles.circle}/>
      </svg>
    </div>
  }
}

const mapStateToProps = state => { return {}; };

export default connect(mapStateToProps)(GraphVisualization);