import React from "react";
import { Component } from "react";
import { EvCard2 } from "../comp/CCard";
import { MRGeneral, MRPerformance, MREye, MRFinger } from "../comp/CTable";

import "../css/Ev/EvMR.less";

class EvMR extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sentenceResult: null
    };
  }

  // get data from api
  componentDidMount() {
    fetch("/dataG")
      .then(res => res.json())
      .then(data => {
        this.setState({
          sentenceResult: data
        });
      });
  }
  render() {
    return (
      <div>
        <EvCard2 title="General">
          <MRGeneral
            sentenceResult={
              this.state.sentenceResult === null
                ? null
                : this.state.sentenceResult
            }
          />
        </EvCard2>
        <EvCard2 title="Performance (average per sentence)">
          <MRPerformance
            sentenceResult={
              this.state.sentenceResult === null
                ? null
                : this.state.sentenceResult
            }
          />
        </EvCard2>
        <EvCard2 title="Eye Gaze (average per sentence)">
          <MREye
            sentenceResult={
              this.state.sentenceResult === null
                ? null
                : this.state.sentenceResult
            }
          />
        </EvCard2>
      </div>
    );
  }
}

export { EvMR };
