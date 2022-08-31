import React from "react";
import { Component } from "react";
import { Radio, InputNumber } from "antd";
import { Divider } from "antd";
import { TrDS_S1 } from "../comp/CSelect";

import "../css/Tr/TrDS.less";

// TODO
// Only UI: Device specification
class Resolu extends Component {
  render() {
    return (
      <div className="resolu">
        <InputNumber
          size="large"
          placeholder="414"
          disabled={this.props.disabled}
        />
        <span style={{ margin: "auto 10px" }}>x</span>
        <InputNumber
          size="large"
          placeholder="896"
          disabled={this.props.disabled}
        />
        <span style={{ margin: "auto 30px" }}>
          <i>width x height</i>
        </span>
      </div>
    );
  }
}

export default Resolu;

class TrDS extends Component {
  state = {
    value: 1
  };

  onChange = e => {
    console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value
    });
  };

  render() {
    const { value } = this.state;

    return (
      <Radio.Group className="radioDv" onChange={this.onChange} value={value}>
        <div style={{ marginBottom: "-20px" }}>
          <Radio className="myradio" value={1}>
            Common Device
            {value === 1 ? (
              <TrDS_S1 disabled={false} />
            ) : (
              <TrDS_S1 disabled={true} />
            )}
          </Radio>
          <Divider />
          <Radio className="myradio" value={2}>
            Custom Device (pixel)
            {value === 2 ? (
              <Resolu disabled={false} />
            ) : (
              <Resolu disabled={true} />
            )}
          </Radio>
        </div>
      </Radio.Group>
    );
  }
}

export { TrDS };
