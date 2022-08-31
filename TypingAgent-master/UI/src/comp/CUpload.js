import React from "react";
import { Component } from "react";
import { Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import "../css/comp/CUpload.less";

const props = {
  name: "file",
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  headers: {
    authorization: "authorization-text",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class CUpload extends Component {
  render() {
    return (
      <Upload className="cupload" {...props}>
        <Button className="cbutton" style={{ display: "block" }}>
          <UploadOutlined /> Click to Upload
        </Button>
      </Upload>
    );
  }
}

class CUpload_d extends Component {
  render() {
    return (
      <Upload className="cupload" {...props}>
        <Button className="cbutton" disabled style={{ display: "block" }}>
          <UploadOutlined /> Click to Upload
        </Button>
      </Upload>
    );
  }
}

export { CUpload, CUpload_d };
