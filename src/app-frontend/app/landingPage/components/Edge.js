import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from "./Edge.css";
import classNames from 'classnames/bind';
const cx = classNames.bind(styles);
class Edge extends Component{
  constructor() {
    super();
    this.state = {
      offset: 600,
      animate: true
    };
    this.animEnd = this.animEnd.bind(this);
  }
  componentDidMount() {
    this.anim.onend = this.animEnd;
  }
  componentWillUnmount() {
    this.anim.onend = null;
  }
  animEnd() {
    this.setState({
      offset: 0,
      animate: false
    });
  }

  animation() {
    const secondsFromStart = Math.floor((Date.now() - this.props.svgStartTime) / 1000);

    return <animate
      ref={anim => this.anim = anim}
      attributeName="stroke-dashoffset"
      from={600}
      to={0}
      dur="5s"
      onend={this.onend}
      begin={`${secondsFromStart}s`}
    />;
  }

  render() {
    const lineStyles = cx({
      line: true,
      line0: this.props.currentLayer === 0,
      line1: this.props.currentLayer === 1,
      line2: this.props.currentLayer === 2,
      line3: this.props.currentLayer === 3,
      [this.props.className]: true
    });
    return <g>
      <line
        className={lineStyles}
        x1={this.props.p1[0]} 
        x2={this.props.p2[0]}
        y1={this.props.p1[1]} 
        y2={this.props.p2[1]}
        strokeDasharray={500}
        strokeDashoffset={this.state.offset}
      >
        {this.animation()}
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