import React from "react";
import { Component } from "react";
import { Table } from "antd";

import "../css/comp/CTable.less";

// BF
const columnsBF = [
  {
    title: " ",
    dataIndex: "tbname",
    width: 500
  },
  {
    title: "Tremor",
    dataIndex: "tremor"
  },
  {
    title: "Expertise",
    dataIndex: "expertise"
  },
  {
    title: "Dyslexia",
    dataIndex: "dyslexia"
  }
];
const dataBF = [
  {
    key: "1",
    tbname: "Behavioural Feature",
    tremor: 0.3,
    expertise: 0.1,
    dyslexia: 0.0
  }
];

class EvTable1 extends Component {
  render() {
    return (
      <div>
        {/* <h4>Behavioural Feature</h4> */}
        <Table
          pagination={false}
          columns={columnsBF}
          dataSource={dataBF}
          size="default"
        />
      </div>
    );
  }
}

// VM
const columnsVM = [
  {
    title: " ",
    dataIndex: "tbname",
    width: 500
  },
  {
    title: "K",
    dataIndex: "k1"
  },
  {
    title: "k",
    dataIndex: "k2"
  },
  {
    title: "exec",
    dataIndex: "exec"
  },
  {
    title: "saccade",
    dataIndex: "saccade"
  },
  {
    title: "prep",
    dataIndex: "prep"
  }
];
const dataVM = [
  {
    key: "1",
    tbname: "Vison Model (EMMA)",
    k1: 0.3,
    k2: 0.1,
    exec: 0.0,
    saccade: 80,
    prep: 80
  }
];

class EvTable2 extends Component {
  render() {
    return (
      <div>
        {/* <h4>Behavioural Feature</h4> */}
        <Table
          pagination={false}
          columns={columnsVM}
          dataSource={dataVM}
          size="default"
        />
      </div>
    );
  }
}

// FM
// VM
const columnsFM = [
  {
    title: " ",
    dataIndex: "tbname",
    width: 500
  },
  {
    title: "x0",
    dataIndex: "x0"
  },
  {
    title: "y0",
    dataIndex: "y0"
  },
  {
    title: "alpha",
    dataIndex: "alpha"
  },
  {
    title: "x_min",
    dataIndex: "x_min"
  },
  {
    title: "x_max",
    dataIndex: "x_max"
  },
  {
    title: "k_alpha",
    dataIndex: "k_alpha"
  }
];
const dataFM = [
  {
    key: "1",
    tbname: "Finger Model (WHo)",
    x0: 0.3,
    y0: 0.1,
    alpha: 0.0,
    x_min: 80,
    x_max: 80,
    k_alpha: 0.0
  }
];

class EvTable3 extends Component {
  render() {
    return (
      <div>
        {/* <h4>Behavioural Feature</h4> */}
        <Table
          pagination={false}
          columns={columnsFM}
          dataSource={dataFM}
          size="default"
        />
      </div>
    );
  }
}

// Main Result - General
const columnsMRG = [
  {
    title: " ",
    dataIndex: "mrg1",
    width: 500
  },
  {
    title: " ",
    dataIndex: "mrg1num"
  }
];
const dataMRG = [
  {
    key: "1",
    mrg1: "Number of sentences typed:",
    mrg1num: 32
  },
  {
    key: "2",
    mrg1: "Number of trials completed:",
    mrg1num: 320
  }
];

class MRGeneral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnsMRG: columnsMRG,
      dataMRG: dataMRG
    };
  }

  componentDidUpdate(previousProps, previousState) {
    var tmp = this.state.dataMRG;
    if (this.props.sentenceResult !== null) {
      var sentenceResult = this.props.sentenceResult;
      if (previousProps.sentenceResult !== sentenceResult) {
        tmp[0].mrg1num = sentenceResult["sNum"];
        tmp[1].mrg1num = sentenceResult["tNum"];
        console.log(tmp);
      }
    }

    if (previousProps.sentenceResult !== this.props.sentenceResult) {
      this.setState({ dataMRG: tmp });
    }
  }

  render() {
    return (
      <div>
        <Table
          className="mrgeneral"
          pagination={false}
          columns={this.state.columnsMRG}
          dataSource={this.state.dataMRG}
          style={{ margin: "-20px auto" }}
        />
      </div>
    );
  }
}

// Main Result - Performance
const columnsMRP = [
  {
    title: " ",
    dataIndex: "mrp1",
    width: 500
  },
  {
    title: "Mean",
    dataIndex: "mrpM"
  },
  {
    title: "SD",
    dataIndex: "mrpSD"
  }
];
const dataMRP = [
  {
    key: "1",
    mrp1: "Inter-key interval (IKI, ms):",
    mrpM: 380.94,
    mrpSD: 50.95
  },
  {
    key: "2",
    mrp1: "Words per minute (WPM):",
    mrpM: 27.19,
    mrpSD: 3.61
  },
  {
    key: "3",
    mrp1: "Number of backspaces:",
    mrpM: 2.61,
    mrpSD: 1.81
  },
  {
    key: "4",
    mrp1: "Immediate backspaces:",
    mrpM: 2.61,
    mrpSD: 1.81
  },
  {
    key: "5",
    mrp1: "Delayed backspaces:",
    mrpM: 2.61,
    mrpSD: 1.81
  },
  {
    key: "6",
    mrp1: "Corrected error rate (%):",
    mrpM: 0.56,
    mrpSD: 0.71
  },
  {
    key: "7",
    mrp1: "Uncorrected error rate (%):",
    mrpM: 9.38,
    mrpSD: 5.75
  }
];

class MRPerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnsMRP: columnsMRP,
      dataMRP: dataMRP
    };
  }

  componentDidMount() {
    // parent didmount, child didupdate
  }

  meanCal = ([...data]) => {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      // total += parseFloat(data[i]);
      total += data[i];
    }
    return total / data.length;
  };

  sdCal = ([...data]) => {
    let mean = this.meanCal(data);
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      // total += (parseFloat(data[i]) - mean) ** 2;
      total += (data[i] - mean) ** 2;
    }
    var variance = total / data.length;
    return Math.sqrt(variance);
  };

  componentDidUpdate(previousProps, previousState) {
    var sentenceResult = this.props.sentenceResult;

    // // calculat mean and std with frontend
    // if (previousProps.sentenceResult !== sentenceResult) {
    //   var ikiArr = [];
    //   var wpmArr = [];
    //   var bsArr = [];
    //   var imBsArr = [];
    //   var dlBsArr = [];
    //   var corErrArr = [];
    //   var unErrArr = [];
    //   var test = [];

    //   for (var key in sentenceResult) {
    //     var trials = sentenceResult[key];
    //     for (var key in trials) {
    //       ikiArr.push(parseFloat(trials[key]["iki"]));
    //       test.push(parseFloat(trials[key]["iki"]));
    //       wpmArr.push(parseFloat(trials[key]["wpm"]));
    //       bsArr.push(parseFloat(trials[key]["bs"]));
    //       imBsArr.push(parseFloat(trials[key]["imBs"]));
    //       dlBsArr.push(parseFloat(trials[key]["dlBs"]));
    //       corErrArr.push(parseFloat(trials[key]["corErr"]));
    //       unErrArr.push(parseFloat(trials[key]["unErr"]));
    //     }
    //   }
    //   var ikiMean = this.meanCal(ikiArr);
    //   var ikiSd = this.sdCal(ikiArr);
    // }
    var tmp = this.state.dataMRP;
    if (this.props.sentenceResult !== null) {
      var sentenceResult = this.props.sentenceResult;
      if (previousProps.sentenceResult !== sentenceResult) {
        tmp[0].mrpM = sentenceResult["ikiMean"];
        tmp[0].mrpSD = sentenceResult["ikiSD"];
        tmp[1].mrpM = sentenceResult["wpmMean"];
        tmp[1].mrpSD = sentenceResult["wpmSD"];
        tmp[2].mrpM = sentenceResult["bsMean"];
        tmp[2].mrpSD = sentenceResult["bsSD"];
        tmp[3].mrpM = sentenceResult["imBsMean"];
        tmp[3].mrpSD = sentenceResult["imBsSD"];
        tmp[4].mrpM = sentenceResult["dlBsMean"];
        tmp[4].mrpSD = sentenceResult["dlBsSD"];
        tmp[5].mrpM = sentenceResult["corErrMean"];
        tmp[5].mrpSD = sentenceResult["corErrSD"];
        tmp[6].mrpM = sentenceResult["unErrMean"];
        tmp[6].mrpSD = sentenceResult["unErrSD"];
        console.log(tmp);
      }
    }

    if (previousProps.sentenceResult !== this.props.sentenceResult) {
      this.setState({ dataMRP: tmp });
    }
  }

  render() {
    return (
      <div>
        <Table
          pagination={false}
          columns={this.state.columnsMRP}
          dataSource={this.state.dataMRP}
          style={{ margin: "-20px auto", backgroundColor: "#fffff!important" }}
        />
      </div>
    );
  }
}

// Main Result - Eye Gaze
const columnsMRE = [
  {
    title: " ",
    dataIndex: "mre1",
    width: 500
  },
  {
    title: "Mean",
    dataIndex: "mreM"
  },
  {
    title: "SD",
    dataIndex: "mreSD"
  }
];
const dataMRE = [
  {
    key: "1",
    mre1: "Number of fixations:",
    mreM: 24.04,
    mreSD: 4.56
  },
  {
    key: "2",
    mre1: "Fixation duration:",
    mreM: 303.99,
    mreSD: 45.72
  },
  {
    key: "3",
    mre1: "Number of gaze shift:",
    mreM: 3.91,
    mreSD: 1.5
  },
  {
    key: "4",
    mre1: "Time ratio for gaze on keyboard:",
    mreM: 0.7,
    mreSD: 0.14
  }
];

class MREye extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnsMRE: columnsMRE,
      dataMRE: dataMRE
    };
  }

  componentDidMount() {
    var tmp = this.state.dataMRE;
  }

  meanCal = ([...data]) => {
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      // total += parseFloat(data[i]);
      total += data[i];
    }
    return total / data.length;
  };

  sdCal = ([...data]) => {
    let mean = this.meanCal(data);
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      // total += (parseFloat(data[i]) - mean) ** 2;
      total += (data[i] - mean) ** 2;
    }
    var variance = total / data.length;
    return Math.sqrt(variance);
  };

  componentDidUpdate(previousProps, previousState) {
    var tmp = this.state.dataMRE;
    // console.log(this.props.targetstc);

    if (this.props.sentenceResult !== null) {
      var sentenceResult = this.props.sentenceResult;
      if (previousProps.sentenceResult !== sentenceResult) {
        tmp[0].mreM = sentenceResult["fixNumMean"];
        tmp[0].mreSD = sentenceResult["fixNumSD"];
        tmp[1].mreM = sentenceResult["fixDurMean"];
        tmp[1].mreSD = sentenceResult["fixDurSD"];
        tmp[2].mreM = sentenceResult["gazeShiftMean"];
        tmp[2].mreSD = sentenceResult["gazeShiftSD"];
        tmp[3].mreM = sentenceResult["gazeRatioMean"];
        tmp[3].mreSD = sentenceResult["gazeRatioSD"];
      }
    }

    if (previousProps.sentenceResult !== this.props.sentenceResult) {
      this.setState({ dataMEP: tmp });
    }
  }

  render() {
    return (
      <div>
        <Table
          pagination={false}
          columns={this.state.columnsMRE}
          dataSource={this.state.dataMRE}
          style={{ margin: "-20px auto", backgroundColor: "#fffff!important" }}
        />
      </div>
    );
  }
}

// Main Result - Performance
const columnsMRPS = [
  {
    title: " ",
    dataIndex: "mrp1",
    width: 500
  },
  {
    title: "Mean",
    dataIndex: "mrpM"
  },
  {
    title: "SD",
    dataIndex: "mrpSD"
  }
];
const dataMRPS = [
  {
    key: "1",
    mrp1: "Inter-key interval (IKI, ms):",
    mrpM: 380.94,
    mrpSD: 50.95
  },
  {
    key: "2",
    mrp1: "Words per minute (WPM):",
    mrpM: 27.19,
    mrpSD: 3.61
  },
  {
    key: "3",
    mrp1: "Number of backspaces:",
    mrpM: 2.61,
    mrpSD: 1.81
  },
  {
    key: "4",
    mrp1: "Immediate backspaces:",
    mrpM: 2.61,
    mrpSD: 1.81
  },
  {
    key: "5",
    mrp1: "Delayed backspaces:",
    mrpM: 2.61,
    mrpSD: 1.81
  },
  {
    key: "6",
    mrp1: "Corrected error rate (%):",
    mrpM: 0.56,
    mrpSD: 0.71
  },
  {
    key: "7",
    mrp1: "Uncorrected error rate (%):",
    mrpM: 9.38,
    mrpSD: 5.75
  }
];

class MRPerformanceS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnsMRP: columnsMRPS,
      dataMRP: dataMRPS
    };
  }

  componentDidMount() {
    // parent didmount, child didupdate
  }

  componentDidUpdate(previousProps, previousState) {
    var tmp = this.state.dataMRP;
    if (this.props.targetstc !== null) {
      tmp[0].mrpM = parseFloat(this.props.targetstc.iki).toFixed(14);
      tmp[0].mrpSD = parseFloat(this.props.targetstc.ikiSD).toFixed(14);
      tmp[1].mrpM = parseFloat(this.props.targetstc.wpm).toFixed(14);
      tmp[1].mrpSD = parseFloat(this.props.targetstc.wpmSD).toFixed(14);
      tmp[2].mrpM = parseFloat(this.props.targetstc.bs).toFixed(4);
      tmp[2].mrpSD = parseFloat(this.props.targetstc.bsSD).toFixed(14);
      tmp[3].mrpM = parseFloat(this.props.targetstc.imBs).toFixed(4);
      tmp[3].mrpSD = parseFloat(this.props.targetstc.imBsSD).toFixed(14);
      tmp[4].mrpM = parseFloat(this.props.targetstc.dlBs).toFixed(4);
      tmp[4].mrpSD = parseFloat(this.props.targetstc.dlBsSD).toFixed(14);
      tmp[5].mrpM = parseFloat(this.props.targetstc.corErr).toFixed(4);
      tmp[5].mrpSD = parseFloat(this.props.targetstc.corErrSD).toFixed(14);
      tmp[6].mrpM = parseFloat(this.props.targetstc.unErr).toFixed(4);
      tmp[6].mrpSD = parseFloat(this.props.targetstc.unErrSD).toFixed(14);
    }

    if (previousProps.targetstc !== this.props.targetstc) {
      this.setState({ dataMRP: tmp });
    }
  }

  render() {
    return (
      <div>
        <Table
          pagination={false}
          columns={this.state.columnsMRP}
          dataSource={this.state.dataMRP}
          style={{ margin: "-20px auto", backgroundColor: "#fffff!important" }}
        />
      </div>
    );
  }
}

// Main Result - Eye Gaze
const columnsMRES = [
  {
    title: " ",
    dataIndex: "mre1",
    width: 500
  },
  {
    title: "Mean",
    dataIndex: "mreM"
  },
  {
    title: "SD",
    dataIndex: "mreSD"
  }
];
const dataMRES = [
  {
    key: "1",
    mre1: "Number of fixations:",
    mreM: 24.04,
    mreSD: 4.56
  },
  {
    key: "2",
    mre1: "Fixation duration:",
    mreM: 303.99,
    mreSD: 45.72
  },
  {
    key: "3",
    mre1: "Number of gaze shift:",
    mreM: 3.91,
    mreSD: 1.5
  },
  {
    key: "4",
    mre1: "Time ratio for gaze on keyboard:",
    mreM: 0.7,
    mreSD: 0.14
  }
];

class MREyeS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnsMRE: columnsMRES,
      dataMRE: dataMRES
    };
  }

  componentDidMount() {
    var tmp = this.state.dataMRE;
  }

  componentDidUpdate(previousProps, previousState) {
    var tmp = this.state.dataMRE;
    // console.log(this.props.targetstc);

    if (this.props.targetstc !== null) {
      tmp[0].mreM = parseFloat(this.props.targetstc.fixNum).toFixed(4);
      tmp[0].mreSD = parseFloat(this.props.targetstc.fixNumSD).toFixed(14);
      tmp[1].mreM = parseFloat(this.props.targetstc.fixDur).toFixed(14);
      tmp[1].mreSD = parseFloat(this.props.targetstc.fixDurSD).toFixed(14);
      tmp[2].mreM = parseFloat(this.props.targetstc.gazeShift).toFixed(4);
      tmp[2].mreSD = parseFloat(this.props.targetstc.gazeShiftSD).toFixed(14);
      tmp[3].mreM = parseFloat(this.props.targetstc.gazeRatio).toFixed(14);
      tmp[3].mreSD = parseFloat(this.props.targetstc.gazeRatioSD).toFixed(14);
    }

    // to avoid infinite loop
    if (previousProps.targetstc !== this.props.targetstc) {
      this.setState({ dataMRE: tmp });
    }
  }

  render() {
    return (
      <div>
        <Table
          pagination={false}
          columns={this.state.columnsMRE}
          dataSource={this.state.dataMRE}
          style={{ margin: "-20px auto", backgroundColor: "#fffff!important" }}
        />
      </div>
    );
  }
}

// Trial Result - Performance
const columnsMRPT = [
  {
    title: " ",
    dataIndex: "mrp1",
    width: 500
  },
  {
    title: "Value",
    dataIndex: "mrpM"
  }
];
const dataMRPT = [
  {
    key: "1",
    mrp1: "Inter-key interval (IKI, ms):",
    mrpM: 380.94
  },
  {
    key: "2",
    mrp1: "Words per minute (WPM):",
    mrpM: 27.19
  },
  {
    key: "3",
    mrp1: "Number of backspaces:",
    mrpM: 2.61
  },
  {
    key: "4",
    mrp1: "Immediate backspaces:",
    mrpM: 2.61
  },
  {
    key: "5",
    mrp1: "Delayed backspaces:",
    mrpM: 2.61
  },
  {
    key: "6",
    mrp1: "Corrected error rate (%):",
    mrpM: 0.56
  },
  {
    key: "7",
    mrp1: "Uncorrected error rate (%):",
    mrpM: 9.38
  }
];

class MRPerformanceT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnsMRP: columnsMRPT,
      dataMRP: dataMRPT
    };
  }

  componentDidMount() {
    // parent didmount, child didupdate
  }

  componentDidUpdate(previousProps, previousState) {
    var tmp = this.state.dataMRP;
    if (this.props.targettrl !== null) {
      tmp[0].mrpM = parseFloat(this.props.targettrl.iki).toFixed(14);
      tmp[1].mrpM = parseFloat(this.props.targettrl.wpm).toFixed(14);
      tmp[2].mrpM = parseFloat(this.props.targettrl.bs).toFixed(0);
      tmp[3].mrpM = parseFloat(this.props.targettrl.imBs).toFixed(0);
      tmp[4].mrpM = parseFloat(this.props.targettrl.dlBs).toFixed(0);
      tmp[5].mrpM = parseFloat(this.props.targettrl.corErr).toFixed(0);
      tmp[6].mrpM = parseFloat(this.props.targettrl.unErr).toFixed(0);
    }

    if (previousProps.targettrl !== this.props.targettrl) {
      this.setState({ dataMRP: tmp });
    }
  }

  render() {
    return (
      <div>
        <Table
          pagination={false}
          columns={this.state.columnsMRP}
          dataSource={this.state.dataMRP}
          style={{ margin: "-20px auto", backgroundColor: "#fffff!important" }}
        />
      </div>
    );
  }
}

// Trial Result - Eye Gaze
const columnsMRET = [
  {
    title: " ",
    dataIndex: "mre1",
    width: 500
  },
  {
    title: "Value",
    dataIndex: "mreM"
  }
];
const dataMRET = [
  {
    key: "1",
    mre1: "Number of fixations:",
    mreM: 24.04
  },
  {
    key: "2",
    mre1: "Fixation duration:",
    mreM: 303.99
  },
  {
    key: "3",
    mre1: "Number of gaze shift:",
    mreM: 3.91
  },
  {
    key: "4",
    mre1: "Time ratio for gaze on keyboard:",
    mreM: 0.7
  }
];

class MREyeT extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columnsMRE: columnsMRET,
      dataMRE: dataMRET
    };
  }

  componentDidMount() {}

  componentDidUpdate(previousProps, previousState) {
    var tmp = this.state.dataMRE;
    // console.log(this.props.targetstc);

    if (this.props.targettrl !== null) {
      tmp[0].mreM = parseFloat(this.props.targettrl.fixNum).toFixed(0);
      tmp[1].mreM = parseFloat(this.props.targettrl.fixDur).toFixed(14);
      tmp[2].mreM = parseFloat(this.props.targettrl.gazeShift).toFixed(0);
      tmp[3].mreM = parseFloat(this.props.targettrl.gazeRatio).toFixed(14);
    }

    // to avoid infinite loop
    if (previousProps.targettrl !== this.props.targettrl) {
      this.setState({ dataMRE: tmp });
    }
  }

  render() {
    return (
      <div>
        <Table
          pagination={false}
          columns={this.state.columnsMRE}
          dataSource={this.state.dataMRE}
          style={{ margin: "-20px auto", backgroundColor: "#fffff!important" }}
        />
      </div>
    );
  }
}

// Main Result - Finger Movement
const columnsMRF = [
  {
    title: " ",
    dataIndex: "mrf1",
    width: 500
  },
  {
    title: "Mean",
    dataIndex: "mrfM"
  },
  {
    title: "SD",
    dataIndex: "mrfSD"
  }
];
const dataMRF = [
  {
    key: "1",
    mrf1: "Number of fixations:",
    mrfM: 24.04,
    mrfSD: 4.56
  }
];

class MRFinger extends Component {
  render() {
    return (
      <div>
        <Table
          pagination={false}
          columns={columnsMRF}
          dataSource={dataMRF}
          style={{ margin: "-20px auto", backgroundColor: "#fffff!important" }}
        />
      </div>
    );
  }
}

export {
  EvTable1,
  EvTable2,
  EvTable3,
  MRGeneral,
  MRPerformance,
  MREye,
  MRPerformanceS,
  MREyeS,
  MRFinger,
  MRPerformanceT,
  MREyeT
};
