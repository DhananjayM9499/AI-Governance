import React, { useState } from "react";
import { Input, Checkbox, Button, Badge } from "antd";
import styled from "styled-components";

const CheckboxGroup = styled(Checkbox.Group)`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ActionButton = styled(Button)`
  color: #1890ff;
`;

const ResourceDropdown = ({ resourceList, onSubmit }) => {
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [dropdownStatus, setDropdownStatus] = useState(false);

  const onChange = (checkedList) => {
    console.log("checkedList", checkedList);
    setCheckedList(checkedList);
    setIndeterminate(
      !!checkedList.length && checkedList.length < resourceList.length
    );
    setCheckAll(checkedList.length === resourceList.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? resourceList : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const onShowDropdown = () => {
    setDropdownStatus(!dropdownStatus);
  };

  return (
    <div>
      <Badge count={checkedList.length}>
        <Button onClick={() => onShowDropdown()}>Instance id</Button>
      </Badge>
      <div
        style={{
          width: "200px",
          height: "auto",
          maxHeight: "350px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          position: "absolute",
          display: dropdownStatus ? "inherit" : "none",
        }}
      >
        <Input.Search
          size="default"
          placeholder="Instance Id"
          onSearch={(value) => console.log(value)}
          style={{ width: "100%" }}
        />
        <div style={{ overflow: "auto", height: "auto", maxHeight: "300px" }}>
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            Select All
          </Checkbox>
          <CheckboxGroup
            options={resourceList}
            value={checkedList}
            onChange={onChange}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-end",
            justifyContent: "space-around",
            width: "50%",
          }}
        >
          <ActionButton type="link" onClick={() => onSubmit(checkedList)}>
            Ok
          </ActionButton>
          <ActionButton type="link" onClick={() => setDropdownStatus(false)}>
            Cancel
          </ActionButton>
        </div>
      </div>
    </div>
  );
};

export default ResourceDropdown;
