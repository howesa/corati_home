import React from "react";
import Aalto from "./img/Aalto.png";
import UIG from "./img/uig.png";
import Intro from "./img/Intro.png";
import { Component } from "react";
import { Button } from "antd";
import { Layout, Menu, Breadcrumb } from "antd";
import { Divider } from "antd";

import "./css/TpAgent.less";
const { Header, Content, Footer } = Layout;

// const LdIntro = () => (
//   <div>
//     <intro>
//       <div className="intro-img">
//         <img src={Intro} alt="" />
//       </div>
//       <div className="intro-content">
//         <h1>Optimal Adaption Typing Model</h1>
//         <p>
//           The model simulates one-finger touchscreen typing behaviour as optimal
//           adaptation.
//           <br />
//           <br />
//           Please choose either of the following ways to view the model
//           performance.
//         </p>
//       </div>
//     </intro>
//     <div className="start">
//       <div style={{}}>
//         {/* <label>
//                   <i>Get started by:</i>
//                 </label> */}
//       </div>
//       <div className="start-content">
//         <div className="start-btn">
//           <Button className="button" type="primary" size="large">
//             Evaluating
//           </Button>
//         </div>
//         <div className="start-intro">
//           <p>
//             Evaluating the pre-trained model with built-in or customized corpus.
//             <br />
//             The generation time for the result is quite quick.
//           </p>
//         </div>
//       </div>
//       <Divider> Or </Divider>
//       <div className="start-content">
//         <div className="start-btn">
//           <Button className="button" type="primary" size="large">
//             Training
//           </Button>
//         </div>
//         <div className="start-intro">
//           <p>
//             Training the model with parameters and keyboard configuration.
//             <br />
//             Noted that the training process can take up to 2 hours.
//           </p>
//         </div>
//       </div>
//     </div>
//   </div>
// );

class TpAgent extends Component {
  state = {};
  render() {
    return (
      <Layout className="layout">
        <Header style={{ height: "130px", backgroundColor: "#fff" }}>
          <nav>
            <div className="logo">
              <a href="https://aalto.fi/">
                <img src={Aalto} style={{ marginTop: "20px" }} />
              </a>
              <a href="https://userinterfaces.aalto.fi/">
                <img src={UIG} style={{ marginTop: "20px" }} />
              </a>
            </div>
            <ul className="nav-item">
              {/* Todo: Update the link for navigator */}
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">Publication</a>
              </li>
              <li>
                <a href="#">Project</a>
              </li>
              <li>
                <a href="#">GitHub</a>
              </li>
            </ul>
          </nav>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content">
            {this.props.children}
            {/* <LdIntro /> */}
          </div>
        </Content>
      </Layout>
    );
  }
}

export default TpAgent;
