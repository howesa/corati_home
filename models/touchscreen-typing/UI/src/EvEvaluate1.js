import React from "react";
import { Component } from "react";

import { Button, Result } from "antd";
import "./css/Ev/EvEvaluate.less";

import { EStep3, EStepV } from "./comp/CSteps";
import { CProgress } from "./comp/CProgress";

class EvEvaluate extends Component {
  handleClickEvR = () => {
    this.props.history.push("/evaluate/result");
  };

  render() {
    const checkStyle = {
      marginTop: 20,
    };

    const bgStyle = {
      backgroundColor: "#fff",
      marginTop: 40,
      padding: "30px 30px",
    };

    return (
      <div>
        <EStep3 />
        <div style={bgStyle}>
          <CProgress percent={100} />
          <h4
            style={{
              marginBottom: "20px",
              marginTop: "20px",
              fontWeight: "600",
              fontSize: "20px",
            }}
          >
            Time spent: 1h 37min
          </h4>
          <Result
            status="success"
            title="The model training is done."
            subTitle="You can now explore and analyse the result!"
            style={{ fontSize: "24px" }}
          />
        </div>
        <div style={bgStyle}>
          <div className="check-result-btn">
            <Button
              className="button"
              type="primary"
              size="large"
              onClick={this.handleClickEvR}
            >
              Check Results
            </Button>
            <Button className="button" size="large">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default EvEvaluate;
