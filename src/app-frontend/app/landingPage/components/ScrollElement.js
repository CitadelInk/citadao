import React, { Component } from 'react';
import { connect } from 'react-redux';

class ScrollElement extends Component{
  componentDidMount() {
    this.props.dispatch(
      this.props.addToScroll({
        name:this.props.name, 
        top: this.container.offsetTop,
        height: this.container.clientHeight
      })
    );
  }
  render() {
    return <div ref={container => this.container = container} className={this.props.className}>
      { this.props.children }
    </div>
  }
}


const mapStateToProps = state => { return {}; };

export default connect(mapStateToProps)(ScrollElement);