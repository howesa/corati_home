import React, { useState } from "react";
import styled from "styled-components";
import { Collapse as AntCollapse } from "antd";
import "../css/Test.less";



const StyledCollapse = styled(AntCollapse.Panel)`
  .ant-collapse-content {
    background: #fff;
  }
`;

const CustomCollapse = (props) => {
  const [disabled, setDisabled] = useState(true);
  return (
    <AntCollapse
      expandIconPosition={"left"}
      onChange={() => setDisabled((prev) => !prev)}
    >
      <StyledCollapse
        {...props}
        header={props.header}
        key="1"
        // showArrow={false}
        bordered={false}
        extra={
          <span>
            <span
              style={{ color: disabled ? "#0076de" : "#7553a0;", margin: "auto 10px" }}
            >
              {disabled ? "SHOW" : "HIDE"}
            </span>
          </span>
        }
        style={{backgroundColor: "#0076de"}}
      >
        {props.children}
      </StyledCollapse>
    </AntCollapse>
  );
};

export { CustomCollapse };
