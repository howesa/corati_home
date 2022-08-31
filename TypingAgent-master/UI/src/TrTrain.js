import React from "react";
import { Component } from "react";
import { Checkbox } from "antd";
import { Input } from "antd";
import { Button } from "antd";
import "./css/Ev/EvEvaluate.less";

import { TStep2, EStepV } from "./comp/CSteps";
import { CProgress } from "./comp/CProgress";
import { EvCard1 } from "./comp/CCard";

const modelLogs = [{ log: "This is the evaluation log" }];

// Rendering list data
class ModelLog extends Component {
  render() {
    const { modelLog } = this.props;
    return (
      <div>
        <div>{modelLog.log}</div>
      </div>
    );
  }
}

function dataHandle(xhr, position) {
  var messages = xhr.responseText.split("\n");
  messages.slice(position, -1).forEach(function(value) {
    console.log(value);
  });
  position = messages.length - 1;
}

function evaDone() {
  this.props.history.push("/train/process1");
}
class TrTrain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      sentence: "",
      log: modelLogs
    };
    // this.handleEvaDone = this.handleEvaDone.bind(this);
    this.evaDone = evaDone.bind(this);
  }

  onChange = e => {
    console.log("checked");
    this.setState({
      checked: !this.state.checked
    });
  };

  handleClickEvR = () => {
    this.props.history.push("/evaluate/result");
  };

  handleEvaDone() {
    this.props.history.push("/evaluate/process1");
  }

  handleClickUpdate = () => {};

  // Pass the parameter from the model
  componentDidMount() {
    var data = this.props.location.state;

    // evaluation
    setTimeout(() => {
      if (data != undefined) {
        if (data.prev === "evaluation") {
          console.log("evaluation");
          var { sentence } = data;
          this.setState({
            sentence: sentence,
            log: modelLogs
          });
          this.startEvaluation();
          console.log(this.state.log);
        }
        if (data.prev === "training") {
          console.log("training");
          this.startTraining();
          console.log(this.state.log);
        }
      }
    }, 0);
  }

  // Start training by calling the api
  startTraining = () => {
    // TODO1: Progress of training/evaluation still cannot be fetched even with --verbose

    // TODO2: Connection automatically terminates in 2 minutes
    // Assumption 1: No response for 2 minutes as progress info  cannot be fetch
    // Assumption 2: Connection cannot be longer than 2 minutes. ⇒ Turn to web socket?

    var xhr = new XMLHttpRequest();
    let sentence = "no";
    var url = "/train/?sentence=" + sentence;
    console.log(url);
    // var url = "/stream";

    xhr.open("GET", url, true);
    xhr.timeout = 300000; // time in milliseconds
    xhr.setRequestHeader("content-type", "text/event-stream;charset=UTF-8");
    xhr.send();
    var position = 0;

    // !IMPORTANT to make sure this calls the correct function
    // You’re calling this.setState inside of your callback to Messages.slice().
    // You need to cache the reference to this outside of that API call.
    let currentComponent = this;

    function dataHandle() {
      var messages = xhr.responseText.split("\n");
      var log = "";
      // Get the new line and update the state to trigger rendering
      messages.slice(position, -1).forEach(function(value) {
        console.log(value);

        log = value;
        var json = { log: log };
        modelLogs.push(json);
        console.log(modelLogs);

        currentComponent.setState({
          log: modelLogs
        });
      });
      position = messages.length - 1;
    }

    // function evaDone() {
    //   this.props.history.push("/evaluate/process1");
    // }

    var timer;
    timer = setInterval(function() {
      // loading the unfinished data
      if (xhr.readyState == 3) {
        // dataHandle(xhr, position);

        dataHandle();
      }

      // stop checking once the response has ended
      if (xhr.readyState == 4) {
        dataHandle();
        clearInterval(timer);
        console.log("done");
        // evaDone();
        // this.handleEvaDone.bind(this);
        // console.log(this.state.sentence);
      }
    }, 100);
  };

  render() {
    const { checked } = this.state;

    const checkStyle = {
      marginTop: 20
    };

    const bgStyle = {
      backgroundColor: "#fff",
      marginTop: 40,
      padding: "30px 30px"
    };

    return (
      <div>
        <TStep2 />
        <div style={bgStyle}>
          <CProgress percent={60} />
          <h4
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              fontWeight: "600",
              fontSize: "20px"
            }}
          >
            Estimated time remaining: 48min
          </h4>
          <div className="evprocess">
            <EStepV />
            <EvCard1
              content={modelLogs.map((modelLog, i) => (
                <ModelLog key={i} modelLog={modelLog} />
              ))}
            />
          </div>
          {/* <Checkbox
            onChange={this.onChange}
            checked={checked}
            style={{ fontSize: 18 }}
          >
            Notifying me when the results are ready
            {checked === true ? (
              <Input
                placeholder="Input your email address"
                size="large"
                style={checkStyle}
              />
            ) : (
              <Input
                placeholder="Input your email address"
                size="large"
                style={checkStyle}
                disabled
              />
            )}
          </Checkbox> */}
        </div>
        <div style={bgStyle}>
          <div className="check-result-btn">
            <Button
              className="button"
              type="primary"
              size="large"
              disabled
              onClick={this.handleClickEvR}
            >
              Check Results
            </Button>

            <Button
              className="button"
              size="large"
              onClick={this.handleClickUpdate}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default TrTrain;
