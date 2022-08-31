import React from "react";
import { Component } from "react";
import { Radio, Input } from "antd";
import { Divider } from "antd";
import { EvCS_S1, EvCS_S1_d } from "../comp/CSelect";
import { CUpload, CUpload_d } from "../comp/CUpload";
import { CRow } from "../comp/CConfig";

import "../css/Tr/TrCS.less";

// TODO
// Only UI: built-in corpus, custom corpus, single sentence
class Corpus1 extends Component {
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
      // lineHeight: "30px",
    };

    const style1 = {
      display: "block",
      width: "400px"
    };

    const { value } = this.state;

    return (
      <Radio.Group className="radioGCS" onChange={this.onChange} value={value}>
        <div className="corpuscs" style={{ marginBottom: "-20px" }}>
          <Radio style={radioStyle} value={1}>
            Built-in Corpus
            {value === 1 ? <EvCS_S1 /> : <EvCS_S1_d />}
          </Radio>
          <Radio style={(radioStyle, { marginLeft: 40 })} value={2}>
            Custom Corpus
            {value === 2 ? (
              <CUpload style={style1} />
            ) : (
              <CUpload_d style={style1} />
            )}
          </Radio>
        </div>
      </Radio.Group>
    );
  }
}

class Corpus2 extends Component {
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
      marginTop: "10px",
      marginBottom: "-30px"
    };

    const { value } = this.state;

    return (
      <Radio.Group className="radioGCS" onChange={this.onChange} value={value}>
        <div className="corpuscs">
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
            />
          ) : (
            <Input
              placeholder="Input one sentence to evaluate"
              size="large"
              style={style1}
              disabled
            />
          )}
        </Radio>
      </Radio.Group>
    );
  }
}

class TrCS extends Component {
  render() {
    return (
      <div>
        <CRow title="Training Corpus">
          <Corpus1 />
          {/* <TrmFilter /> */}
        </CRow>
        <CRow title="Evaluation Corpus">
          <Corpus2 />
        </CRow>
      </div>
    );
  }
}

export { TrCS };
