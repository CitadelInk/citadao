import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from "./GraphVisualization.css";
import coords from "./gridCoords";
import Node from "./Node";
import Edge from "./Edge";

const getSection = (list, top) => {
  top = Math.abs(top);
  return list.reduce((acc, item, index) => {
    if (acc > 0) {
      return acc;
    }
    if (item.top > top) {
      return index;
    }
  }, 0);
};

class GraphVisualization extends Component{
  edgesFor2() {
    return [
      <Edge
        key={1}
        x1={coords[0][0] + 120}
        y1={coords[0][1] + 15}
        x2={coords[6][0]}
        y2={coords[6][1] + 15}
      />
    ]
  }

  edgesFor3() {
    return [
      <Edge
        key={1}
        x1={coords[0][0] + 120}
        y1={coords[0][1] + 15}
        x2={coords[6][0]}
        y2={coords[6][1] + 15}
      />,
      <Edge
        key={2}
        x1={coords[6][0] + 120}
        y1={coords[6][1] + 15}
        x2={coords[9][0]}
        y2={coords[9][1] + 15}
      />
    ]
  }

  render() {
    let edges;
    switch (getSection(this.props.sections, this.props.top)) {
      case 1:
        edges = [];
        break;
      case 2:
        edges = this.edgesFor2();
        break;
      case 3:
      default:
        edges = this.edgesFor3();
    }
    return <div className={this.props.className}>
      <svg width="100%" height="100%">
        {coords.map((item, index) => <Node key={index} x={item[0]} y={item[1]} />)}
        {edges}
      </svg>
    </div>
  }
}

const mapStateToProps = state => {
  const { landing } = state.core;
  
  return {
    sections: landing.get('sections'), 
    top: landing.get('top')
  };
};


export default connect(mapStateToProps)(GraphVisualization);