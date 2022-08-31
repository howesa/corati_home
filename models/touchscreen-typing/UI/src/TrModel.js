import React from "react";
import { Component } from "react";
import { Button } from "antd";
import "./css/Tr/TrModel.less";

import { TStep1 } from "./comp/CSteps";
import { ECollapse, TCollapseNxt } from "./comp/CCollapse";
import { EvCard5 } from "./comp/CCard";
import { TrCS } from "./cont/TrCS";
import { TrMC } from "./cont/TrMC";
import { TrDS } from "./cont/TrDS";
import { TrKS } from "./cont/TrKS";
import { TrDK } from "./cont/TrDK";

import devicePara from "./data/iP11Pro";

import PropTypes from "prop-types";
import emitter from "./events"; //引入创建的events.js文件

class TrModel extends Component {
  state = {
    // from object to array
    fields: Object.values(devicePara)[0]
  };

  // Keyboard setting values pass to here (onChange)
  // !IMPORTANT: Partially update
  setFields = newFields => {
    // this.setState({
    //   fields: newFields,
    // });
    newFields.forEach(element => {
      let name = element.name[0];
      let value = element.value;

      this.setState(prevState => ({
        fields: prevState.fields.map(el =>
          el.name[0] === name ? { ...el, value } : el
        )
      }));

      // console.log(element, name, value);
    });
  };

  // 给定义context赋值
  getChildContext = () => {
    return {
      fields: this.state.fields,
      onChange: this.setFields
    };
  };

  // Button to pas the KS values to D&K
  handleClick = () => {
    emitter.emit("kbPara", this.state.fields);
    // console.log(this.state.fields);
  };

  handleClickEvP = () => {
    var data = { sentence: "no", prev: "training" };
    var path = {
      pathname: "/train/process",
      state: data
    };
    // this.props.history.push("/evaluate/process");
    this.props.history.push(path);
  };

  render() {
    // console.log(this.state.fields);
    return (
      <div>
        <TStep1 />
        <TCollapseNxt header="Corpus Selection">
          <TrCS />
        </TCollapseNxt>

        <TCollapseNxt header="Model Configuration">
          <TrMC />
        </TCollapseNxt>

        <TCollapseNxt header="Device Specification">
          <TrDS />
        </TCollapseNxt>

        <ECollapse header="Keyboard Setting">
          <TrKS />
          <div className="nxt">
            <Button
              className="button"
              type="primary"
              ghost
              onClick={this.handleClick}
            >
              Preview
            </Button>
            <Button className="button">Clear</Button>
          </div>
        </ECollapse>

        <EvCard5 title="Device and Keyboard Preview">
          <TrDK />
        </EvCard5>
        <div className="start-ev-btn">
          <Button
            className="button"
            type="primary"
            size="large"
            onClick={this.handleClickEvP}
          >
            Start Training
          </Button>
        </div>
      </div>
    );
  }
}

TrModel.childContextTypes = {
  fields: PropTypes.array,
  onChange: PropTypes.func
};

export default TrModel;
