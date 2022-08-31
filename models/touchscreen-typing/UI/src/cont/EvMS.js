import React from "react";
import { Component } from "react";
import { Radio, Input } from "antd";
import { Divider } from "antd";
import { EvMS_S1, EvMS_S1_d } from "../comp/CSelect";
import { CUpload, CUpload_d } from "../comp/CUpload";
import { EvTable1, EvTable2, EvTable3 } from "../comp/CTable";

import Device from "../img/Device.png";
import "../css/Ev/EvMS.less";

// TODO
// Model detail: hard-coded, should be the parameters for each selected model
// Device and keyboard: see above

class EvMS extends Component {
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
    const radioStyle = {
      // display: 'block',
      height: "80px",
      lineHeight: "30px"
    };

    const style1 = {
      display: "block",
      width: "400px",
      marginTop: "10px"
    };

    const { value } = this.state;
    return (
      <div className="evms">
        {/* <Radio.Group className="radioG1" onChange={this.onChange} value={value}>
          <div className="corpus">
            <Radio style={radioStyle} value={1}>
              Built-in Model
              {value === 1 ? <EvMS_S1 /> : <EvMS_S1_d />}
            </Radio>
            <Radio style={radioStyle} value={2}>
              Custom Model
              {value === 2 ? (
                <CUpload style={style1} />
              ) : (
                <CUpload_d style={style1} />
              )}
            </Radio>
          </div>
        </Radio.Group> */}
        <h4 style={{ marginBottom: "10px", fontWeight: "500" }}>
          Built-in and Saved Models
        </h4>
        <EvMS_S1 />
        <Divider
          style={{ fontSize: "14px", color: "#949494", width: "70%" }}
        ></Divider>
        {/* <label style={{ fontWeight: "600" }}>Model Detail</label> */}
        <h4 style={{ marginBottom: "10px", fontWeight: "500" }}>
          Model Detail
        </h4>
        <EvTable1 />
        <EvTable2 />
        <EvTable3 />
        <h4 style={{ marginBottom: "10px", fontWeight: "500" }}>
          Device and Keyboard
        </h4>
        <div style={{ textAlign: "center" }}>
          <img src={Device} style={{ margin: "0 auto" }} />
        </div>
      </div>
    );
  }
}

export { EvMS };
