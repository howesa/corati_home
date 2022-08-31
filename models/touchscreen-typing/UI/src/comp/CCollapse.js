import React from "react";
import styled from "styled-components";
import { Component } from "react";

import "../css/comp/CCollapse.less";

import { Collapse, Divider, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

function callback(key) {}

class ECollapse extends Component {
  state = {
    expandIconPosition: "left",
  };

  render() {
    return (
      <div className="mycollapse">
        <Collapse
          className="ECollapse"
          defaultActiveKey={["1"]}
          onChange={callback}
        >
          <Panel header={this.props.header} key="1">
            {this.props.children}
          </Panel>
        </Collapse>
      </div>
    );
  }
}

class ECollapseAct extends Component {
  state = {
    expandIconPosition: "left",
  };

  render() {
    return (
      <div className="mycollapse">
        <Collapse
          className="ECollapse"
          defaultActiveKey={["1"]}
          onChange={callback}
        >
          <Panel header={this.props.header} key="1">
            {this.props.children}
            <Divider />
            <div style={{ textAlign: "center" }}>
              <Button className="button" type="primary" ghost>
                Download
              </Button>
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  }
}

class TCollapseNxt extends Component {
  state = {
    expandIconPosition: "left",
  };

  render() {
    return (
      <div className="mycollapse">
        <Collapse
          className="ECollapse"
          defaultActiveKey={["1"]}
          onChange={callback}
        >
          <Panel header={this.props.header} key="1">
            {this.props.children}
            <Divider style={{ marginTop: "-10px" }} />
            <div className="nxt">
              <Button className="button" type="primary" ghost>
                Next
              </Button>
              <Button className="button">Clear</Button>
            </div>
          </Panel>
        </Collapse>
      </div>
    );
  }
}

class TCollapseMin extends Component {
  render() {
    return (
      <div className="nocollapse">
        <Collapse defaultActiveKey={["1"]} ghost>
          <Panel header={this.props.header} key="1">
            {this.props.children}
          </Panel>
        </Collapse>
      </div>
    );
  }
}

export { ECollapse, ECollapseAct, TCollapseNxt, TCollapseMin };
