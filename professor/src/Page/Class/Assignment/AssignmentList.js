import React, { useEffect } from "react";
import { Button, Table } from "reactstrap";
import { Link, useHistory } from "react-router-dom";
import { useAssignments } from "../../../components/Use";
import { DateChange } from "../../../utils/dateChange";
import styled from "styled-components";
import { getDataFromStorage, saveDataToStorage } from "../../../utils/storage";

const Box = styled.div`
  width: 80%;
`;

const Assignment = styled.div`
  thead th {
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 17px;
    line-height: 20px;
    padding-bottom: 10px;
    text-align: center;
    background-color: #426589;
  }

  tbody th {
    font-family: Roboto;
    font-style: normal;
    font-weight: bold;
    font-size: 17px;
    line-height: 20px;
    padding-bottom: 15px;
    padding-top: 15px;
    text-align: center;
  }

  td {
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 17px;
    line-height: 20px;
    padding-top: 15px;
    color: #000000;
    text-align: center;
  }
`;

const assignmentList = () => {
  const history = useHistory();
  const { assignmentsList, listAllByClassCode } = useAssignments();

  useEffect(() => {
    const fetch = async () => {
      try {
        await listAllByClassCode();
      } catch (e) {
        alert(e);
      }
    };
    fetch();
  }, []);
  console.log(Math.random().toString(36).substr(2, 11).toUpperCase());

  const handler = async (id) => {
    try {
      history.push(`/professor/class/assignment/${id}`);
    } catch (e) {
      alert(e);
    }
  };

  const count = 1;

  return (
    <Box>
      <div className="d-flex justify-content-between pt-3 pb-2 mb-3">
        <p>등록된 과제 확인</p>
        <Link to="/professor/class/addAssignment">
          <Button size="sm">추가</Button>
        </Link>
      </div>
      <Assignment>
        <Table size="sm">
          <thead>
            <tr style={{ color: "white" }}>
              <th>번호</th>
              <th>과제명</th>
              <th>진행</th>
              <th>배점</th>
              <th>마감일</th>
            </tr>
          </thead>
          <tbody>
            {assignmentsList.results.map((assignment) => {
              return (
                <tr>
                  <th>{count}</th>
                  <td onClick={() => handler(assignment.id)}>
                    {assignment.name}
                  </td>
                  <td>{assignment.progress === 1 ? "진행 중" : "마감"}</td>
                  <td>{assignment.point}</td>
                  <td>{DateChange(assignment.endDate)}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Assignment>
    </Box>
  );
};

export default assignmentList;
