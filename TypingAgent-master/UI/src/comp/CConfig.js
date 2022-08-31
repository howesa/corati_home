// Configuarion components for TrModel
import React from "react";
import { Component } from "react";
import { Radio, Input } from "antd";
import { Divider } from "antd";
import { InputNumber, Button } from "antd";
import { PlusOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

import "../css/comp/CConfig.less";

class CRow extends Component {
  render() {
    return (
      <div className="crowstyle">
        <div className="crow">
          <div className="crowspan">{this.props.title}</div>
          {this.props.children}
        </div>
        <Divider />
      </div>
    );
  }
}

class CRowV extends Component {
  render() {
    return (
      <div className="crowstyle">
        <div className="crowspan">{this.props.title}</div>
        {this.props.children}
        <Divider />
      </div>
    );
  }
}

// the ADD button for TrKS
class AKOAdd extends Component {
  state = {
    value: 24,
  };

  render() {
    const { value } = this.state;

    return (
      <div className="akoadd">
        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
          style={{ marginTop: 10 }}
        />
        <div className="numf">
          <span className="spant">The number of keys </span>
          <InputNumber
            min={1}
            max={50}
            disabled={true}
            // defaultValue={3}
            value={value}
            // size="large"
            style={{ margin: "0px 20px", width: 40 }}
          />
          <span className="spant"> matches the alphabet </span>
          {value === 24 ? (
            <CheckOutlined
              style={{ margin: "0px 30px", color: "#0ba331", fontSize: 28 }}
            />
          ) : (
            <CloseOutlined
              style={{ margin: "0px 30px", color: "#f20000", fontSize: 28 }}
            />
          )}
        </div>
      </div>
    );
  }
}

export { CRow, CRowV, AKOAdd };
