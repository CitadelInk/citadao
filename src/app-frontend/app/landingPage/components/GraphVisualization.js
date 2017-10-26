import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from "./GraphVisualization.css";
import Node from "./Node";
import Edges from "./Edges";
import { setSvgSize, setStart } from '../actions';



class GraphVisualization extends Component{
  componentDidMount() {
    const {width, height} = this.container.getBoundingClientRect();
    this.props.dispatch(setSvgSize({width, height}));
    this.props.dispatch(setStart());
  }
  getActiveNode() {
    switch (this.props.selected) {
      case 0:
        return 0;
      case 1:
        return 3;
      case 2:
        return 10;
      case 3:
        return 15;
      case 4:
        return 37;
    }
  }
  render() {
    const activeNode = this.getActiveNode();
    return <div className={this.props.className}>
      <svg ref={container => this.container = container} width="100%" height="100%">
        <Edges nodes={this.props.points} selected={this.props.selected} />
        {this.props.points.map((item, index) => <Node key={index} active={index === activeNode} x={item[0]} y={item[1]} index={index} />)}
      </svg>
    </div>
  }
}

const mapStateToProps = state => {
  const { landing } = state.core;
  
  return {
    svgContainerSize: landing.get('svgContainerSize'),
    sections: landing.get('sections'), 
    top: landing.get('top'),
    selected: landing.get('selected'),
    points: landing.get('points')
  };
};


export default connect(mapStateToProps)(GraphVisualization);