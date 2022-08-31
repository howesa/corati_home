import React from "react";
import { Component } from "react";
import { Card, Button } from "antd";

import "../css/comp/CCard.less";

class EvCard1 extends Component {
  constructor() {
    super();

    // this.mesRef = React.createRef();
    // this.refs = React.createRef();
  }

  componentDidUpdate() {
    this.newData.scrollIntoView({ behavior: "smooth" });
  }

  render() {
    return (
      <Card
        style={{
          width: "85%",
          height: 450,
          fontSize: 18,
          overflow: "auto",
          // display: "flex",
          // flexDirection: "column-reverse",
        }}
      >
        <p>The model training message will be presented here......</p>
        {this.props.content}
        <div ref={(ref) => (this.newData = ref)} />
        {/* <div ref={(ref) => (this.newData = ref)}>{this.props.content}</div> */}
      </Card>
    );
  }
}

class EvCard2 extends Component {
  render() {
    var title = (
      <ul>
        <li>{this.props.title}</li>
      </ul>
    );
    return (
      <Card
        className="evcard2"
        title={title}
        headStyle={{ height: 63, fontSize: 20 }}
        style={{ margin: "30px 30px", fontSize: 18 }}
      >
        {this.props.children}
      </Card>
    );
  }
}

// with actions
class EvCard3 extends Component {
  render() {
    var title = (
      <ul>
        <li>{this.props.title}</li>
      </ul>
    );
    return (
      <Card
        className="evcard3"
        title={this.props.title}
        headStyle={{ height: 63, fontSize: 20 }}
        style={{ margin: "30px 30px", fontSize: 18 }}
        actions={[
          <Button
            className="button"
            type="primary"
            ghost
            onClick={this.props.handleFilter}
          >
            Fliter
          </Button>,
          <Button className="button">Clear</Button>,
        ]}
      >
        {this.props.children}
      </Card>
    );
  }
}

// without action
class EvCard4 extends Component {
  render() {
    var title = (
      <ul>
        <li>{this.props.title}</li>
      </ul>
    );
    return (
      <Card
        className="evcard4"
        title={this.props.title}
        headStyle={{ height: 63, fontSize: 20 }}
        style={{ margin: "30px 30px", fontSize: 18 }}
      >
        {this.props.children}
      </Card>
    );
  }
}

// without action, no margin
class EvCard5 extends Component {
  render() {
    var title = (
      <ul>
        <li>{this.props.title}</li>
      </ul>
    );
    return (
      <Card
        className="evcard4"
        title={this.props.title}
        headStyle={{ height: 63, fontSize: 20 }}
        style={{ fontSize: 18 }}
      >
        {this.props.children}
      </Card>
    );
  }
}

export { EvCard1, EvCard2, EvCard3, EvCard4, EvCard5 };
