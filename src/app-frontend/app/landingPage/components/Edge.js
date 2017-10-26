import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from "./Edge.css";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
class Edge extends Component{
  render() {
    const lineStyles = cx({
      line: true,
      line0: this.props.currentLayer === 0,
      line1: this.props.currentLayer === 1,
      line2: this.props.currentLayer === 2,
      line3: this.props.currentLayer === 3,
      [this.props.className]: true
    });
    const secondsFromStart = Math.floor((Date.now() - this.props.svgStartTime) / 1000);
    const animation = this.props.noAnimation ? null : <animate attributeName="stroke-dashoffset" from={-350} to={700} dur="5s" begin={`${secondsFromStart}s`}/>;
    return <g>
      <line
        className={lineStyles}
        x1={this.props.p1[0]} 
        x2={this.props.p2[0]}
        y1={this.props.p1[1]} 
        y2={this.props.p2[1]}
        strokeDasharray={1000}
        strokeDashoffset={0}
      >
        {animation}
      </line>
    </g>;
  }
}

const mapStateToProps = state => {
  const { landing } = state.core;
  return {
    svgStartTime: landing.get('svgStartTime')
  };
};

export default connect(mapStateToProps)(Edge);