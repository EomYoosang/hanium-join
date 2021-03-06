import React, { useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import InputWithLabel from "./InputWithLabel";
import ImageInputWithLabel from "./ImageInputWithLabel";
import {
  Form,
  FormText,
} from "reactstrap";

import { useMember } from "../../components";
import { getDataFromStorage } from "../../utils/storage";
import styled from "styled-components";
import AlertBox from "../Register/AlertBox";
import { BirthDate } from "../../utils/dateChange";
import { useLoading, CTLoading } from "../../components";

const InputBox = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
 margin-top: 30px;
width: 100%;
height: 680px;
`
const Box = styled.div`
  height: 785px;
`;

const Page = styled.div`
  color: #3d3d3d;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  margin-top: 27px;
`;

const Hr = styled.hr`
  width: 1032px;
  height: 0px;
  border: 4px solid #c4c4c4;
  margin-bottom: 38px;
`;

const SubmitButton = styled.button`
  width: 100px;
  height: 28.36px;
  left: 370px;
  top: 830px;

  background:  #6F91B5;
  color: white;
  border: #6F91B5;
`
const BackButton = styled.button`
  width: 100px;
  height: 28.36px;
  left: 370px;
  top: 830px;
  margin-right: 10px;
  margin-left: 220px;

  background:  #EF8F88;
  color: white;
  border: #EF8F88;
`

function MyModify() {

  const { loading, setLoading } = useLoading(true);
  const history = useHistory();

  const professor = getDataFromStorage();

  const [data, setData] = useState();

  const [image, setImage] = useState(null);
  const { memberInfo, getInfo, infoModifyApi } = useMember();

  const imageChange = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(() => {
    setData({
      email: memberInfo.email,
      name: memberInfo.name,
      pw: memberInfo.password,
      pwC: memberInfo.password,
      mobile: memberInfo.mobile,
      studentID: memberInfo.studentID,
      department: memberInfo.department,
      grade : memberInfo.grade,
      birthDate: memberInfo.birthDate,
      type: "S",
      errName: undefined,
      errMessage: undefined,
    });
  }, []);

  useEffect(() => {
    const fetch = async () => {
      try {
        await getInfo(professor.id);
      } catch (err) {
        console.log(err);
      }finally{
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleError = (name, value) => {
    if (name === "email") {
      // return { errName: "email", errMessage: "????????? ????????? ?????? ?????????????????????."}
    }
    if (name === "password") {
      if (value.length < 8) {
        return {
          errName: "pw",
          errMessage: "??????????????? ????????? 8?????? ???????????? ????????? ?????????.",
        };
      }
    }
    if (name === "pwC") {
      if (data.pw !== value) {
        return {
          errName: "pwC",
          errMessage: "??????????????? ???????????? ????????? ???????????? ????????????.",
        };
      }
    }

    return {
      errName: undefined,
      errMessage: undefined,
    };
  };

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(value);

    const { errName = undefined, errMessage = undefined } = handleError(
      name,
      value
    );

    setData({
      ...data,
      [name]: value,
      errName,
      errMessage,
    });
  };

  const onModifyHandler = async (e) => {
    if (!data.errName && !data.errMessage) {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("name", data.name);
      formData.append("password", data.pw);
      formData.append("mobile", data.mobile);
      formData.append("studentID", data.studentID);
      formData.append("department", data.department);
      formData.append("grade", data.grade);
      formData.append("birthDate", data.birthDate);
      formData.append("profileImg", image);

      try {
        alert("?????????????????????.");
        await infoModifyApi(professor.id, formData);
        console.log("?????????!");
        history.push(`/student/mypage/myinfo`);
      } catch (e) {
        alert(e);
      }
    }
  };
  if (!data) return "?????????";
  console.log(image);
  return loading ? (
    <CTLoading />
  ) : (
    <Box>
      <Page>?????? ?????? ??????</Page>
      <Hr />
    <InputBox>
      <Form>
        <InputWithLabel
              label="?????????"
              type="email"
              name="email"
              id="exampleEmail"
              placeholder="???????????? ???????????????."
              onChange={handleChange}
              value={data.email}
            />
        <br />
        {data.errName && data.errMessage && (
        <AlertBox available={false}>{data.errMessage}</AlertBox>
      )}
        <InputWithLabel
              label="????????????"
              type="password"
              name="pw"
              value={data.pw}
              onChange={handleChange}
            />
        <br />
        <InputWithLabel
              label="???????????? ??????"
              type="password"
              name="pwC"
              id="examplePassword"
              onChange={handleChange}
              value={data.pwC}
            />
        <br />
        <InputWithLabel
              label="??????"
              type="name"
              name="name"
              id="exampleName"
              placeholder={memberInfo.name}
              onChange={handleChange}
              value={data.name}
            />
        <br />
        <InputWithLabel
              label="??????"
              type="department"
              name="department"
              placeholder="????????? ???????????????"
              onChange={handleChange}
              value={data.department}
            />
        <br />
        <InputWithLabel
              label="??????"
              type="studentID"
              name="studentID"
              placeholder="????????? ???????????????"
              onChange={handleChange}
              value={data.studentID}
            />
        <br />
        <InputWithLabel
              label="??????"
              type="grade"
              name="grade"
              placeholder="????????? ???????????????"
              onChange={handleChange}
              value={data.grade}
            />
        <br />
      <InputWithLabel
        label="????????????"
        name="birthDate"
        placeholder="????????????"
        type="date"
        value={BirthDate(data.birthDate)}
        onChange={handleChange}
      />
      <br />
      <InputWithLabel
        label="????????????"
        name="mobile"
        placeholder="????????????"
        type="text"
        value={data.mobile}
        onChange={handleChange}
      />
      <br />
      <ImageInputWithLabel
        label="????????? ??????"
        type="file" 
        name="profileImg" 
        onChange={imageChange}/>
      <br />
      <FormText color="muted">
        ???????????? ????????? ????????? ???????????? ????????????.<br />
        "????????????" ????????? ???????????????.
      </FormText>

      <br />

        <Link
          to="/student/mypage/myinfo"
          style={{ textDecoration: "none", color: "black" }}
        >
          <BackButton>????????????</BackButton>
        </Link> 

        <SubmitButton onClick={onModifyHandler}>
          ???????????? 
        </SubmitButton>
         
    </Form>
    </InputBox>
    </Box>
  );
}

export default MyModify;