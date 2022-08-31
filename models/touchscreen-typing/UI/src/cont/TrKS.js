import React from "react";
import ReactDOM from "react-dom";
import { Component } from "react";
import { Col, Row, InputNumber, Input } from "antd";
import { Divider, Form, Descriptions } from "antd";
import { TrKS_S1 } from "../comp/CSelect";
import { CRow, CRowV, AKOAdd } from "../comp/CConfig";
import { TCollapseMin } from "../comp/CCollapse";

import PropTypes from "prop-types";

import "../css/Tr/TrKS.less";

// TODO
// Improvement for keyboard setting:
// 1) Connect to model
// 2) more functions, see design draft in Figma

class AKO1 extends Component {
  formRef = React.createRef();
  render() {
    const { fields, onChange } = this.context; // 获取context的值

    return (
      <div className="ako">
        <Form
          ref={this.formRef}
          name="control-ref"
          fields={fields}
          onFieldsChange={(changedFields, allFields) => {
            onChange(changedFields);
          }}
        >
          <Row id="r1">
            <Col className="akocol" span={4}>
              <label>Row 1</label>
            </Col>
            <Col className="akocol" span={8}>
              <Form.Item
                name="nk1"
                label="Number of Keys"
                rules={[
                  {
                    required: true,
                    message: "Required!"
                  }
                ]}
              >
                <InputNumber
                  size="large"
                  style={{ margin: "auto 20px", width: 100 }}
                  min={1}
                  max={11}
                  placeholder={10}
                />
              </Form.Item>
            </Col>
            <Col className="akocol" span={8}>
              <Form.Item
                name="lt1"
                label="Letters"
                rules={[
                  {
                    required: true,
                    message: "Required!"
                  }
                ]}
              >
                <Input
                  // defaultValue={"QWERTYUIOP"}
                  size="large"
                  style={{ margin: "0px 20px", width: 200 }}
                  min={1}
                  max={10}
                  placeholder={10}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ margin: "0 0 " }}></Divider>

          <Row id="r2">
            <Col className="akocol" span={4}>
              <label>Row 2</label>
            </Col>
            <Col className="akocol" span={8}>
              <Form.Item
                name="nk2"
                label="Number of Keys"
                rules={[
                  {
                    required: true,
                    message: "Required!"
                  }
                ]}
              >
                <InputNumber
                  size="large"
                  style={{ margin: "auto 20px", width: 100 }}
                  min={1}
                  max={11}
                  placeholder={9}
                />
              </Form.Item>
            </Col>
            <Col className="akocol" span={8}>
              <Form.Item
                name="lt2"
                label="Letters"
                rules={[
                  {
                    required: true,
                    message: "Required!"
                  }
                ]}
              >
                <Input
                  size="large"
                  style={{ margin: "0px 20px", width: 200 }}
                  min={1}
                  max={10}
                  placeholder={10}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ margin: "0 0 " }}></Divider>

          <Row id="r3">
            <Col className="akocol" span={4}>
              <label>Row 3</label>
            </Col>
            <Col className="akocol" span={8}>
              <Form.Item
                name="nk3"
                label="Number of Keys"
                rules={[
                  {
                    required: true,
                    message: "Required!"
                  }
                ]}
              >
                <InputNumber
                  size="large"
                  style={{ margin: "auto 20px", width: 100 }}
                  min={1}
                  max={11}
                  placeholder={7}
                />
              </Form.Item>
            </Col>
            <Col className="akocol" span={8}>
              <Form.Item
                name="lt3"
                label="Letters"
                rules={[
                  {
                    required: true,
                    message: "Required!"
                  }
                ]}
              >
                <Input
                  defaultValue={"ZXCVBNM"}
                  size="large"
                  style={{ margin: "0px 20px", width: 200 }}
                  min={1}
                  max={10}
                  placeholder={10}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ margin: "0 0 " }}></Divider>
        </Form>
        <AKOAdd />
      </div>
    );
  }
}

AKO1.contextTypes = {
  fields: PropTypes.array,
  onChange: PropTypes.func
};

class KBD extends Component {
  formRef = React.createRef();
  render() {
    const { fields, onChange } = this.context; // 获取context的值

    // console.log(fields);

    return (
      <div className="kbd">
        <Form
          layout="vertical"
          ref={this.formRef}
          name="control-ref"
          fields={fields}
          onFieldsChange={(changedFields, allFields) => {
            onChange(changedFields);
          }}
        >
          <Row className="kbdinfo">
            <Col span={8}>
              <Form.Item name="skbw" label="Standard Keyboard Width (skbW)">
                375 <span>&nbsp;px</span>
                <label></label>
                {/* {this.props.skbW} */}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="skbh" label="Standard Keyboard Height (skbH)">
                206 <span>&nbsp;px</span>
                <label></label>
                {/* {this.props.skbW} */}
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "none" }}>
            <Form.Item name="dvh">812</Form.Item>
            <Form.Item name="dvw">375</Form.Item>
          </div>

          <Row className="kbd1">
            <Col span={8}>
              <Form.Item label="Keyboard Width ">
                <span className="range">Range: 0.8 - 1 </span>
                <div style={{ textAlign: "center" }}>
                  <Form.Item name="kbw" className="itemip">
                    <InputNumber
                      size="large"
                      style={{ margin: "auto 0px", width: 100 }}
                      step={0.01}
                      min={0.8}
                      max={1}
                      placeholder={1}
                    />
                  </Form.Item>
                  <div className="suffix">
                    <i>X skbW</i>
                  </div>
                </div>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label="Keyboard Height ">
                <span className="range">Range: 0.8 - 1.6 </span>
                <div style={{ textAlign: "center" }}>
                  <Form.Item name="kbh" className="itemip">
                    <InputNumber
                      size="large"
                      style={{ margin: "auto 0px", width: 100 }}
                      step={0.01}
                      min={0.8}
                      max={1.6}
                      placeholder={1}
                    />
                  </Form.Item>
                  <div className="suffix">
                    <i>X skbH</i>
                  </div>
                </div>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}

KBD.contextTypes = {
  fields: PropTypes.array,
  onChange: PropTypes.func
};

class TrKS extends Component {
  render() {
    return (
      <div>
        <CRow title="Keyboard Language">
          <TrKS_S1 />
        </CRow>
        <TCollapseMin header="Advanced">
          <CRowV className="myako" title="Alphabetical Key Order">
            <AKO1 />
          </CRowV>
          <CRowV className="myako" title="Keyboard Dimension">
            <KBD />
          </CRowV>
        </TCollapseMin>
      </div>
    );
  }
}

export { TrKS };
