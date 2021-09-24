import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Form, FormGroup, Label, Input, Col } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import { useAssignments, useTeams } from "../../../components/Use";
import { DateChange3 } from "../../../utils/dateChange";
import styled from "styled-components";

const Box = styled.div`
  width: 90%;
  height: 785px;
  overflow-y: auto;
  overflow-x: hidden;
  button {
    font-family: Roboto;
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    text-align: center;
    background-color: #ffffff;
    border-color: #426589;
    color: #426589;
    width: 60px;
    height: 30px;
  }
`;

const Text = styled.div`
font-family: Roboto;
font-style: normal;
font-weight: 400;
  color: #EF8F88;
  margin-top : 10px;
  margin-left : 160px;
`

const AssignmentModify = ({ match }) => {
  const assignmentId = match.params.id;

  const { code } = useParams();

  const { assignmentOne, getAssignment, updateAssignmentsApi } =
    useAssignments();
  const { teamList, listAllTeams } = useTeams();

  const [image, setImage] = useState(null);
  const [teams, setTeams] = useState(
    assignmentOne.team ? assignmentOne.team : []
  );

  const imageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const checkboxChange = (e) => {
    const { name, checked } = e.target;

    if (checked) {
      setTeams([
        ...teams,
        {
          team_id: name,
        },
      ]);
    } else {
      const newTeams = teams.filter((data) => data.team_id !== name);
      setTeams(newTeams);
    }
  };

  const teamCheck = (id) => {
    let checked = [];
    checked = teams.filter((data) => data.team_id === id);

    return checked.length === 1;
  };

  const [data, setData] = useState();

  const history = useHistory();

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (assignmentOne.team) {
      assignmentOne.team.map((item) => {
        setTeams({
          [item.team_id]: true,
        });
      });
    }
  }, [assignmentOne]);

  useEffect(() => {
    const fetch = async () => {
      try {
        await listAllTeams(code);
      } catch (e) {
        alert(e);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        await getAssignment(assignmentId);
      } catch (e) {
        alert(e);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    setData({
      ...assignmentOne,
      startDate: DateChange3(assignmentOne.startDate),
      endDate: DateChange3(assignmentOne.endDate),
    });
    setTeams(assignmentOne.team);
  }, [assignmentOne]);

  const modifyHandler = async () => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("point", data.point);
      formData.append("startDate", data.startDate);
      formData.append("endDate", data.endDate);
      formData.append("content", data.content);
      formData.append("progress", 1);
      formData.append("classCode", code);
      formData.append("teams", []);
      formData.append("image", image);

      await updateAssignmentsApi(assignmentId, formData);
      history.push(`/professor/class/${code}/assignment/${assignmentId}`);
    } catch (e) {
      alert(e);
    }
  };

  if (!data) {
    return "로딩중";
  }

  return (
    <Box>
      <Form>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            size="sm"
            style={{ marginTop: "20px" }}
            onClick={modifyHandler}
          >
            완료
          </button>
        </div>
        <FormGroup
          row
          style={{
            marginLeft: 3,
            padding: "15px 0px",
            borderBottom: "1px solid #C4C4C4",
          }}
        >
          <Label
            for="name"
            sm={1}
            style={{ fontWeight: "bold", paddingLeft: 0 }}
          >
            과제명
          </Label>
          <Col sm={6}>
            <Input
              type="name"
              name="name"
              id="assignmentName"
              value={data.name}
              onChange={handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup
          row
          style={{
            marginLeft: 3,
            padding: "15px 0px",
            borderBottom: "1px solid #C4C4C4",
          }}
        >
          <Label
            for="point"
            sm={1}
            style={{ fontWeight: "bold", paddingLeft: 0 }}
          >
            배점
          </Label>
          <Col sm={4}>
            <Input
              type="point"
              name="point"
              id="point"
              value={data.point}
              onChange={handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup
          row
          style={{
            marginLeft: 3,
            padding: "15px 0px",
            borderBottom: "1px solid #C4C4C4",
          }}
        >
          <Label
            for="point"
            sm={1}
            style={{ fontWeight: "bold", paddingLeft: 0 }}
          >
            공개일
          </Label>
          <Col sm={4}>
            <Input
              type="datetime-local"
              name="startDate"
              id="startDate"
              value={DateChange3(data.startDate)}
              onChange={handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup
          row
          style={{
            marginLeft: 3,
            padding: "15px 0px",
            borderBottom: "1px solid #C4C4C4",
          }}
        >
          <Label
            for="point"
            sm={1}
            style={{ fontWeight: "bold", paddingLeft: 0 }}
          >
            마감일
          </Label>
          <Col sm={4}>
            <Input
              type="datetime-local"
              name="endDate"
              id="endDate"
              value={DateChange3(data.endDate)}
              onChange={handleChange}
            />
          </Col>
        </FormGroup>
        <FormGroup
          row
          style={{
            marginLeft: 3,
            padding: "15px 0px",
            borderBottom: "1px solid #C4C4C4",
            alignItems: "center",
          }}
        >
          <Label
            for="point"
            sm={1}
            style={{ fontWeight: "bold", paddingLeft: 0 }}
          >
            팀지정
          </Label>
          {teamList.results.map((team) => (
            <Label check sm={1}>
              <Col>
                <Input
                  type="checkbox"
                  checked={teamCheck(team.id)}
                  name={team.id}
                  onChange={checkboxChange}
                  style={{ marginRight: "5px" }}
                />
                {team.name}
              </Col>
            </Label>
          ))}
        </FormGroup>
        <FormGroup style={{ marginTop: "30px" }}>
          <Input
            type="textarea"
            name="content"
            id="assignmentText"
            value={data.content}
            onChange={handleChange}
            style={{ height: "300px" }}
          />
        </FormGroup>
        <FormGroup style={{ marginTop: "20px" }}>
          <Label
            for="imageFile"
            sm={2}
            style={{ fontWeight: "bold", paddingLeft: 0 }}
          >
            첨부 파일
          </Label>
          <Input
            type="file"
            name="imagefile"
            id="imageFile"
            onChange={imageChange}
          />
        </FormGroup>
        <FormGroup style={{ marginTop: "10px" }}>
          <Label for="solutionFile" sm={2} style={{ fontWeight: "bold" }}>
            해답 파일
          </Label>
          <Input type="file" name="solutionFile" id="solutionFile" />
        </FormGroup>
        <Text>
          * 해답 파일은 학생들에게 공개되지 않으며 자동 채점을 위한 비교 파일입니다.
        </Text>
        
      </Form>
    </Box>
  );
};

export default AssignmentModify;
