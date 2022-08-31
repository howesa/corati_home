import React from "react";
import { Component } from "react";
import { Progress } from "antd";

import "../css/comp/CProgress.less";

class CProgress extends Component {
  render() {
    return (
      <Progress
        strokeColor={{
          "0%": "#D9BDFD",
          "100%": "#8B64BD",
        }}
        percent={this.props.percent}
        status="active"
        style={{ height: "40px" }}
      >
        Estimated time remaining
      </Progress>
    );
  }
}

export { CProgress };
