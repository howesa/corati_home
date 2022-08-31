import React from "react";
import { Component } from "react";
import { Radio, Descriptions, Tabs } from "antd";
import { EvCard3 } from "../comp/CCard";
import { Statfilter, SRSelect } from "../comp/CFilter";
import { EvCard2 } from "../comp/CCard";
import { MRPerformanceS, MREyeS } from "../comp/CTable";
import Heatmap from "../img/heatmap.png";

import "../css/Ev/EvSR.less";

class SentenceD extends Component {
  render() {
    const { TabPane } = Tabs;
    return (
      <div className="sentenced">
        <Tabs defaultActiveKey="1" size="large">
          <TabPane tab="Sentence Info" key="1">
            <Descriptions title="" column={1}>
              <Descriptions.Item label="Sentence ID">
                {this.props.targetstc === null ? 1 : this.props.targetstc.id}
              </Descriptions.Item>
              <Descriptions.Item label="Sentence content">
                {this.props.targetstc === null
                  ? "hello"
                  : this.props.targetstc.sentence}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

var targetID = 1;
class EvSR extends Component {
  state = {
    value: 1,
    sentenceResult: null,
    targetID: 1
  };

  onChange = e => {
    console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value
    });
    console.log("radio", this.state.sentenceResult);
  };

  handleFilter = () => {
    this.setState({ targetID: targetID });
  };

  // select sentence
  handleSelect = value => {
    targetID = value;
    // console.log(value);
    // if setState here the selection result can be automatically shown
    // this.setState({ targetID: value });
  };

  // get data from api
  componentDidMount() {
    fetch("/dataS")
      .then(res => res.json())
      .then(data => {
        this.setState({
          sentenceResult: data
        });
      });
  }

  render() {
    const radioStyle = {
      height: "80px",
      lineHeight: "30px"
    };

    const { value } = this.state;

    const { TabPane } = Tabs;

    return (
      <div className="evsr" value={value}>
        <EvCard3 title="Filter" handleFilter={this.handleFilter}>
          <Radio.Group
            className="radioG1"
            onChange={this.onChange}
            value={value}
          >
            <div className="corpus">
              <Radio style={radioStyle} value={1}>
                Sentence
              </Radio>
              <Radio style={radioStyle} value={2}>
                Statistic feature
              </Radio>
            </div>
          </Radio.Group>
          {value === 2 ? (
            <Statfilter
              sentenceResult={
                this.state.sentenceResult === null
                  ? null
                  : this.state.sentenceResult
              }
              handleSelect={this.handleSelect}
            />
          ) : (
            <SRSelect
              sentenceResult={
                this.state.sentenceResult === null
                  ? null
                  : this.state.sentenceResult
              }
              handleSelect={this.handleSelect}
            />
          )}
        </EvCard3>
        <SentenceD
          targetstc={
            this.state.sentenceResult === null
              ? null
              : this.state.sentenceResult[this.state.targetID]
          }
        />
        <Tabs defaultActiveKey="1" size="large" style={{ margin: "0 40px" }}>
          <TabPane tab="Statistic Result" key="1">
            <EvCard2 title="Performance (average per sentence)">
              <MRPerformanceS
                targetstc={
                  this.state.sentenceResult === null
                    ? null
                    : this.state.sentenceResult[this.state.targetID]
                }
              />
            </EvCard2>
            <EvCard2 title="Eye Gaze (average per sentence)">
              <MREyeS
                targetstc={
                  this.state.sentenceResult === null
                    ? null
                    : this.state.sentenceResult[this.state.targetID]
                }
              />
            </EvCard2>
          </TabPane>
          {/* <TabPane tab="Heatmap" key="2">
            <div style={{ textAlign: "center" }}>
              <img src={Heatmap} style={{ margin: "0 auto" }} />
            </div>
          </TabPane> */}
        </Tabs>
      </div>
    );
  }
}

export { EvSR };
