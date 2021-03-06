import React, { useEffect, useState } from "react";
import { useHistory, useParams, Link } from "react-router-dom";
import InputWithLabel from "./InputWithLabel";
import ImageInputWithLabel from "./ImageInputWithLabel";
import { Form, FormGroup, FormText } from "reactstrap";
import { useLoading, CTLoading } from "../../components";

import { useMember } from "../../components";
import { getDataFromStorage } from "../../utils/storage";
import styled from "styled-components";
import AlertBox from "../Register/AlertBox";
import { BirthDate } from "../../utils/dateChange";

const InputBox = styled.span`
  overflow: scroll;
  height: 730px;
`;
const Box = styled.div`
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

  background: #6f91b5;
  color: white;
  border: #6f91b5;
`;
const BackButton = styled.button`
  width: 100px;
  height: 28.36px;
  left: 370px;
  top: 830px;
  margin-right: 10px;
  margin-left: 220px;

  background: #ef8f88;
  color: white;
  border: #ef8f88;
`;

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
      professorID: memberInfo.studentID,
      department: memberInfo.department,
      birthDate: memberInfo.birthDate,
      type: "P",
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
      } finally{
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
      formData.append("professorID", data.professorID);
      formData.append("department", data.department);
      formData.append("birthDate", data.birthDate);
      formData.append("profileImg", image);

      try {
        alert("?????????????????????.");
        infoModifyApi(professor.id, formData);
        history.push("/professor/mypage/myinfo");
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
      {data.errName && data.errMessage && (
        <AlertBox available={false}>{data.errMessage}</AlertBox>
      )}
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
            type="professorID"
            name="professorID"
            placeholder="????????? ???????????????"
            onChange={handleChange}
            value={data.professorID}
          />
          <br />
          <FormGroup row>
            <InputWithLabel
              label="????????????"
              name="birthDate"
              placeholder="????????????"
              type="date"
              value={BirthDate(data.birthDate)}
              onChange={handleChange}
            />
          </FormGroup>
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
            onChange={imageChange}
          />
          <br />
          <FormText color="muted">
            ???????????? ????????? ????????? ???????????? ????????????.
            <br />
            "????????????" ????????? ???????????????.
          </FormText>

          <br />

          <Link
            to="/professor/mypage/myinfo"
            style={{ textDecoration: "none", color: "black" }}
          >
            <BackButton>????????????</BackButton>
          </Link>

          <SubmitButton onClick={onModifyHandler}>????????????</SubmitButton>
        </Form>
      </InputBox>
    </Box>
  );
}

export default MyModify;
