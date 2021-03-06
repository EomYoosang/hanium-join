import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import InputWithLabel from "./InputWithLabel";
import FindButton from "./FindButton";
import Modal from "./Modal";
import Header from "../../Common/Header";
import Footer from "../../Common/Footer";

const Label = styled.div`
font-family: Roboto;
font-style: normal;
font-weight: 500;
font-size: 25px;
line-height: 29px;
margin-left: 144px;
margin-top: 60px;
color: #686868;
margin-bottom: 20px;
`;
const Box = styled.div`
  display: block;
  width: 730px;
  margin: 0 auto;
  margin-bottom: 100px;
  background-color: white;
  border: 1px solid #EF8F88;
  height: 502px;

filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.25));
`;
const TextBox = styled.div`
  width: 730px;
  height: 117px;
  background-color: #EF8F88;
  font-family: Roboto;
  font-style: normal;
  font-weight: bold;
  font-size: 40px;
  line-height: 47px;
  text-align: center;
  margin: 0 auto;
  padding-top: 39px;
  margin-top: 85px;

  color: #FFFFFF;
  filter: drop-shadow(4px 4px 4px rgba(0, 0, 0, 0.25));
`

const SendBox = styled.button`
  padding: 6px 12px;
  margin-top: 5px;
  color: #fff;
  background-color: #6c757d;
  border-radius: 5px;
  font-size: 15px;
`;

const EmailText = styled.div`
  background: #8f8f8f;
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  padding: 10px 30px;
  font-size: 20px;
  border-radius: .3rem;
  transform: translate(-50%, -50%);
`;

const FindIdPw = () => {
  const [data, setData] = useState({
    findEmail: false,
    findPw: false,
    sended: false,
    emailRes: "",
    name: "",
    mobile: "",
    email: "",
    pw: "",
    verifyCode: "",
  });

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const openFindEmail = () => {
    setData({
      ...data,
      findEmail: true,
    });
  };

  const closeFindEmail = () => {
    setData({
      ...data,
      findEmail: false,
      sended: false,
    });
  };

  const sendSmsHandler = async () => {
    console.log("????????????");
    const body = {
      name: data.name,
      mobile: data.mobile,
    };
    const res = await axios.post("/api/v1//verify/sms", body);

    if (res.data.success) {
      setData({
        ...data,
        sended: true,
      });
    }
  };

  const submitHandler = async () => {
    const body = {
      name: data.name,
      mobile: data.mobile,
      verifyCode: data.verifyCode,
    };
    const res = await axios.post("/api/v1/verify/sms/verify", body);

    console.log(res);

    if (res.data.success) {
      setData({
        ...data,
        emailRes: res.data.email,
      });
    } else {
      console.log("????????? ????????????.");
      alert("????????? ????????????.");
    }
  };

  useEffect(() => {
    if (data.mobile.length === 10) {
      setData({
        ...data,
        mobile: data.mobile.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'),
      });
    }
    if (data.mobile.length === 13) {
      setData({
        ...data,
        mobile: data.mobile.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'),
      });
    }
  }, [data.mobile]);

  return (
    <>
    <Header />
      <TextBox>?????????/???????????? ??????</TextBox>
    <Box>
      <Label>????????? ??????</Label>
      <FindButton onClick={openFindEmail}>????????? ??????</FindButton>
      <br></br>
      <Label>???????????? ??????</Label>
      <InputWithLabel
        name="email"
        placeholder="?????????(?????????)??? ???????????????"
        type="text"
        value={data.email}
        onChange={changeHandler}
      />
      <FindButton>???????????? ??????</FindButton>



    </Box>
      <Modal open={ data.findEmail } close={ closeFindEmail } submit={ submitHandler } header="????????? ??????">
        {data.emailRes ? <EmailText>???????????? { data.emailRes }?????????</EmailText> : null }
        <Label>??????</Label>
        <InputWithLabel
          name="name"
          placeholder="??????"
          type="text"
          value={data.name}
          onChange={changeHandler}
        />
        <Label>????????????</Label>
        <InputWithLabel
          name="mobile"
          placeholder="????????? ??????"
          type="text"
          value={data.mobile}
          onChange={changeHandler}
        />
        <SendBox onClick={sendSmsHandler}>{!data.sended? "??????" : "?????????"}</SendBox>
        <Label>????????????</Label>
        <InputWithLabel
          name="verifyCode"
          placeholder="????????????"
          type="text"
          value={data.verifyCode}
          onChange={changeHandler}
        />
      </Modal>
    <Footer />
    </>
  );
}

export default FindIdPw;
