import React from "react";
import { Component } from "react";

import emitter from "../events"; //引入创建的events.js文件

import "../css/Tr/TrDK.less";

// To get item value by name
function ipValue(fields, name) {
  return fields.filter((item) => item.name[0] === name)[0].value;
}

class Key extends Component {
  // pass the style to keyboard
  getStyle1(fields) {
    if (JSON.stringify(fields[0]) !== undefined) {
      let width = (ipValue(fields, "skbw") * ipValue(fields, "kbw")) / 10.0;
      let height = (ipValue(fields, "skbh") * ipValue(fields, "kbh") + 2) / 4.0;

      console.log(width, height);
      return { width: width, height: height };
    }
  }

  getStyle2(fields) {
    if (JSON.stringify(fields[0]) !== undefined) {
      let width =
        ((ipValue(fields, "skbw") * ipValue(fields, "kbw")) / 10.0) * 0.84;
      let height =
        ((ipValue(fields, "skbh") * ipValue(fields, "kbh") + 2) / 4.0) * 0.81;

      console.log(width, height);
      return { width: width, height: height };
    }
  }

  render() {
    const fields = this.props.fields;
    const stylePara1 = this.getStyle1(fields);
    const stylePara2 = this.getStyle2(fields);

    return (
      <div className="key" style={stylePara1}>
        <div className="keycap" style={stylePara2}>
          <div className="keytext">{this.props.letter}</div>
        </div>
      </div>
    );
  }
}

class SpaceKey extends Component {
  getStyle1(fields) {
    if (JSON.stringify(fields[0]) !== undefined) {
      let width =
        ((ipValue(fields, "skbw") * ipValue(fields, "kbw")) / 10.0) * 4;
      let height = (ipValue(fields, "skbh") * ipValue(fields, "kbh") + 2) / 4.0;

      console.log(width, height);
      return { width: width, height: height };
    }
  }

  getStyle2(fields) {
    if (JSON.stringify(fields[0]) != undefined) {
      let width =
        ((ipValue(fields, "skbw") * ipValue(fields, "kbw")) / 10.0) * 4 - 6;
      let height =
        ((ipValue(fields, "skbh") * ipValue(fields, "kbh") + 2) / 4.0) * 0.81;

      console.log(width, height);
      return { width: width, height: height };
    }
  }

  render() {
    const fields = this.props.fields;
    const stylePara1 = this.getStyle1(fields);
    const stylePara2 = this.getStyle2(fields);

    return (
      <div className="space" style={stylePara1}>
        <div className="spacecap" style={stylePara2}></div>
      </div>
    );
  }
}

class MyKeyboard extends Component {
  renderKey(nk, lt) {
    var fields = this.props.fields;
    const rowData = [];

    if (JSON.stringify(fields[0]) !== undefined) {
      // console.log(fields);

      var numRowKey = ipValue(fields, nk);
      const rowLetters = ipValue(fields, lt).toUpperCase().split("");

      for (let j = 0; j < numRowKey; j++) {
        rowData.push({
          index: `${j}`,
          letter: rowLetters[j],
        });
      }

      const keyItems = rowData.map((k) => (
        <Key key={k.index} letter={k.letter} fields={fields} />
      ));

      return <div className="board-row">{keyItems}</div>;
    }
  }

  renderSpace() {
    var fields = this.props.fields;
    return (
      <div className="board-row">
        <SpaceKey fields={fields} />
      </div>
    );
  }

  // pass the style to keyboard
  getStyle(fields) {
    if (JSON.stringify(fields[0]) !== undefined) {
      let width = ipValue(fields, "skbw") * ipValue(fields, "kbw");
      let height = ipValue(fields, "skbh") * ipValue(fields, "kbh");
      return { width: width, height: height, visibility: "visible" };
    }
  }

  render() {
    const fields = this.props.fields;
    const stylePara = this.getStyle(fields);

    return (
      <div className="keyboard" style={stylePara}>
        {this.renderKey("nk1", "lt1")}
        {this.renderKey("nk2", "lt2")}
        {this.renderKey("nk3", "lt3")}

        {this.renderSpace()}
      </div>
    );
  }
}

class Device extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: [],
    };
  }

  // 创造监听事件
  componentDidMount() {
    this.eventEmitter = emitter.addListener("kbPara", (data) => {
      this.setState({
        fields: data,
      });
    });
  }

  // 销毁监听事件
  componentWillUnmount() {
    emitter.removeListener("kbPara", (data) => {
      this.setState({
        data,
      });
    });
  }

  getStyle(fields) {
    if (JSON.stringify(fields[0]) !== undefined) {
      let width = ipValue(fields, "dvw");
      let height = ipValue(fields, "dvh");
      return { width: width, height: height, visibility: "visible" };
    }
  }

  render() {
    const { fields } = this.state;
    const stylePara = this.getStyle(fields);

    return (
      <div className="device" style={stylePara}>
        <div className="board-row">
          <MyKeyboard fields={fields} />
        </div>
      </div>
    );
  }
}

class TrDK extends Component {
  render() {
    return (
      <div className="trdk">
        <Device></Device>
      </div>
    );
  }
}

export { TrDK };
