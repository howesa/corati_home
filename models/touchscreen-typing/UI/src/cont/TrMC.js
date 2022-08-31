import React from "react";
import { Component } from "react";
import { Row, Col, Button } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { InputNumber, Divider } from "antd";
import { CRow } from "../comp/CConfig";
import { TrmFilter } from "../comp/CFilter";
import { TCollapseMin } from "../comp/CCollapse";

import "../css/Tr/TrMC.less";

class ParaInput extends Component {
  state = {
    inputValue: this.props.defaultValue
  };

  handleChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  reset = () => {
    this.setState({ inputValue: this.props.defaultValue });
  };

  render() {
    return (
      <div>
        <div className="parainput">
          <span>{this.props.parameter}</span>
          <Button
            type="link"
            icon={<RedoOutlined />}
            size="large"
            onClick={this.reset}
          />
        </div>
        <InputNumber
          placeholder={this.props.placeholder}
          defaultValue={this.props.defaultValue}
          style={{ width: 120 }}
          size="large"
          step={0.01}
          onChange={this.handlechange}
          value={this.state.inputValue}
        ></InputNumber>
      </div>
    );
  }
}

// TODO
// Value hard-coded: advance model setting in model configuration
class EMMA extends Component {
  render() {
    return (
      <div className="advan">
        <h4>Vision Model (EMMA)</h4>
        <Row>
          <Col span={4}>
            <ParaInput parameter="K" placeholder="0.006" defaultValue={0.006} />
          </Col>
          <Col span={4}>
            <ParaInput parameter="k" placeholder="0.4" defaultValue={0.4} />
          </Col>
          <Col span={4}>
            <ParaInput
              parameter="exec"
              placeholder="0.007"
              defaultValue={0.007}
            />
          </Col>
          <Col span={4}>
            <ParaInput
              parameter="saccade"
              placeholder="0.002"
              defaultValue={0.002}
            />
          </Col>
          <Col span={4}>
            <ParaInput
              parameter="prep"
              placeholder="0.135"
              defaultValue={0.135}
            />
          </Col>
          <Col span={4}></Col>
        </Row>
      </div>
    );
  }
}

// TODO
// Value hard-coded: advance model setting in model configuration
class WHo extends Component {
  render() {
    return (
      <div className="advan" style={{ marginBottom: "20px" }}>
        <h4>Finger Model (WHo)</h4>
        <Row>
          <Col span={4}>
            <ParaInput
              parameter="x0"
              placeholder="0.092"
              defaultValue={0.092}
            />
          </Col>
          <Col span={4}>
            <ParaInput
              parameter="y0"
              placeholder="0.0018"
              defaultValue={0.0018}
            />
          </Col>
          <Col span={4}>
            <ParaInput parameter="alpha" placeholder="0.6" defaultValue={0.6} />
          </Col>
          <Col span={4}>
            <ParaInput
              parameter="saccade"
              placeholder="0.002"
              defaultValue={0.002}
            />
          </Col>
          <Col span={4}>
            <ParaInput
              parameter="x_min"
              placeholder="0.006"
              defaultValue={0.006}
            />
          </Col>
          <Col span={4}>
            <ParaInput
              parameter="k_alpha"
              placeholder="0.12"
              defaultValue={0.12}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

class TrMC extends Component {
  render() {
    return (
      <div>
        <CRow title="Tremor">
          <TrmFilter lb1="No tremor" lb2="Severe" />
        </CRow>
        <CRow title="Expertise">
          <TrmFilter lb1="Novice" lb2="Expert" />
        </CRow>
        <CRow title="Dyslexia">
          <TrmFilter lb1="Mild" lb2="Severe" />
        </CRow>
        <TCollapseMin header="Advanced">
          <EMMA />
          <Divider />
          <WHo />
        </TCollapseMin>
      </div>
    );
  }
}

export { TrMC };
