import React, { Component } from 'react';
import Edge from './Edge';


export default class Edges extends Component{
  renderScreen0() {
    return <g>
      {[
        <Edge key="1" p1={this.props.nodes[0]} p2={this.props.nodes[1]} currentLayer={1}/>,
        <Edge key="2" p1={this.props.nodes[0]} p2={this.props.nodes[2]} currentLayer={1}/>,
        <Edge key="3" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={1}/>,
        <Edge key="4" p1={this.props.nodes[2]} p2={this.props.nodes[3]} currentLayer={1}/>,
        <Edge key="5" p1={this.props.nodes[0]} p2={this.props.nodes[4]} currentLayer={1}/>,
        <Edge key="6" p1={this.props.nodes[1]} p2={this.props.nodes[2]} currentLayer={1}/>,
        <Edge key="7" p1={this.props.nodes[1]} p2={this.props.nodes[3]} currentLayer={1}/>,
        <Edge key="8" p1={this.props.nodes[4]} p2={this.props.nodes[3]} currentLayer={1}/>,
        <Edge key="9" p1={this.props.nodes[4]} p2={this.props.nodes[2]} currentLayer={1}/>
      ]}
    </g>;
  }
  renderScreen1() {
    return <g>
      {[
        <Edge key="3" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={0}/>,
        <Edge key="11" p1={this.props.nodes[11]} p2={this.props.nodes[2]} currentLayer={2}/>,
        <Edge key="12" p1={this.props.nodes[17]} p2={this.props.nodes[2]} currentLayer={2}/>,
        <Edge key="13" p1={this.props.nodes[12]} p2={this.props.nodes[7]} currentLayer={2}/>,
        <Edge key="14" p1={this.props.nodes[0]} p2={this.props.nodes[7]} currentLayer={2}/>,
        <Edge key="15" p1={this.props.nodes[12]} p2={this.props.nodes[10]} currentLayer={1}/>,
        <Edge key="16" p1={this.props.nodes[0]} p2={this.props.nodes[10]} currentLayer={1}/>,
        <Edge key="17" p1={this.props.nodes[11]} p2={this.props.nodes[10]} currentLayer={2}/>,
        <Edge key="18" p1={this.props.nodes[4]} p2={this.props.nodes[10]} currentLayer={2}/>,
        <Edge key="19" p1={this.props.nodes[3]} p2={this.props.nodes[5]} currentLayer={1}/>,
        <Edge key="20" p1={this.props.nodes[3]} p2={this.props.nodes[12]} currentLayer={1}/>,
        <Edge key="21" p1={this.props.nodes[5]} p2={this.props.nodes[12]} currentLayer={1}/>,
        <Edge key="22" p1={this.props.nodes[3]} p2={this.props.nodes[10]} currentLayer={1}/>,
        <Edge key="23" p1={this.props.nodes[3]} p2={this.props.nodes[11]} currentLayer={2}/>,
        <Edge key="24" p1={this.props.nodes[12]} p2={this.props.nodes[17]} currentLayer={2}/>,
        <Edge key="25" p1={this.props.nodes[12]} p2={this.props.nodes[13]} currentLayer={2}/>,
        <Edge key="26" p1={this.props.nodes[5]} p2={this.props.nodes[13]} currentLayer={2}/>,
        <Edge key="27" p1={this.props.nodes[12]} p2={this.props.nodes[20]} currentLayer={2}/>,
        <Edge key="28" p1={this.props.nodes[10]} p2={this.props.nodes[20]} currentLayer={2}/>,
        <Edge key="29" p1={this.props.nodes[5]} p2={this.props.nodes[0]} currentLayer={1}/>,
        <Edge key="30" p1={this.props.nodes[4]} p2={this.props.nodes[0]} currentLayer={2}/>,
        <Edge key="31" p1={this.props.nodes[4]} p2={this.props.nodes[3]} currentLayer={2}/>
      ]}
    </g>;
  }
  renderScreen2() {
    return <g>
      {[
        <Edge key="3" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={0}/>,
        <Edge key="22" p1={this.props.nodes[3]} p2={this.props.nodes[10]} currentLayer={0}/>,
        <Edge key="34" p1={this.props.nodes[11]} p2={this.props.nodes[10]} currentLayer={1}/>,
        <Edge key="35" p1={this.props.nodes[20]} p2={this.props.nodes[10]} currentLayer={1}/>,
        <Edge key="36" p1={this.props.nodes[3]} p2={this.props.nodes[11]} currentLayer={1}/>,
        <Edge key="37" p1={this.props.nodes[10]} p2={this.props.nodes[19]} currentLayer={1}/>,
        <Edge key="38" p1={this.props.nodes[19]} p2={this.props.nodes[11]} currentLayer={1}/>,
        <Edge key="39" p1={this.props.nodes[19]} p2={this.props.nodes[20]} currentLayer={1}/>,
        <Edge key="40" p1={this.props.nodes[3]} p2={this.props.nodes[20]} currentLayer={1}/>,
        <Edge key="41" p1={this.props.nodes[11]} p2={this.props.nodes[20]} currentLayer={1}/>,
        <Edge key="42" p1={this.props.nodes[3]} p2={this.props.nodes[19]} currentLayer={1}/>,
        <Edge key="43" p1={this.props.nodes[0]} p2={this.props.nodes[11]} currentLayer={2}/>,
        <Edge key="44" p1={this.props.nodes[3]} p2={this.props.nodes[17]} currentLayer={2}/>,
        <Edge key="45" p1={this.props.nodes[17]} p2={this.props.nodes[20]} currentLayer={2}/>,
        <Edge key="46" p1={this.props.nodes[25]} p2={this.props.nodes[20]} currentLayer={2}/>,
        <Edge key="47" p1={this.props.nodes[25]} p2={this.props.nodes[19]} currentLayer={2}/>,
        <Edge key="48" p1={this.props.nodes[3]} p2={this.props.nodes[22]} currentLayer={2}/>,
        <Edge key="49" p1={this.props.nodes[22]} p2={this.props.nodes[20]} currentLayer={2}/>,
        <Edge key="50" p1={this.props.nodes[3]} p2={this.props.nodes[9]} currentLayer={2}/>,
        <Edge key="51" p1={this.props.nodes[9]} p2={this.props.nodes[11]} currentLayer={2}/>,
        <Edge key="52" p1={this.props.nodes[11]} p2={this.props.nodes[26]} currentLayer={2}/>,
        <Edge key="53" p1={this.props.nodes[26]} p2={this.props.nodes[19]} currentLayer={2}/>
      ]}
    </g>;
  }
  renderScreen3() {
    return <g>
      {[
        <Edge key="3" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={0}/>,
        <Edge key="22" p1={this.props.nodes[3]} p2={this.props.nodes[10]} currentLayer={0}/>,
        <Edge key="37" p1={this.props.nodes[10]} p2={this.props.nodes[19]} currentLayer={0}/>,
        <Edge key="57" p1={this.props.nodes[10]} p2={this.props.nodes[20]} currentLayer={1}/>,
        <Edge key="58" p1={this.props.nodes[20]} p2={this.props.nodes[27]} currentLayer={1}/>,
        <Edge key="59" p1={this.props.nodes[14]} p2={this.props.nodes[27]} currentLayer={1}/>,
        <Edge key="60" p1={this.props.nodes[14]} p2={this.props.nodes[10]} currentLayer={1}/>,
        <Edge key="61" p1={this.props.nodes[14]} p2={this.props.nodes[19]} currentLayer={1}/>,
        <Edge key="62" p1={this.props.nodes[14]} p2={this.props.nodes[20]} currentLayer={1}/>,
        <Edge key="63" p1={this.props.nodes[19]} p2={this.props.nodes[27]} currentLayer={1}/>,
        <Edge key="64" p1={this.props.nodes[20]} p2={this.props.nodes[19]} currentLayer={1}/>,
        <Edge key="65" p1={this.props.nodes[3]} p2={this.props.nodes[20]} currentLayer={2}/>,
        <Edge key="66" p1={this.props.nodes[9]} p2={this.props.nodes[10]} currentLayer={2}/>,
        <Edge key="67" p1={this.props.nodes[9]} p2={this.props.nodes[14]} currentLayer={2}/>,
        <Edge key="68" p1={this.props.nodes[10]} p2={this.props.nodes[12]} currentLayer={2}/>,
        <Edge key="69" p1={this.props.nodes[10]} p2={this.props.nodes[15]} currentLayer={2}/>,
        <Edge key="70" p1={this.props.nodes[15]} p2={this.props.nodes[14]} currentLayer={2}/>,
        <Edge key="71" p1={this.props.nodes[20]} p2={this.props.nodes[12]} currentLayer={2}/>,
        <Edge key="72" p1={this.props.nodes[20]} p2={this.props.nodes[34]} currentLayer={2}/>,
        <Edge key="73" p1={this.props.nodes[20]} p2={this.props.nodes[36]} currentLayer={2}/>,
        <Edge key="74" p1={this.props.nodes[34]} p2={this.props.nodes[27]} currentLayer={2}/>,
        <Edge key="75" p1={this.props.nodes[36]} p2={this.props.nodes[27]} currentLayer={2}/>,
        <Edge key="76" p1={this.props.nodes[14]} p2={this.props.nodes[26]} currentLayer={2}/>,
        <Edge key="77" p1={this.props.nodes[26]} p2={this.props.nodes[27]} currentLayer={2}/>,
        <Edge key="78" p1={this.props.nodes[14]} p2={this.props.nodes[33]} currentLayer={2}/>,
        <Edge key="79" p1={this.props.nodes[33]} p2={this.props.nodes[27]} currentLayer={2}/>
      ]}
    </g>;
  }
  renderScreen4() {
    return <g>
      {[
        <Edge key="3" p1={this.props.nodes[0]} p2={this.props.nodes[3]} currentLayer={0}/>,
        <Edge key="22" p1={this.props.nodes[3]} p2={this.props.nodes[10]} currentLayer={0}/>,
        <Edge key="37" p1={this.props.nodes[10]} p2={this.props.nodes[19]} currentLayer={0}/>,
        <Edge key="63" p1={this.props.nodes[19]} p2={this.props.nodes[27]} currentLayer={0}/>,
        <Edge key="84" p1={this.props.nodes[19]} p2={this.props.nodes[31]} currentLayer={1}/>,
        <Edge key="85" p1={this.props.nodes[31]} p2={this.props.nodes[38]} currentLayer={1}/>,
        <Edge key="86" p1={this.props.nodes[38]} p2={this.props.nodes[33]} currentLayer={1}/>,
        <Edge key="87" p1={this.props.nodes[33]} p2={this.props.nodes[19]} currentLayer={1}/>,
        <Edge key="88" p1={this.props.nodes[27]} p2={this.props.nodes[38]} currentLayer={1}/>,
        <Edge key="89" p1={this.props.nodes[31]} p2={this.props.nodes[33]} currentLayer={1}/>,
        <Edge key="90" p1={this.props.nodes[27]} p2={this.props.nodes[33]} currentLayer={1}/>,
        <Edge key="91" p1={this.props.nodes[27]} p2={this.props.nodes[31]} currentLayer={1}/>,
        <Edge key="92" p1={this.props.nodes[26]} p2={this.props.nodes[33]} currentLayer={2}/>,
        <Edge key="93" p1={this.props.nodes[26]} p2={this.props.nodes[19]} currentLayer={2}/>,
        <Edge key="94" p1={this.props.nodes[19]} p2={this.props.nodes[14]} currentLayer={2}/>,
        <Edge key="95" p1={this.props.nodes[33]} p2={this.props.nodes[14]} currentLayer={2}/>,
        <Edge key="96" p1={this.props.nodes[19]} p2={this.props.nodes[20]} currentLayer={2}/>,
        <Edge key="97" p1={this.props.nodes[20]} p2={this.props.nodes[31]} currentLayer={2}/>,
        <Edge key="98" p1={this.props.nodes[19]} p2={this.props.nodes[34]} currentLayer={2}/>,
        <Edge key="99" p1={this.props.nodes[34]} p2={this.props.nodes[31]} currentLayer={2}/>,
        <Edge key="100" p1={this.props.nodes[31]} p2={this.props.nodes[36]} currentLayer={2}/>,
        <Edge key="101" p1={this.props.nodes[36]} p2={this.props.nodes[38]} currentLayer={2}/>,
        <Edge key="102" p1={this.props.nodes[38]} p2={this.props.nodes[44]} currentLayer={2}/>,
        <Edge key="103" p1={this.props.nodes[44]} p2={this.props.nodes[33]} currentLayer={2}/>,
        <Edge key="104" p1={this.props.nodes[44]} p2={this.props.nodes[33]} currentLayer={2}/>
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
        return this.renderScreen4();
    }
  }
}

