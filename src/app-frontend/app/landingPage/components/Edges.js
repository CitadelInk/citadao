import React, { Component } from 'react';
import Edge from './Edge';


export default class Edges extends Component{
  renderScreen0() {
    return <g>
      {[
        <Edge key="1" p1={this.props.nodes[2]} p2={this.props.nodes[0]} currentLayer={0}/>,
        <Edge key="2" p1={this.props.nodes[0]} p2={this.props.nodes[9]} currentLayer={1}/>,
        <Edge key="3" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={1}/>
      ]}
    </g>;
  }
  renderScreen1() {
    return <g>
      {[
        <Edge key="1" p1={this.props.nodes[2]} p2={this.props.nodes[0]} currentLayer={0}/>,
        <Edge key="2" p1={this.props.nodes[0]} p2={this.props.nodes[9]} currentLayer={1}/>,
        <Edge key="3" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={1}/>,
        <Edge key="5" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={0}/>,
        <Edge key="6" p1={this.props.nodes[3]} p2={this.props.nodes[10]} currentLayer={1}/>,
        <Edge key="7" p1={this.props.nodes[3]} p2={this.props.nodes[12]} currentLayer={1}/>,
        <Edge key="8" p1={this.props.nodes[3]} p2={this.props.nodes[17]} currentLayer={1}/>,
        <Edge key="9" p1={this.props.nodes[16]} p2={this.props.nodes[9]} currentLayer={2}/>,
        <Edge key="10" p1={this.props.nodes[18]} p2={this.props.nodes[9]} currentLayer={2}/>
      ]}
    </g>;
  }
  renderScreen2() {
    return <g>
      {[
        <Edge key="1" p1={this.props.nodes[2]} p2={this.props.nodes[0]} currentLayer={0}/>,
        <Edge key="2" p1={this.props.nodes[0]} p2={this.props.nodes[9]} currentLayer={1}/>,
        <Edge key="3" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={1}/>,
        <Edge key="5" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={0}/>,
        <Edge key="6" p1={this.props.nodes[3]} p2={this.props.nodes[10]} currentLayer={1}/>,
        <Edge key="6X" p1={this.props.nodes[3]} p2={this.props.nodes[10]} currentLayer={0}/>,
        <Edge key="7" p1={this.props.nodes[3]} p2={this.props.nodes[12]} currentLayer={1}/>,
        <Edge key="8" p1={this.props.nodes[3]} p2={this.props.nodes[17]} currentLayer={1}/>,
        <Edge key="9" p1={this.props.nodes[16]} p2={this.props.nodes[9]} currentLayer={2}/>,
        <Edge key="10" p1={this.props.nodes[18]} p2={this.props.nodes[9]} currentLayer={2}/>,
        <Edge key="11" p1={this.props.nodes[18]} p2={this.props.nodes[23]} currentLayer={3}/>,   
        <Edge key="12" p1={this.props.nodes[18]} p2={this.props.nodes[32]} currentLayer={3}/>,   
        <Edge key="13" p1={this.props.nodes[18]} p2={this.props.nodes[30]} currentLayer={3}/>,   
        <Edge key="14" p1={this.props.nodes[10]} p2={this.props.nodes[11]} currentLayer={1}/>,   
        <Edge key="15" p1={this.props.nodes[10]} p2={this.props.nodes[14]} currentLayer={1}/>,   
        <Edge key="16" p1={this.props.nodes[10]} p2={this.props.nodes[15]} currentLayer={1}/>,
        <Edge key="17" p1={this.props.nodes[17]} p2={this.props.nodes[41]} currentLayer={3}/>,   
        <Edge key="18" p1={this.props.nodes[17]} p2={this.props.nodes[35]} currentLayer={3}/>,   
        <Edge key="19" p1={this.props.nodes[12]} p2={this.props.nodes[28]} currentLayer={3}/>,   
        <Edge key="19X" p1={this.props.nodes[12]} p2={this.props.nodes[20]} currentLayer={3}/>,   
        <Edge key="20" p1={this.props.nodes[17]} p2={this.props.nodes[21]} currentLayer={3}/> 

      ]}
    </g>;
  }
  renderScreen3() {
    return <g>
      {[
        <Edge key="1" p1={this.props.nodes[2]} p2={this.props.nodes[0]} currentLayer={0}/>,
        <Edge key="2" p1={this.props.nodes[0]} p2={this.props.nodes[9]} currentLayer={1}/>,
        <Edge key="3" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={1}/>,
        <Edge key="5" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={0}/>,
        <Edge key="6" p1={this.props.nodes[3]} p2={this.props.nodes[10]} currentLayer={1}/>,
        <Edge key="6X" p1={this.props.nodes[3]} p2={this.props.nodes[10]} currentLayer={0}/>,
        <Edge key="7" p1={this.props.nodes[3]} p2={this.props.nodes[12]} currentLayer={1}/>,
        <Edge key="8" p1={this.props.nodes[3]} p2={this.props.nodes[17]} currentLayer={1}/>,
        <Edge key="9" p1={this.props.nodes[16]} p2={this.props.nodes[9]} currentLayer={2}/>,
        <Edge key="10" p1={this.props.nodes[18]} p2={this.props.nodes[9]} currentLayer={2}/>,
        <Edge key="11" p1={this.props.nodes[18]} p2={this.props.nodes[23]} currentLayer={3}/>,   
        <Edge key="12" p1={this.props.nodes[18]} p2={this.props.nodes[32]} currentLayer={3}/>,   
        <Edge key="13" p1={this.props.nodes[18]} p2={this.props.nodes[30]} currentLayer={3}/>,   
        <Edge key="14" p1={this.props.nodes[10]} p2={this.props.nodes[11]} currentLayer={1}/>,   
        <Edge key="15" p1={this.props.nodes[10]} p2={this.props.nodes[14]} currentLayer={1}/>,   
        <Edge key="16" p1={this.props.nodes[10]} p2={this.props.nodes[15]} currentLayer={1}/>,
        <Edge key="16X" p1={this.props.nodes[10]} p2={this.props.nodes[15]} currentLayer={0}/>,
        <Edge key="17" p1={this.props.nodes[17]} p2={this.props.nodes[41]} currentLayer={3}/>,   
        <Edge key="18" p1={this.props.nodes[17]} p2={this.props.nodes[35]} currentLayer={3}/>,   
        <Edge key="19X" p1={this.props.nodes[12]} p2={this.props.nodes[20]} currentLayer={3}/>,   
        <Edge key="19" p1={this.props.nodes[12]} p2={this.props.nodes[28]} currentLayer={3}/>,   
        <Edge key="20" p1={this.props.nodes[17]} p2={this.props.nodes[21]} currentLayer={3}/>,
        <Edge key="21" p1={this.props.nodes[11]} p2={this.props.nodes[23]} currentLayer={3}/>,
        <Edge key="22" p1={this.props.nodes[14]} p2={this.props.nodes[26]} currentLayer={3}/>,
        <Edge key="23" p1={this.props.nodes[14]} p2={this.props.nodes[27]} currentLayer={3}/>,
        <Edge key="24" p1={this.props.nodes[14]} p2={this.props.nodes[33]} currentLayer={3}/>,
        <Edge key="25" p1={this.props.nodes[15]} p2={this.props.nodes[39]} currentLayer={1}/>,
        <Edge key="26" p1={this.props.nodes[15]} p2={this.props.nodes[37]} currentLayer={1}/>
      ]}
    </g>;
  }
  renderScreen4() {
    return <g>
      {[
        <Edge key="1" p1={this.props.nodes[2]} p2={this.props.nodes[0]} currentLayer={0}/>,
        <Edge key="2" p1={this.props.nodes[0]} p2={this.props.nodes[9]} currentLayer={1}/>,
        <Edge key="3" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={1}/>,
        <Edge key="5" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={0}/>,
        <Edge key="6" p1={this.props.nodes[3]} p2={this.props.nodes[10]} currentLayer={1}/>,
        <Edge key="6X" p1={this.props.nodes[3]} p2={this.props.nodes[10]} currentLayer={0}/>,
        <Edge key="7" p1={this.props.nodes[3]} p2={this.props.nodes[12]} currentLayer={1}/>,
        <Edge key="8" p1={this.props.nodes[3]} p2={this.props.nodes[17]} currentLayer={1}/>,
        <Edge key="9" p1={this.props.nodes[16]} p2={this.props.nodes[9]} currentLayer={2}/>,
        <Edge key="10" p1={this.props.nodes[18]} p2={this.props.nodes[9]} currentLayer={2}/>,
        <Edge key="11" p1={this.props.nodes[18]} p2={this.props.nodes[23]} currentLayer={3}/>,   
        <Edge key="12" p1={this.props.nodes[18]} p2={this.props.nodes[32]} currentLayer={3}/>,   
        <Edge key="13" p1={this.props.nodes[18]} p2={this.props.nodes[30]} currentLayer={3}/>,   
        <Edge key="14" p1={this.props.nodes[10]} p2={this.props.nodes[11]} currentLayer={1}/>,   
        <Edge key="15" p1={this.props.nodes[10]} p2={this.props.nodes[14]} currentLayer={1}/>,   
        <Edge key="16" p1={this.props.nodes[10]} p2={this.props.nodes[15]} currentLayer={1}/>,
        <Edge key="16X" p1={this.props.nodes[10]} p2={this.props.nodes[15]} currentLayer={0}/>,
        <Edge key="17" p1={this.props.nodes[17]} p2={this.props.nodes[41]} currentLayer={3}/>,   
        <Edge key="18" p1={this.props.nodes[17]} p2={this.props.nodes[35]} currentLayer={3}/>,   
        <Edge key="19X" p1={this.props.nodes[12]} p2={this.props.nodes[20]} currentLayer={3}/>,   
        <Edge key="19" p1={this.props.nodes[12]} p2={this.props.nodes[28]} currentLayer={3}/>,   
        <Edge key="20" p1={this.props.nodes[17]} p2={this.props.nodes[21]} currentLayer={3}/>,
        <Edge key="21" p1={this.props.nodes[11]} p2={this.props.nodes[23]} currentLayer={3}/>,
        <Edge key="22" p1={this.props.nodes[14]} p2={this.props.nodes[26]} currentLayer={3}/>,
        <Edge key="23" p1={this.props.nodes[14]} p2={this.props.nodes[27]} currentLayer={3}/>,
        <Edge key="24" p1={this.props.nodes[14]} p2={this.props.nodes[33]} currentLayer={3}/>,
        <Edge key="25" p1={this.props.nodes[15]} p2={this.props.nodes[39]} currentLayer={1}/>,
        <Edge key="26" p1={this.props.nodes[15]} p2={this.props.nodes[37]} currentLayer={1}/>,
        <Edge key="26X" p1={this.props.nodes[15]} p2={this.props.nodes[37]} currentLayer={0}/>,
        <Edge key="28" p1={this.props.nodes[39]} p2={this.props.nodes[51]} currentLayer={3}/>,
        <Edge key="29" p1={this.props.nodes[39]} p2={this.props.nodes[56]} currentLayer={3}/>,
        <Edge key="30" p1={this.props.nodes[39]} p2={this.props.nodes[53]} currentLayer={3}/>,
        <Edge key="31" p1={this.props.nodes[37]} p2={this.props.nodes[52]} currentLayer={1}/>,
        <Edge key="32" p1={this.props.nodes[37]} p2={this.props.nodes[44]} currentLayer={1}/>,
        <Edge key="33" p1={this.props.nodes[37]} p2={this.props.nodes[50]} currentLayer={1}/>,
      ]}
    </g>;
  }
  render() {
    if (!this.props.nodes.length) {
      return null;
    }
    switch (this.props.selected) {
      case 0:
        return this.renderScreen0();
      case 1:
        return this.renderScreen1();
      case 2:
        return this.renderScreen2();
      case 3:
        return this.renderScreen3();
      case 4:
      default:
        return this.renderScreen4();
    }
  }
}

