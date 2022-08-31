import React from "react";
import { Component } from "react";
import { Button } from "antd";
import "./css/Ev/EvModel.less";

import { EStep1 } from "./comp/CSteps";
import { ECollapse } from "./comp/CCollapse";
import { EvCS } from "./cont/EvCS";
import { EvMS } from "./cont/EvMS";

class Demo extends Component {
  state = {
    value: 1,
    sentence: "zhuzhu",
  };

  onChangeSts = (e) => {
    console.log(e.target.value);
    this.setState({ sentence: e.target.value });
  };

  // stream and time both work
  handleClickEvM2 = () => {
    var xhr = new XMLHttpRequest();
    console.log(this.state.sentence);
    // var url = "/time/?sentence=" + this.state.sentence;
    // console.log(url);
    var url = "/stream";

    xhr.open("GET", url, true);
    // xhr.open("GET", "{{ url_for('stream') }}");
    xhr.setRequestHeader("content-type", "text/event-stream;charset=UTF-8");
    xhr.send();
    var position = 0;

    function dataHandle() {
      var messages = xhr.responseText.split("\n");
      messages.slice(position, -1).forEach(function (value) {
        console.log(value);
      });
      position = messages.length - 1;
    }

    var timer;
    timer = setInterval(function () {
      // loading the unfinished data
      if (xhr.readyState == 3) {
        dataHandle();
      }

      // stop checking once the response has ended
      if (xhr.readyState == 4) {
        dataHandle();
        clearInterval(timer);
        console.log("done");
      }
    }, 100);
  };

  handleClickEvP = () => {
    var data = { sentence: this.state.sentence, prev: "evaluation" };
    var path = {
      pathname: "/evaluate/process",
      state: data,
    };
    // this.props.history.push("/evaluate/process");
    this.props.history.push(path);
  };

  render() {
    return (
      <div>
        <EStep1 />
        <ECollapse header="Corpus Selection">
          <EvCS onChangeSts={this.onChangeSts.bind(this)} />
        </ECollapse>
        <ECollapse header="Model Selection">
          <EvMS />
        </ECollapse>
        <div className="start-ev-btn">
          <Button
            className="button"
            type="primary"
            size="large"
            onClick={this.handleClickEvP}
          >
            Start Evaluating
          </Button>
        </div>
      </div>
    );
  }
}

export default Demo;
