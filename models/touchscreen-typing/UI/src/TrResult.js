import React from "react";
import { Component } from "react";
import { Modal, Button, Input } from "antd";
import "./css/Ev/EvResult.less";

import { TStep4 } from "./comp/CSteps";
import { ECollapse, ECollapseAct } from "./comp/CCollapse";

import { EvMR } from "./cont/EvMR";
import { EvSR } from "./cont/EvSR";
import { EvTR, EvTR1 } from "./cont/EvTR";

class TrResult extends Component {
  state = { visible: false, name: "" };

  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);

    this.setState({
      visible: false
    });
    var xhr = new XMLHttpRequest();
    console.log(this.state.name);
    var url = "/saveModel/?name=" + this.state.name;
    console.log(url);
    // var url = "/stream";

    xhr.open("GET", url, true);
    xhr.setRequestHeader("content-type", "text/event-stream;charset=UTF-8");
    xhr.send();

    console.log("Doneeeeeesssss");
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false
    });
  };

  onChange = e => {
    this.setState({ name: e.target.value });
  };

  render() {
    return (
      <div>
        <TStep4 />
        <ECollapseAct header="Main Result">
          <EvMR />
        </ECollapseAct>
        <ECollapseAct header="Sentence-level Results">
          <EvSR />
        </ECollapseAct>
        <ECollapseAct header="Trial-level Results">
          <EvTR />
        </ECollapseAct>
        <div className="start-ev-btn">
          <Button
            className="button"
            type="primary"
            size="large"
            // onClick={this.handleClick}
            onClick={this.showModal}
          >
            Save the Model
          </Button>
          <Modal
            title="Save Model"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <Input
              size="large"
              placeholder="Please name the saved model"
              onChange={this.onChange}
            ></Input>
          </Modal>
        </div>
      </div>
    );
  }
}

export default TrResult;
