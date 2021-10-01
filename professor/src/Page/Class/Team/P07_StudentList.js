import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { useTeams } from "../../../components/Use";
import { useParams } from "react-router-dom";


const StudentHr = styled.hr`
width: 300px;
`

const Arrow = styled.button`
  margin-bottom: 25px;
  margin-left: 35px;
  width: 130px;
  height: 35px;
  background: #FFFFFF;
  border: 1px solid #000000;
  box-sizing: border-box;
  img{
    text-align: center;
    margin-left: 50px;
    width: 25px;
    height: 25px;
    margin-top: 4px;
  }
  cursor: pointer;
`

const StudentBox = styled.div`
  width: 180px;
  font-size: 18px;
  margin-bottom: 10px;
`;

const Box = styled.div`
  width: 400px;
  height: 626px;
  overflow: scroll;
  flex-wrap: wrap;
  padding: 30px 50px 30px;
  position: relative;
  background: #FFFFFF;
border: 2px solid #6F91B5;
box-sizing: border-box;
margin-top: 20px;
`;


function P07_StudnentList({students}){

  const { code } = useParams();

  const { noteamList, studentsNoTeam } = useTeams();

  const [stud, setStud] = useState([]);
  // const [students, setStudents] = useState(teamList.results[0]);
  
  const stud_studentCheck = (id) => {
    let checked = [0];
    checked = stud.filter((data) => data.memberId === id)
    return checked.length === 1;
  }

  const stud_checkboxChange = (e) => {
    const {name, checked} = e.target;

    if(checked) {
      setStud([
        ...stud,
        {
          teamId: students.id,
          memberId: name,
        },
      ]);
    } else {
      const newStud = stud.filter((data) => data.memberId !== name);
      setStud(newStud);
    }
  }
  
  const fetch = async() => {
    try{
      await studentsNoTeam(code);
    } catch (e) {
      alert(e);
    } 
  }

  useEffect(()=> {
    fetch();
  },[])

      return (
    <>
      {noteamList.count > 0 && noteamList.results.map((data) =>     
              { 
                return(
                    <StudentBox>
                        <FormGroup>
                          <Label check>    
                            <Input
                              type="checkbox"
                              checked={stud_studentCheck(data.id, data)}
                              name={data.id}
                              onChange={stud_checkboxChange}
                              style={{ marginRight: "5px" }}
                            />
                            {data.name}({data.grade}학년)
                            <StudentHr />
                          </Label>
                        </FormGroup>
                      </StudentBox>
                      )
              }
          )}
    </>)
}

export default P07_StudnentList;