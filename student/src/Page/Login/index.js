import React, { useState, useCallback } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import InputWithLabel from "./InputWithLabel";
import LoginButton from "./LoginButton";

const Box = styled.div`
  display: block;
  width: 500px;
  margin: 0 auto;
  margin-top: 50px;
  margin-bottom: 100px;
`;
const Title = styled.div`
  text-align: center;
  width: 500px;
  display: block;
  font-size: 30px;
  margin-bottom: 50px;
`;

function Login() {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const idChangeHandler = (e) => {
    setId(e.currentTarget.value);
  };
  const pwChangeHandler = (e) => {
    setPw(e.currentTarget.value);
  };

  const history = useHistory();

  const submitHandler = () => {
    history.push("/class");
  };
  return (
    <Box>
      <Title>로그인</Title>
      <InputWithLabel
        label="아이디"
        name="id"
        placeholder="아이디"
        value={id}
        onChange={idChangeHandler}
      />
      <InputWithLabel
        label="비밀번호"
        name="password"
        placeholder="비밀번호"
        type="password"
        value={pw}
        onChange={pwChangeHandler}
      />
      <LoginButton onClick={submitHandler}>로그인</LoginButton>
      <Link
        to="/findIdPassword"
        style={{ textDecoration: "none", color: "black" }}
      >
        <span>아이디 비밀번호 찾기</span>
      </Link>
      <br></br>
      <Link
        to="/register/box"
        style={{ textDecoration: "none", color: "black" }}
      >
        <span>회원가입</span>
      </Link>
    </Box>
  );
}

export default Login;
