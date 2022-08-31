import React from "react";
import { Component } from "react";
import { Select, Divider, Tag } from "antd";
import { Slider, InputNumber, Button, Row, Col } from "antd";
import {
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  MinusOutlined,
} from "@ant-design/icons";

import "../css/comp/CFilter.less";
import CollapsePanel from "antd/lib/collapse/CollapsePanel";

const { Option } = Select;

// Sentence level
const statOptions = [
  { value: "iki", label: "Inter-key interval" },
  { value: "wpm", label: "Words per minute" },
  { value: "bs", label: "Number of backspaces" },
  { value: "imBs", label: "Immediate backspaces" },
  { value: "dlBs", label: "Delayed backspaces" },
  { value: "corErr", label: "Corrected error rate" },
  { value: "unErr", label: "Uncorrected error rate " },
  { value: "fixNum", label: "Number of fixations" },
  { value: "fixDur", label: "Fixation duration" },
  { value: "gazeShift", label: "Number of gaze shift" },
  { value: "gazeRatio", label: "Time ratio for gaze on keyboard" },
];

const marks = {};

// filter itself, child of the StatFilter
class SRFilter1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: statOptions,
      marks: marks,
      inputValue: [],
      selectSta: "iki", //this is for avoid error when mounted, will be rewritten after updated
      min: 0,
      max: 100,
      selectSentences: {},
    };
  }

  // to get data from parents after update or mount
  commonMU = (selectSta, sentenceResult) => {
    var statValue = [];
    var valueMarks = {};
    for (var key in sentenceResult) {
      var value = parseFloat(sentenceResult[key][selectSta]);
      statValue.push(value);
      valueMarks[value] = "";
    }
    var min = Math.min(...statValue);
    var max = Math.max(...statValue);

    this.setState({
      min: min,
      max: max,
      inputValue: [min, max],
      marks: valueMarks,
      selectSta: selectSta,
    });

    this.props.handleStats1(selectSta);
  };

  // !INTERESTING the ratio changing decide mount first or update first
  // only when this is not the first ratio choice would mount be invoked
  componentDidMount() {
    if (this.props.sentenceResult !== null) {
      var sentenceResult = this.props.sentenceResult;
      var selectSta = this.props.selectStats[0];
      console.log("componentDidMount");
      this.commonMU(selectSta, sentenceResult);
    }
  }

  // get the whole data set from parents
  componentDidUpdate(previousProps, previousState) {
    var sentenceResult = this.props.sentenceResult;
    var selectSta = this.props.selectStats[0];

    // to avoid infinite loop
    if (
      previousProps.sentenceResult !== sentenceResult ||
      previousState.selectSta !== selectSta
    ) {
      console.log("componentDidUpdate");
      this.commonMU(selectSta, sentenceResult);
    }
  }

  // tooltip for slider
  formatter = (value) => {
    return `${value}`;
  };

  // select sentence sta
  handleStatSelect = (value) => {
    console.log("the select of first filter", value);
    // if setState here the selection result can be automatically shown
    this.setState({ selectSta: value });
    this.props.handleStats1(value);
  };

  // filter the selected sentences on the slider
  dataFilter = (inputValue) => {
    // console.log(inputValue);
    var stat = this.state.selectSta;
    var sentenceResult = this.props.sentenceResult;
    var selectSentences = {}; // create a new dict

    for (var key in sentenceResult) {
      if (
        sentenceResult[key][stat] >= inputValue[0] &&
        sentenceResult[key][stat] <= inputValue[1]
      ) {
        selectSentences[key] = sentenceResult[key];
      }
    }

    // console.log(selectSentences);

    this.setState({
      selectSentences: selectSentences,
    });

    // this.props.getSentenceNum(selectSentences);
    this.props.getselectSentences1(selectSentences);
  };

  // 3 onChange are all about to use slider or input to change inputValue
  onChange = (value) => {
    this.setState({
      inputValue: value,
    });
    this.dataFilter(value);
  };

  onChange1 = (value) => {
    var tmp = this.state.inputValue;
    tmp[0] = value;

    this.setState({
      inputValue: tmp,
    });
    this.dataFilter(tmp);
  };

  onChange2 = (value) => {
    var tmp = this.state.inputValue;
    tmp[1] = value;

    this.setState({
      inputValue: tmp,
    });
    this.dataFilter(tmp);
  };

  render() {
    const { inputValue } = this.state;

    return (
      <div className="myfilter">
        <Select
          className="ftselect"
          showSearch
          placeholder="Select a feature"
          defaultValue={
            this.props.selectStats === undefined
              ? this.state.selectSta
              : this.props.selectStats[0]
          }
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          size="large"
          options={this.state.options}
          onChange={this.handleStatSelect}
        ></Select>
        <div>
          <Slider
            className="cslider"
            range
            min={this.state.min}
            max={this.state.max}
            step={null}
            marks={this.state.marks}
            defaultValue={[26, 37]}
            onChange={this.onChange}
            tipFormatter={this.formatter}
            value={typeof inputValue === "object" ? inputValue : [26, 37]}
          />
        </div>
        <div className="myinput">
          <InputNumber
            className="cinput"
            range
            style={{ margin: "0 16px" }}
            value={inputValue[0]}
            onChange={this.onChange1}
            size="middle"
          />
          <span>-</span>
          <InputNumber
            className="cinput"
            range
            style={{ margin: "0 16px" }}
            value={inputValue[1]}
            onChange={this.onChange2}
            size="middle"
          />
        </div>
      </div>
    );
  }
}

// filter itself, child of the StatFilter
class SRFilter2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: statOptions,
      marks: marks,
      inputValue: [],
      selectSta: "wpm", //this is for avoid error when mounted, will be rewritten after updated
      // and if it's not wpm, it'll be rendered for twice
      min: 0,
      max: 100,
      selectSentences: {},
    };
  }

  // to get data from parents after update or mount
  commonMU = (selectSta, sentenceResult) => {
    var statValue = [];
    var valueMarks = {};
    for (var key in sentenceResult) {
      var value = parseFloat(sentenceResult[key][selectSta]);
      statValue.push(value);
      valueMarks[value] = "";
    }
    var min = Math.min(...statValue);
    var max = Math.max(...statValue);

    this.setState({
      min: min,
      max: max,
      inputValue: [min, max],
      marks: valueMarks,
      selectSta: selectSta,
    });

    console.log("filter2", selectSta);

    this.props.handleStats2(selectSta);
  };

  // get the whole data set from parents
  componentDidUpdate(previousProps, previousState) {
    var sentenceResult = this.props.sentenceResult;
    var selectSta = this.props.selectStats[1];

    // to avoid infinite loop
    if (
      previousProps.sentenceResult !== sentenceResult ||
      previousState.selectSta !== selectSta
    ) {
      // console.log("fillter 2 sentence result", sentenceResult);
      this.commonMU(selectSta, sentenceResult);
    }
  }

  // tooltip for slider
  formatter = (value) => {
    return `${value}`;
  };

  // select sentence
  handleStatSelect = (value) => {
    console.log("the select of first filter", value);
    // if setState here the selection result can be automatically shown
    this.setState({ selectSta: value });
    this.props.handleStats2(value);
  };

  // filter the selected sentences on the slider
  dataFilter = (inputValue) => {
    console.log(inputValue);
    var stat = this.state.selectSta;
    var sentenceResult = this.props.sentenceResult;
    var selectSentences = {}; // create a new dict

    for (var key in sentenceResult) {
      if (
        sentenceResult[key][stat] >= inputValue[0] &&
        sentenceResult[key][stat] <= inputValue[1]
      ) {
        selectSentences[key] = sentenceResult[key];
      }
    }

    console.log(selectSentences);

    this.setState({
      selectSentences: selectSentences,
    });

    this.props.getselectSentences2(selectSentences);
  };

  // 3 onChange are all about to use slider or input to change inputValue
  onChange = (value) => {
    this.setState({
      inputValue: value,
    });
    this.dataFilter(value);
  };

  onChange1 = (value) => {
    var tmp = this.state.inputValue;
    tmp[0] = value;

    this.setState({
      inputValue: tmp,
    });
    this.dataFilter(tmp);
  };

  onChange2 = (value) => {
    var tmp = this.state.inputValue;
    tmp[1] = value;

    this.setState({
      inputValue: tmp,
    });
    this.dataFilter(tmp);
  };

  render() {
    const { inputValue } = this.state;

    return (
      <div className="myfilter">
        <Select
          className="ftselect"
          showSearch
          placeholder="Select a feature"
          defaultValue={
            this.props.selectStats === undefined
              ? this.state.selectSta
              : this.props.selectStats[1]
          }
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          size="large"
          options={this.state.options}
          onChange={this.handleStatSelect}
        ></Select>
        <div>
          <Slider
            className="cslider"
            range
            min={this.state.min}
            max={this.state.max}
            step={null}
            marks={this.state.marks}
            defaultValue={[26, 37]}
            onChange={this.onChange}
            tipFormatter={this.formatter}
            value={typeof inputValue === "object" ? inputValue : [26, 37]}
          />
        </div>
        <div className="myinput">
          <InputNumber
            className="cinput"
            range
            style={{ margin: "0 16px" }}
            value={inputValue[0]}
            onChange={this.onChange1}
            size="middle"
          />
          <span>-</span>
          <InputNumber
            className="cinput"
            range
            style={{ margin: "0 16px" }}
            value={inputValue[1]}
            onChange={this.onChange2}
            size="middle"
          />
        </div>
        <Button
          className="deletebtn"
          type="primary"
          shape="circle"
          icon={<MinusOutlined />}
          onClick={this.props.handleDisplayCtr}
        />
      </div>
    );
  }
}

// filter itself, child of the StatFilter
class SRFilter3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: statOptions,
      marks: marks,
      inputValue: [],
      selectSta: "bs", //this is for avoid error when mounted, will be rewritten after updated
      // and if it's not wpm, it'll be rendered for twice
      min: 0,
      max: 100,
      selectSentences: {},
    };
  }

  // to get data from parents after update or mount
  commonMU = (selectSta, sentenceResult) => {
    var statValue = [];
    var valueMarks = {};
    for (var key in sentenceResult) {
      var value = parseFloat(sentenceResult[key][selectSta]);
      statValue.push(value);
      valueMarks[value] = "";
    }
    var min = Math.min(...statValue);
    var max = Math.max(...statValue);

    this.setState({
      min: min,
      max: max,
      inputValue: [min, max],
      marks: valueMarks,
      selectSta: selectSta,
    });

    console.log("filter3", selectSta);

    this.props.handleStats3(selectSta);
  };

  // get the whole data set from parents
  componentDidUpdate(previousProps, previousState) {
    var sentenceResult = this.props.sentenceResult;
    var selectSta = this.props.selectStats[2];

    // to avoid infinite loop
    if (
      previousProps.sentenceResult !== sentenceResult ||
      previousState.selectSta !== selectSta
    ) {
      // console.log("fillter 2 sentence result", sentenceResult);
      this.commonMU(selectSta, sentenceResult);
    }
  }

  // tooltip for slider
  formatter = (value) => {
    return `${value}`;
  };

  // select sentence
  handleStatSelect = (value) => {
    console.log("the select of first filter", value);
    // if setState here the selection result can be automatically shown
    this.setState({ selectSta: value });
    this.props.handleStats3(value);
  };

  // filter the selected sentences on the slider
  dataFilter = (inputValue) => {
    console.log(inputValue);
    var stat = this.state.selectSta;
    var sentenceResult = this.props.sentenceResult;
    var selectSentences = {}; // create a new dict

    for (var key in sentenceResult) {
      if (
        sentenceResult[key][stat] >= inputValue[0] &&
        sentenceResult[key][stat] <= inputValue[1]
      ) {
        selectSentences[key] = sentenceResult[key];
      }
    }

    console.log(selectSentences);

    this.setState({
      selectSentences: selectSentences,
    });

    this.props.getselectSentences3(selectSentences);
  };

  // 3 onChange are all about to use slider or input to change inputValue
  onChange = (value) => {
    this.setState({
      inputValue: value,
    });
    this.dataFilter(value);
  };

  onChange1 = (value) => {
    var tmp = this.state.inputValue;
    tmp[0] = value;

    this.setState({
      inputValue: tmp,
    });
    this.dataFilter(tmp);
  };

  onChange2 = (value) => {
    var tmp = this.state.inputValue;
    tmp[1] = value;

    this.setState({
      inputValue: tmp,
    });
    this.dataFilter(tmp);
  };

  render() {
    const { inputValue } = this.state;

    return (
      <div className="myfilter">
        <Select
          className="ftselect"
          showSearch
          placeholder="Select a feature"
          defaultValue={
            this.props.selectStats === undefined
              ? this.state.selectSta
              : this.props.selectStats[2]
          }
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          size="large"
          options={this.state.options}
          onChange={this.handleStatSelect}
        ></Select>
        <div>
          <Slider
            className="cslider"
            range
            min={this.state.min}
            max={this.state.max}
            step={null}
            marks={this.state.marks}
            defaultValue={[26, 37]}
            onChange={this.onChange}
            tipFormatter={this.formatter}
            value={typeof inputValue === "object" ? inputValue : [26, 37]}
          />
        </div>
        <div className="myinput">
          <InputNumber
            className="cinput"
            range
            style={{ margin: "0 16px" }}
            value={inputValue[0]}
            onChange={this.onChange1}
            size="middle"
          />
          <span>-</span>
          <InputNumber
            className="cinput"
            range
            style={{ margin: "0 16px" }}
            value={inputValue[1]}
            onChange={this.onChange2}
            size="middle"
          />
        </div>
        <Button
          className="deletebtn"
          type="primary"
          shape="circle"
          icon={<MinusOutlined />}
          onClick={this.props.handleDisplayCtr}
        />
      </div>
    );
  }
}

// Statfilter as a whole
class Statfilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sentenceNum: 3,
      selectSentences1: {},
      selectSentences2: {},
      selectSentences3: {},
      selectStats: ["iki", "wpm", "bs"],
      displayCtl: [0, 0, 1],
    };
  }

  // !INTERESTING the ratio changing decide mount first or update first
  // only when this is not the first ratio choice would mount be invoked
  componentDidMount() {
    if (this.props.sentenceResult !== null) {
      var sentenceResult = this.props.sentenceResult;
      var num = Object.keys(sentenceResult).length;
      this.setState({
        sentenceNum: num,
      });
    }
  }

  componentDidUpdate(previousProps, previousState) {
    var sentenceResult = this.props.sentenceResult;
    if (previousProps.sentenceResult !== sentenceResult) {
      var num = Object.keys(sentenceResult).length;
      this.setState({
        sentenceNum: num,
      });
    }
  }

  // manage the selected stats of all filter component to avoid option conflicts
  handleStats1 = (value) => {
    var selectStats = this.state.selectStats;
    selectStats[0] = value;
    this.setState({
      selectStats: selectStats,
    });
    console.log(this.state.selectStats);
  };
  handleStats2 = (value) => {
    var selectStats = this.state.selectStats;
    selectStats[1] = value;
    this.setState({
      selectStats: selectStats,
    });
    console.log(this.state.selectStats);
  };
  handleStats3 = (value) => {
    var selectStats = this.state.selectStats;
    selectStats[2] = value;
    this.setState({
      selectStats: selectStats,
    });
    console.log(this.state.selectStats);
  };

  getselectSentences1 = (selectSentences) => {
    var num = Object.keys(selectSentences).length;
    console.log(num);
    this.setState(
      {
        sentenceNum: num,
        selectSentences1: selectSentences,
        selectSentences2: selectSentences,
      },
      () => {
        if (num === 1) {
          var targetID = Object.keys(selectSentences)[0];
          console.log("get it 1", targetID);
          this.props.handleSelect(targetID);
        }
      }
    );
  };
  getselectSentences2 = (selectSentences) => {
    var num = Object.keys(selectSentences).length;
    console.log(num);

    this.setState(
      {
        sentenceNum: num,
        selectSentences2: selectSentences,
      },
      () => {
        if (num === 1) {
          var targetID = Object.keys(selectSentences)[0];
          console.log("get it 2", targetID);
          this.props.handleSelect(targetID);
        }
      }
    );
  };
  getselectSentences3 = (selectSentences) => {
    var num = Object.keys(selectSentences).length;
    console.log(num);

    this.setState(
      {
        sentenceNum: num,
        selectSentences3: selectSentences,
      },
      () => {
        if (num === 1) {
          var targetID = Object.keys(selectSentences)[0];
          console.log("get it 3", targetID);
          this.props.handleSelect(targetID);
        }
      }
    );
  };

  handleDisplayCtrAdd = () => {
    if (this.state.displayCtl[0] === 0 && this.state.displayCtl[1] === 0) {
      this.setState(
        {
          displayCtl: [1, 0, 1],
        },
        () => {
          console.log("handledisplayAdd", this.state.displayCtl);
        }
      );
    }
    if (this.state.displayCtl[0] !== 0 && this.state.displayCtl[1] === 0) {
      this.setState(
        {
          displayCtl: [1, 1, 0],
        },
        () => {
          console.log("handledisplayAdd", this.state.displayCtl);
        }
      );
    }
    if (this.state.displayCtl[0] === 0 && this.state.displayCtl[1] !== 0) {
      this.setState(
        {
          displayCtl: [1, 1, 0],
        },
        () => {
          console.log("handledisplayAdd", this.state.displayCtl);
        }
      );
    }
  };

  handleDisplayCtr2 = () => {
    var displayCtr = this.state.displayCtl;
    if (this.state.displayCtl[0] === 1) {
      displayCtr[0] = 0;
      displayCtr[2] = 1;
      this.setState({
        displayCtl: displayCtr,
      });
    }
    console.log("handledisplay2", this.state.displayCtl);
  };
  handleDisplayCtr3 = () => {
    var displayCtr = this.state.displayCtl;
    if (this.state.displayCtl[1] === 1) {
      displayCtr[1] = 0;
      displayCtr[2] = 1;
      this.setState({
        displayCtl: displayCtr,
      });
    }
    console.log("handledisplay3", this.state.displayCtl);
  };

  render() {
    const { sentenceNum } = this.state;

    return (
      <div className="statfilter">
        <SRFilter1
          sentenceResult={this.props.sentenceResult}
          selectStats={this.state.selectStats}
          handleStats1={this.handleStats1}
          getselectSentences1={this.getselectSentences1}
        />
        <div
          style={{ display: this.state.displayCtl[0] === 0 ? "none" : "block" }}
        >
          <SRFilter2
            sentenceResult={
              JSON.stringify(this.state.selectSentences1) === "{}"
                ? this.props.sentenceResult
                : this.state.selectSentences1
            }
            selectStats={this.state.selectStats}
            getselectSentences2={this.getselectSentences2}
            handleStats2={this.handleStats2}
            handleDisplayCtr={this.handleDisplayCtr2}
          />
        </div>
        <div
          style={{ display: this.state.displayCtl[1] === 0 ? "none" : "block" }}
        >
          <SRFilter3
            sentenceResult={
              JSON.stringify(this.state.selectSentences2) === "{}"
                ? this.props.sentenceResult
                : this.state.selectSentences2
            }
            selectStats={this.state.selectStats}
            getselectSentences3={this.getselectSentences3}
            handleStats3={this.handleStats3}
            handleDisplayCtr={this.handleDisplayCtr3}
          />
        </div>

        <Button
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
          style={{ marginTop: 10 }}
          disabled={this.state.displayCtl[2] === 0 ? true : false}
          onClick={this.handleDisplayCtrAdd}
        />

        <div className="numf">
          <span className="spant">Number of sentence(s) filtered: </span>
          <Tag className="mytag" color="purple">
            {sentenceNum}
          </Tag>
          <span className="spant">= 1 </span>
          {sentenceNum === 1 ? (
            <CheckOutlined
              style={{ margin: "0px 30px", color: "#0ba331", fontSize: 28 }}
            />
          ) : (
            <CloseOutlined
              style={{ margin: "0px 30px", color: "#f20000", fontSize: 28 }}
            />
          )}
        </div>
      </div>
    );
  }
}

// Select by sentence id
const options = [
  { value: "S1", label: "aaaa" },
  { value: "S2" },
  { value: "S3" },
  { value: "S4" },
];
class SRSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: options,
    };
  }

  // !INTERESTING the ratio changing decide mount first or update first
  // only when this is not the first ratio choice would mount be invoked
  componentDidMount() {
    if (this.props.sentenceResult !== null) {
      var sentenceResult = this.props.sentenceResult;
      var myoption = [];
      for (var key in sentenceResult) {
        myoption.push({
          value: `${key}`,
        });
      }
      console.log(myoption);
      this.setState({ options: myoption });
    }
  }

  componentDidUpdate(previousProps, previousState) {
    var sentenceResult = this.props.sentenceResult;
    // if (sentenceResult !== null) {
    //   console.log(Object.keys(sentenceResult).length);
    // }

    // to avoid infinite loop
    if (previousProps.sentenceResult !== sentenceResult) {
      var myoption = [];

      for (var key in sentenceResult) {
        myoption.push({
          value: `${key}`,
        });
      }
      this.setState({ options: myoption });
    }
  }

  render() {
    return (
      <div className="statfilter">
        <Row>
          <Col span={3}>
            <span style={{ fontSize: 16 }}>Selected Sentence:</span>
          </Col>
          <Select
            showSearch
            style={{ width: 240 }}
            placeholder="Select a sentence"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            size="large"
            options={this.state.options}
            onChange={this.props.handleSelect}
          ></Select>
        </Row>
      </div>
    );
  }
}

// Trial level
// The select in the statFilter
class TRSelect1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: options,
      showTrialFilter: false,
    };
  }

  // !INTERESTING the ratio changing decide mount first or update first
  // only when this is not the first ratio choice would mount be invoked
  componentDidMount() {
    if (this.props.sentenceResult !== null) {
      var sentenceResult = this.props.sentenceResult;
      var myoption = [];
      for (var key in sentenceResult) {
        myoption.push({
          value: `${key}`,
        });
      }

      // console.log("myoption", myoption);
      this.setState({ options: myoption });
    }
  }

  componentDidUpdate(previousProps, previousState) {
    var sentenceResult = this.props.sentenceResult;

    // to avoid infinite loop
    if (previousProps.sentenceResult !== sentenceResult) {
      var myoption = [];

      for (var key in sentenceResult) {
        myoption.push({
          value: `${key}`,
        });
      }

      // console.log("myoption", myoption);
      this.setState({ options: myoption });
    }
  }

  render() {
    return (
      <div>
        <Select
          showSearch
          style={{ width: 240 }}
          placeholder="Select a sentence"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          size="large"
          options={this.state.options}
          onChange={this.props.handleSelectStc}
        ></Select>
      </div>
    );
  }
}

// StatfilterT for trial as a whole
class StatfilterT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sentenceNum: 3,
      selectSentences1: {},
      selectSentences2: {},
      selectSentences3: {},
      selectStats: ["iki", "wpm", "bs"],
      displayCtl: [0, 0, 1],
    };
  }

  componentDidUpdate(previousProps, previousState) {
    var trialResult = this.props.trialResult;
    if (previousProps.trialResult !== trialResult) {
      var num = Object.keys(trialResult).length;
      this.setState({
        sentenceNum: num,
      });
    }
  }

  // manage the selected stats of all filter component to avoid option conflicts
  handleStats1 = (value) => {
    var selectStats = this.state.selectStats;
    selectStats[0] = value;
    this.setState({
      selectStats: selectStats,
    });
    console.log(this.state.selectStats);
  };
  handleStats2 = (value) => {
    var selectStats = this.state.selectStats;
    selectStats[1] = value;
    this.setState({
      selectStats: selectStats,
    });
    console.log(this.state.selectStats);
  };
  handleStats3 = (value) => {
    var selectStats = this.state.selectStats;
    selectStats[2] = value;
    this.setState({
      selectStats: selectStats,
    });
    console.log(this.state.selectStats);
  };

  getselectSentences1 = (selectSentences) => {
    var num = Object.keys(selectSentences).length;
    console.log(num);
    this.setState(
      {
        sentenceNum: num,
        selectSentences1: selectSentences,
        selectSentences2: selectSentences,
      },
      () => {
        if (num === 1) {
          var targetIDT = Object.keys(selectSentences)[0];
          console.log("get it 1", targetIDT);
          this.props.handleSelectTrl(targetIDT);
        }
      }
    );
  };
  getselectSentences2 = (selectSentences) => {
    var num = Object.keys(selectSentences).length;
    console.log(num);

    this.setState(
      {
        sentenceNum: num,
        selectSentences2: selectSentences,
      },
      () => {
        if (num === 1) {
          var targetIDT = Object.keys(selectSentences)[0];
          console.log("get it 2", targetIDT);
          this.props.handleSelectTrl(targetIDT);
        }
      }
    );
  };
  getselectSentences3 = (selectSentences) => {
    var num = Object.keys(selectSentences).length;
    console.log(num);

    this.setState(
      {
        sentenceNum: num,
        selectSentences3: selectSentences,
      },
      () => {
        if (num === 1) {
          var targetIDT = Object.keys(selectSentences)[0];
          console.log("get it 3", targetIDT);
          this.props.handleSelectTrl(targetIDT);
        }
      }
    );
  };

  handleDisplayCtrAdd = () => {
    if (this.state.displayCtl[0] === 0 && this.state.displayCtl[1] === 0) {
      this.setState(
        {
          displayCtl: [1, 0, 1],
        },
        () => {
          console.log("handledisplayAdd", this.state.displayCtl);
        }
      );
    }
    if (this.state.displayCtl[0] !== 0 && this.state.displayCtl[1] === 0) {
      this.setState(
        {
          displayCtl: [1, 1, 0],
        },
        () => {
          console.log("handledisplayAdd", this.state.displayCtl);
        }
      );
    }
    if (this.state.displayCtl[0] === 0 && this.state.displayCtl[1] !== 0) {
      this.setState(
        {
          displayCtl: [1, 1, 0],
        },
        () => {
          console.log("handledisplayAdd", this.state.displayCtl);
        }
      );
    }
  };

  handleDisplayCtr2 = () => {
    var displayCtr = this.state.displayCtl;
    if (this.state.displayCtl[0] === 1) {
      displayCtr[0] = 0;
      displayCtr[2] = 1;
      this.setState({
        displayCtl: displayCtr,
      });
    }
    console.log("handledisplay2", this.state.displayCtl);
  };
  handleDisplayCtr3 = () => {
    var displayCtr = this.state.displayCtl;
    if (this.state.displayCtl[1] === 1) {
      displayCtr[1] = 0;
      displayCtr[2] = 1;
      this.setState({
        displayCtl: displayCtr,
      });
    }
    console.log("handledisplay3", this.state.displayCtl);
  };

  render() {
    const { sentenceNum } = this.state;

    return (
      <div className="statfilter">
        <Row>
          <Col span={3}>
            <span style={{ fontSize: 16 }}>Selected Sentence:</span>
          </Col>

          <TRSelect1
            sentenceResult={
              this.props.sentenceResult === null
                ? null
                : this.props.sentenceResult
            }
            handleSelectStc={this.props.handleSelectStc}
          />
        </Row>

        <div
          style={{
            marginTop: 20,
            display: this.props.showTrialFilter === true ? "block" : "none",
          }}
        >
          <Divider />
          <SRFilter1
            sentenceResult={this.props.trialResult}
            selectStats={this.state.selectStats}
            handleStats1={this.handleStats1}
            getselectSentences1={this.getselectSentences1}
          />
          <div
            style={{
              display: this.state.displayCtl[0] === 0 ? "none" : "block",
            }}
          >
            <SRFilter2
              sentenceResult={
                JSON.stringify(this.state.selectSentences1) === "{}"
                  ? this.props.trialResult
                  : this.state.selectSentences1
              }
              selectStats={this.state.selectStats}
              getselectSentences2={this.getselectSentences2}
              handleStats2={this.handleStats2}
              handleDisplayCtr={this.handleDisplayCtr2}
            />
          </div>
          <div
            style={{
              display: this.state.displayCtl[1] === 0 ? "none" : "block",
            }}
          >
            <SRFilter3
              sentenceResult={
                JSON.stringify(this.state.selectSentences2) === "{}"
                  ? this.props.trialResult
                  : this.state.selectSentences2
              }
              selectStats={this.state.selectStats}
              getselectSentences3={this.getselectSentences3}
              handleStats3={this.handleStats3}
              handleDisplayCtr={this.handleDisplayCtr3}
            />
          </div>
          <Button
            type="primary"
            shape="circle"
            icon={<PlusOutlined />}
            size="large"
            style={{ marginTop: 10 }}
            disabled={this.state.displayCtl[2] === 0 ? true : false}
            onClick={this.handleDisplayCtrAdd}
          />
          <div className="numf">
            <span className="spant">Number of sentence(s) filtered: </span>
            <Tag className="mytag" color="purple">
              {sentenceNum}
            </Tag>
            <span className="spant">= 1 </span>
            {sentenceNum === 1 ? (
              <CheckOutlined
                style={{ margin: "0px 30px", color: "#0ba331", fontSize: 28 }}
              />
            ) : (
              <CloseOutlined
                style={{ margin: "0px 30px", color: "#f20000", fontSize: 28 }}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

const options1 = [
  // { value: "T1" },
  // { value: "T2" },
  // { value: "T3" },
  // { value: "T4" },
];
class TRSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: options,
      options1: options1,
    };
  }

  // !INTERESTING the ratio changing decide mount first or update first
  // only when this is not the first ratio choice would mount be invoked
  componentDidMount() {
    if (this.props.sentenceResult !== null) {
      var sentenceResult = this.props.sentenceResult;
      var myoption = [];
      for (var key in sentenceResult) {
        myoption.push({
          value: `${key}`,
        });
      }
      if (options1.length === 0) {
        var dict = sentenceResult["1"];
        var trialOption = [];
        for (var key in dict) {
          trialOption.push({
            value: `${key}`,
          });
        }
      }

      // console.log("myoption", myoption);
      // console.log("trialOption", trialOption);
      this.setState({ options: myoption, options1: trialOption });
    }
  }

  componentDidUpdate(previousProps, previousState) {
    var sentenceResult = this.props.sentenceResult;

    // to avoid infinite loop
    if (previousProps.sentenceResult !== sentenceResult) {
      var myoption = [];

      for (var key in sentenceResult) {
        myoption.push({
          value: `${key}`,
        });
      }
      if (options1.length === 0) {
        var dict = sentenceResult["1"];
        var trialOption = [];
        for (var key in dict) {
          trialOption.push({
            value: `${key}`,
          });
        }
      }

      // console.log("myoption", myoption);
      // console.log("trialOption", trialOption);
      this.setState({ options: myoption, options1: trialOption });
    }
  }

  render() {
    return (
      <div className="statfilter">
        <Row>
          <Col span={3}>
            <span style={{ fontSize: 16 }}>Selected Sentence:</span>
          </Col>
          <Select
            showSearch
            style={{ width: 240 }}
            placeholder="Select a sentence"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            size="large"
            options={this.state.options}
            onChange={this.props.handleSelectStc}
          ></Select>
        </Row>

        <div
          style={{
            marginTop: 20,
            display: this.props.showTrialSelect === true ? "block" : "none",
          }}
        >
          <Row>
            <Col span={3}>
              <span style={{ fontSize: 16 }}>Selected Trial:</span>
            </Col>
            <Col span={5}>
              <Select
                showSearch
                style={{ width: 240 }}
                placeholder="Select a trial"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                size="large"
                options={this.state.options1}
                onChange={this.props.handleSelectTrl}
              ></Select>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

class TrmFilter extends Component {
  state = {
    inputValue: 0,
  };

  onChange = (value) => {
    this.setState({
      inputValue: value,
    });
  };

  render() {
    const { inputValue } = this.state;

    return (
      <div className="trmfilter">
        <div className="trmlabel">
          <span>0</span>
          <strong>
            <i>{this.props.lb1}</i>
          </strong>
        </div>
        <Slider
          max={1}
          defaultValue={0}
          style={{ width: 400 }}
          onChange={this.onChange}
          size="large"
          step={0.0001}
          value={typeof inputValue === "number" ? inputValue : 0}
        />
        <div className="trmlabel">
          <span>1</span>
          <strong>
            <i>{this.props.lb2}</i>
          </strong>
        </div>
        <InputNumber
          style={{ margin: "0 24px" }}
          value={inputValue}
          onChange={this.onChange}
          size="large"
        />
      </div>
    );
  }
}

export { Statfilter, SRSelect, StatfilterT, TRSelect, TrmFilter };
