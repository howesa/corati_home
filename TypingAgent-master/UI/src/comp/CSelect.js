import React from "react";
import { Component } from "react";
import { Select } from "antd";

const { Option } = Select;

class EvCS_S1 extends Component {
  render() {
    return (
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a corpus"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        size="large"
        style={{
          display: "block",
          width: "400px",
          marginTop: "10px"
        }}
      >
        <Option value="E1">English 1</Option>
        <Option value="E2">English 2</Option>
        <Option value="F1">Finnish 1</Option>
        <Option value="F2">Finnish 2</Option>
      </Select>
    );
  }
}

class EvCS_S1_d extends Component {
  render() {
    return (
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a corpus"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        size="large"
        style={{ display: "block", width: "400px", marginTop: "10px" }}
        disabled
      >
        <Option value="E1">English 1</Option>
        <Option value="E2">English 2</Option>
        <Option value="F1">Finnish 1</Option>
        <Option value="F2">Finnish 2</Option>
      </Select>
    );
  }
}
const options = [
  { value: "S1", label: "aaaa" },
  { value: "S2" },
  { value: "S3" },
  { value: "S4" }
];
class EvMS_S1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: options
    };
  }

  componentDidMount() {
    fetch("/readNames")
      .then(res => res.json())
      .then(data => {
        console.log(data);
        this.setState({ options: data });
      });
  }

  handelChange = value => {
    console.log(value);
    var xhr = new XMLHttpRequest();
    var url = "/setModel/?name=" + value;

    xhr.open("GET", url, true);
    xhr.setRequestHeader("content-type", "text/event-stream;charset=UTF-8");
    xhr.send();
  };

  render() {
    return (
      <Select
        showSearch
        style={{ width: 200 }}
        placeholder="Select a model"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        size="large"
        options={this.state.options}
        style={{ display: "block", width: "400px", marginTop: "10px" }}
        onChange={this.handelChange}
      ></Select>
    );
  }
}

class EvMS_S1_d extends Component {
  render() {
    return (
      <Select
        showSearch
        placeholder="Select a model"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        size="large"
        style={{ display: "block", width: "400px", marginTop: "10px" }}
        disabled
      >
        <Option value="M1">Default</Option>
        <Option value="M2">Novice (high error rate)</Option>
        <Option value="M3">Expert (low error rate)</Option>
        <Option value="M4">Tremor</Option>
        <Option value="M5">Dyslexia</Option>
      </Select>
    );
  }
}

class TrDS_S1 extends Component {
  render() {
    return (
      <Select
        showSearch
        placeholder="Select a device"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        size="large"
        style={{ display: "block", width: "400px", marginTop: "10px" }}
        disabled={this.props.disabled}
      >
        <Option value="M1">iPhone 11 Pro</Option>
        <Option value="M2">iPhone 11</Option>
        <Option value="M3">iPhone 8</Option>
        <Option value="M4">Google Pixel 2</Option>
      </Select>
    );
  }
}

class TrKS_S1 extends Component {
  render() {
    return (
      <Select
        showSearch
        placeholder="Select language"
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        size="large"
        style={{ display: "block", width: "400px", marginTop: "10px" }}
      >
        <Option value="L1">English (QWERTY)</Option>
        <Option value="L2">Finnish (QWERTY)</Option>
      </Select>
    );
  }
}

export { EvCS_S1, EvCS_S1_d, EvMS_S1, EvMS_S1_d, TrDS_S1, TrKS_S1 };
