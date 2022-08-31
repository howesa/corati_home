import React from "react";
import { Component } from "react";
import { Radio, Descriptions, Tabs, Button } from "antd";
import { EvCard3 } from "../comp/CCard";
import { StatfilterT, TRSelect } from "../comp/CFilter";
import { EvCard2 } from "../comp/CCard";
import { MRPerformanceT, MREyeT, MRPerformance, MREye } from "../comp/CTable";
import Video from "../img/Video.png";
import { ExperimentOutlined } from "@ant-design/icons";

import "../css/Ev/EvTR.less";

// ********
// Result - Trial level
// ********

// Selected trial info
class TrialD extends Component {
  render() {
    const { TabPane } = Tabs;
    return (
      <div className="triald">
        <Tabs defaultActiveKey="1" size="large">
          <TabPane tab="Trial Info" key="1">
            <Descriptions title="" column={1}>
              <Descriptions.Item label="Sentence ID">
                {this.props.targettrl === null ? 1 : this.props.targettrl.sid}
              </Descriptions.Item>
              <Descriptions.Item label="Trial ID">
                {this.props.targettrl === null ? 0 : this.props.targettrl.aid}
              </Descriptions.Item>
              <Descriptions.Item label="Sentence content">
                {this.props.targettrl === null
                  ? "hello"
                  : this.props.targettrl.sentence}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

//
var targetIDS = 1;
var targetIDT = 0;
class EvTR extends Component {
  state = {
    value: 1,
    sentenceResult: null,
    trialResult: null,
    targetIDS: 1,
    targetIDT: 0,
    showTrialFilter: false,
    showTrialSelect: false,

    loadings: []
  };

  onChange = e => {
    console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value,
      showTrialFilter: false,
      showTrialSelect: false
    });
  };

  handleFilter = () => {
    this.setState({ targetIDS: targetIDS, targetIDT: targetIDT });
  };

  // select sentence
  handleSelectStc = value => {
    console.log("test!!!", value);
    targetIDS = value;
    this.setState({
      showTrialSelect: true
    });
    // console.log(value);
    // if setState here the selection result can be automatically shown
    // this.setState({ targetID: value });
  };

  // select sentence
  handleSelectStcAuto = value => {
    var trialResult = this.state.sentenceResult[value];
    targetIDS = value;
    console.log("trialResult", trialResult);
    this.setState({
      targetIDS: value,
      showTrialFilter: true,
      trialResult: trialResult
    });
  };

  // select trial
  handleSelectTrl = value => {
    targetIDT = value;
  };

  // get data from api
  componentDidMount() {
    fetch("/dataT")
      .then(res => res.json())
      .then(data => {
        this.setState({
          sentenceResult: data
        });
      });
  }

  enterLoading = index => {
    this.setState(({ loadings }) => {
      const newLoadings = [...loadings];
      newLoadings[index] = true;

      return {
        loadings: newLoadings
      };
    });

    setTimeout(() => {
      this.setState(({ loadings }) => {
        const newLoadings = [...loadings];
        newLoadings[index] = false;

        return {
          loadings: newLoadings
        };
      });
    }, 6000);
  };

  startGeneration = index => {
    this.setState(({ loadings }) => {
      const newLoadings = [...loadings];
      newLoadings[index] = true;

      return {
        loadings: newLoadings
      };
    });

    var stc = this.state.sentenceResult[this.state.targetIDS][
      this.state.targetIDT
    ].sentence;
    console.log(stc);

    // TODO: generate video according to sentence id and agent id, instead of sentence content
    // Selected sentence id: this.state.sentenceResult[this.state.targetIDS]
    // Selected agnet id: this.state.sentenceResult[this.state.targetIDT]

    var xhr = new XMLHttpRequest();
    var url = "/generateVideo/?sentence=" + stc;
    console.log(url);

    xhr.open("GET", url, true);
    xhr.setRequestHeader("content-type", "text/event-stream;charset=UTF-8");
    xhr.send();
    var position = 0;

    let currentComponent = this;

    function dataHandle() {
      var messages = xhr.responseText.split("\n");
      var log = "";
      // Get the new line and update the state to trigger rendering
      messages.slice(position, -1).forEach(function(value) {
        console.log(value);
      });
      position = messages.length - 1;
    }

    var timer;
    timer = setInterval(function() {
      // loading the unfinished data
      if (xhr.readyState == 3) {
        dataHandle();
      }

      // stop checking once the response has ended
      if (xhr.readyState == 4) {
        dataHandle();
        clearInterval(timer);
        console.log("done");

        currentComponent.setState(({ loadings }) => {
          const newLoadings = [...loadings];
          newLoadings[index] = false;

          return {
            loadings: newLoadings
          };
        });
        alert(
          "Video has successfully been generated, please check path_xxx to view it."
        );
      }
    }, 100);
  };

  render() {
    const radioStyle = {
      // display: 'block',
      height: "80px",
      lineHeight: "30px"
    };

    const { value } = this.state;
    const { TabPane } = Tabs;

    const { loadings } = this.state;

    return (
      <div className="evtr" value={value}>
        <EvCard3 title="Filter" handleFilter={this.handleFilter}>
          <Radio.Group
            className="radioG1"
            onChange={this.onChange}
            value={value}
          >
            <div className="corpus">
              <Radio style={radioStyle} value={1}>
                Trial
              </Radio>
              <Radio style={radioStyle} value={2}>
                Statistic feature
              </Radio>
            </div>
          </Radio.Group>
          {value === 2 ? (
            <StatfilterT
              sentenceResult={
                this.state.sentenceResult === null
                  ? null
                  : this.state.sentenceResult
              }
              trialResult={
                this.state.trialResult === null ? null : this.state.trialResult
              }
              handleSelectStc={this.handleSelectStcAuto}
              handleSelectTrl={this.handleSelectTrl}
              showTrialFilter={this.state.showTrialFilter}
            />
          ) : (
            <TRSelect
              sentenceResult={
                this.state.sentenceResult === null
                  ? null
                  : this.state.sentenceResult
              }
              showTrialSelect={this.state.showTrialSelect}
              handleSelectStc={this.handleSelectStc}
              handleSelectTrl={this.handleSelectTrl}
            />
          )}
        </EvCard3>
        <TrialD
          targettrl={
            this.state.sentenceResult === null
              ? null
              : this.state.sentenceResult[this.state.targetIDS][
                  this.state.targetIDT
                ]
          }
        />
        <Tabs defaultActiveKey="1" size="large" style={{ margin: "0 40px" }}>
          <TabPane tab="Statistic Result" key="1">
            <EvCard2 title="Performance">
              <MRPerformanceT
                targettrl={
                  this.state.sentenceResult === null
                    ? null
                    : this.state.sentenceResult[this.state.targetIDS][
                        this.state.targetIDT
                      ]
                }
              />
            </EvCard2>
            <EvCard2 title="Eye Gaze">
              <MREyeT
                targettrl={
                  this.state.sentenceResult === null
                    ? null
                    : this.state.sentenceResult[this.state.targetIDS][
                        this.state.targetIDT
                      ]
                }
              />
            </EvCard2>
          </TabPane>
          <TabPane tab="Video" key="2">
            <Button
              icon={<ExperimentOutlined />}
              size="large"
              loading={loadings[1]}
              onClick={() => this.startGeneration(1)}
              // onClick={this.startGeneration}
            >
              Generate Video
            </Button>
            {/* <div style={{ textAlign: "center" }}>
              <img src={Video} style={{ margin: "0 auto" }} />
            </div> */}
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

class TrialD1 extends Component {
  render() {
    return (
      <div className="triald">
        <Descriptions title="Trial Info" column={1}>
          <Descriptions.Item label="Trial ID">S8 T2</Descriptions.Item>
          <Descriptions.Item label="Content">
            This is another demo
          </Descriptions.Item>
        </Descriptions>
      </div>
    );
  }
}

class EvTR1 extends Component {
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

    const { value } = this.state;

    const { TabPane } = Tabs;

    return (
      <div className="evtr" value={value}>
        <EvCard3 title="Filter">
          <Radio.Group
            className="radioG1"
            onChange={this.onChange}
            value={value}
          >
            <div className="corpus">
              <Radio style={radioStyle} value={1}>
                Statistic feature
              </Radio>
              <Radio style={radioStyle} value={2}>
                Trial
              </Radio>
            </div>
          </Radio.Group>
          {value === 1 ? <StatfilterT /> : <TRSelect />}
        </EvCard3>
        <TrialD1 />
        <Tabs defaultActiveKey="1" size="large" style={{ margin: "0 40px" }}>
          <TabPane tab="Statistic Result" key="1">
            <EvCard2 title="Performance">
              <MRPerformance />
            </EvCard2>
            <EvCard2 title="Eye Gaze">
              <MREye />
            </EvCard2>
          </TabPane>
          <TabPane tab="Video" key="2">
            <div style={{ textAlign: "center" }}>
              <img src={Video} style={{ margin: "0 auto" }} />
            </div>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}

export { EvTR, EvTR1 };
