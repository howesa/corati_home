import React from "react";
import { Component } from "react";
import { Radio, Input } from "antd";
import { Divider } from "antd";
import { EvCS_S1, EvCS_S1_d } from "../comp/CSelect";
import { CUpload, CUpload_d } from "../comp/CUpload";

import "../css/Ev/EvCS.less";

// TODO
// Built-in corpus: only UI, empty for now
// Custom corpus: only UI
// Multiple sentences: no UI

class EvCS extends Component {
  state = {
    value: 1,
    sentence: ""
  };

  onChange = e => {
    console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value
    });
  };

  onChangeSts = e => {
    console.log(e.target.value);
    this.setState({ sentence: e.target.value });
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
      <Radio.Group className="radioG" onChange={this.onChange} value={value}>
        <div className="corpus">
          <Radio style={radioStyle} value={1}>
            Built-in Corpus
            {value === 1 ? <EvCS_S1 /> : <EvCS_S1_d />}
          </Radio>
          <Radio style={radioStyle} value={2}>
            Custom Corpus
            {value === 2 ? (
              <CUpload style={style1} />
            ) : (
              <CUpload_d style={style1} />
            )}
          </Radio>
        </div>

        <Divider
          orientation="left"
          style={{ fontSize: "14px", color: "#949494" }}
        >
          Or
        </Divider>

        <Radio style={(radioStyle, { display: "block" })} value={3}>
          Single Sentence
          {value === 3 ? (
            <Input
              placeholder="Input one sentence to evaluate"
              size="large"
              style={style1}
              // value={this.state.sentence || ""}
              onChange={this.props.onChangeSts}
            />
          ) : (
            <Input
              placeholder="Input one sentence to evaluate"
              size="large"
              style={style1}
              disabled
            />
          )}
          {/* {value === 3 ? <Input style={{ display:"block", width: 100, marginLeft: 10 }} /> : null} */}
        </Radio>
      </Radio.Group>
    );
  }
}

export { EvCS };
