import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from "./Edge.css";
import Bezier from 'bezier-js';

class Edge extends Component{
  render() {
    const bez = new Bezier(
      {x:this.props.x1,y:this.props.y1},
      {x:this.props.x1 + 100, y:this.props.y1},
      {x:this.props.x2 - 250, y:this.props.y2},
      {x:this.props.x2, y:this.props.y2}
    );
    return <g>
      <path className={styles.path} d={bez.toSVG()}/>
    </g>;
  }
}

const mapStateToProps = state => { return {}; };

export default connect(mapStateToProps)(Edge);