import Boom from "@hapi/boom";
import { v4 as UUID } from "uuid";
import * as CommonMd from "../middlewares";
import { generateToken } from "../../middlewares/jwtMd";

export const getDataFromBodyMd = async (ctx, next) => {
  const { email, password, name, type, mobile, birthDate } = ctx.request.body;

  ctx.state.reqBody = {
    email,
    password,
    name,
    type,
    mobile,
    birthDate,
  };

  await next();
};

export const validateDataMd = async (ctx, next) => {
  const { email, password, name, type, mobile, birthDate } = ctx.state.reqBody;

  if (!email || !password || !type || !name || !mobile || !birthDate) {
    throw Boom.badRequest("field is not fulfiled");
  }

  await next();
};

export const validateUpdateDataMd = async (ctx, next) => {
  // const {
  //   // eslint-disable-next-line no-unused-vars
  //   name,
  //   password,
  //   mobile,
  // } = ctx.request.body;

  // // if (!name || !password || !mobile) {
  // //   throw Boom.badRequest("field is not fulfiled");
  // // }

  await next();
};

export const isDuplicatedEmailMd = async (ctx, next) => {
  const { email } = ctx.state.reqBody;
  const { files } = ctx.request;
  const { conn } = ctx.state;

  console.log(files);

  const rows = await conn.query("SELECT * FROM tb_member WHERE email = ?", [
    email,
  ]);

  if (rows.length > 0) {
    throw Boom.badRequest("duplicated email");
  }

  await next();
};

export const saveMemberMd = async (ctx, next) => {
  const { email, password, name, type, mobile, birthDate } = ctx.state.reqBody;
  const { conn } = ctx.state;

  // eslint-disable-next-line max-len
  await conn.query(
    "INSERT INTO tb_member(id, email, name, password, type, mobile, birthDate) \
    VALUES (?, ?, ?, password(?), ?, ?, ?)",
    [UUID(), email, name, password, type, mobile, birthDate]
  );

  await next();
};

export const queryMemberMdByEmail = async (ctx, next) => {
  const { email } = ctx.state.reqBody;
  const { conn } = ctx.state;

  const rows = await conn.query(
    "SELECT id, email, name, type, mobile, createdAt FROM tb_member WHERE email = ?",
    [email]
  );

  ctx.state.body = rows[0];

  await next();
};

export const queryMemberMdById = async (ctx, next) => {
  const { id } = ctx.params;
  const { conn } = ctx.state;

  const sql =
    "SELECT id, email, name, type, mobile, createdAt, birthdate, department, grade, studentID \
    FROM tb_member WHERE id = ?";
  const rows = await conn.query(sql, [id]);

  ctx.state.body = {
    ...rows[0],
  };

  await next();
};

export const removeMemberMd = async (ctx, next) => {
  const { conn } = ctx.state;
  const { id } = ctx.params;

  await conn.query("DELETE FROM tb_member WHERE id = ?", [id]);
  await next();
};

export const readMemberIdMd = async (ctx, next) => {
  const { id } = ctx.params;
  const { conn } = ctx.state;

  const rows = await conn.query(
    "SELECT id, email, name, type, mobile, createdAt, studentID, grade, department \
    FROM tb_member WHERE id = ?",
    [id]
  );

  ctx.state.body = {
    ...rows[0],
  };

  await next();
};

export const readMemberEmailMd = async (ctx, next) => {
  const { email } = ctx.params;
  const { conn } = ctx.state;

  const rows = await conn.query(
    "SELECT id, email, name, type, mobile, createdAt FROM tb_member WHERE id = ?",
    [email]
  );

  ctx.state.body = {
    ...rows[0],
  };

  await next();
};

export const readStudentLoginMd = async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const { conn } = ctx.state;

  const rows = await conn.query(
    "SELECT id, name, email, mobile, profileImg, birthDate, department,grade, studentID \
    FROM tb_member WHERE email = ? AND password = password(?)",
    [email, password]
  );

  if (rows.length === 0) {
    throw Boom.badRequest("wrong id password");
  }

  ctx.state.body = rows[0];

  await next();
};

export const readProfessorLoginMd = async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const { conn } = ctx.state;

  console.log(email);
  console.log(password);

  const rows = await conn.query(
    "SELECT id, name, email, mobile, profileImg, birthDate, department \
    FROM tb_member WHERE email = ? AND password = password(?)",
    [email, password]
  );

  if (rows.length === 0) {
    throw Boom.badRequest("wrong id password");
  }

  ctx.state.body = rows[0];

  await next();
};

export const jwtGenerateMd = async (ctx, next) => {
  const { id, name } = ctx.state.body;
  const payload = { id, name };
  let token = null;

  try {
    token = await generateToken(payload);
  } catch (e) {
    ctx.throw(500, e);
  }

  ctx.cookies.set("access_token", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });

  await next();
};

export const updateMemberMd = async (ctx, next) => {
  const { id } = ctx.params;
  const { conn } = ctx.state;

  const { name, password, grade, department, studentID, mobile } =
    ctx.request.body;

  const { profileImg } = ctx.request.files;

  const sql =
    // eslint-disable-next-line max-len
    "UPDATE tb_member SET name = ?, password = password(?), grade = ?, department = ?, studentID = ?, profileImg = ?, mobile = ?  WHERE id = ?";
  await conn.query(sql, [
    name,
    password,
    grade,
    department,
    studentID,
    profileImg.name,
    mobile,
    id,
  ]);

  await next();
};

export const updateProfessorMd = async (ctx, next) => {
  const { id } = ctx.params;
  const { conn } = ctx.state;

  const { name, password, department, professorID, mobile } = ctx.request.body;

  const profileImg =
    ctx.request.files === undefined ? null : ctx.request.files.profileImg;

  const sql =
    // eslint-disable-next-line max-len
    "UPDATE tb_member SET name = ?, password = password(?), department = ?, studentID = ?, profileImg = ?, mobile = ?  WHERE id = ?";
  await conn.query(sql, [
    name,
    password,
    department,
    professorID,
    profileImg.name,
    mobile,
    id,
  ]);

  await next();
};
export const readMemberAllMd = async (ctx, next) => {
  const { skip, limit } = ctx.state.query;
  const { conn } = ctx.state;

  const rows = await conn.query(
    "SELECT id, email, name, type, mobile, createdAt FROM tb_member LIMIT ?, ?",
    [skip, limit]
  );

  ctx.state.body = {
    results: rows,
  };

  await next();
};

export const readMemberAllCountMd = async (ctx, next) => {
  const { conn } = ctx.state;

  const rows = await conn.query("SELECT COUNT(*) AS count  FROM tb_member");

  ctx.state.body = {
    ...ctx.state.body,
    total: rows[0].count,
  };

  await next();
};

export const checkMd = async (ctx, next) => {
  const { user } = ctx.state;

  if (user === undefined) {
    ctx.status = 403;
    throw Boom.badRequest("forbidden");
  }

  ctx.state.body = user;

  await next();
};

export const logoutMd = async (ctx, next) => {
  ctx.cookies.set("access_token", null, {
    maxAge: 0,
    httpOnly: true,
  });

  await next();
};

// eslint-disable-next-line max-len
export const create = [
  CommonMd.createConnectionMd,
  getDataFromBodyMd,
  validateDataMd,
  isDuplicatedEmailMd,
  saveMemberMd,
  queryMemberMdByEmail,
  CommonMd.responseMd,
];

// skip, limit (skip: 시작위치, limit: 가져올 데이터 수)
// ex) skip=0, limit=10 이면 0번째부터 10개를 가져와라
// skip=10, limit=10 10번째부터 10개를 가져와라
export const readAll = [
  CommonMd.createConnectionMd,
  CommonMd.validataListParamMd,
  readMemberAllMd,
  readMemberAllCountMd,
  CommonMd.responseMd,
];

export const readId = [
  CommonMd.createConnectionMd,
  CommonMd.validateIdParamMd,
  readMemberIdMd,
  CommonMd.responseMd,
];

export const readEmail = [
  CommonMd.createConnectionMd,
  CommonMd.validateIdParamMd,
  readMemberEmailMd,
  CommonMd.responseMd,
];

export const update = [
  CommonMd.createConnectionMd,
  CommonMd.validateIdParamMd,
  validateUpdateDataMd,
  updateMemberMd,
  queryMemberMdById,
  CommonMd.responseMd,
];

export const remove = [
  CommonMd.createConnectionMd,
  CommonMd.validateIdParamMd,
  removeMemberMd,
  CommonMd.responseMd,
];

export const updateProfessor = [
  CommonMd.createConnectionMd,
  CommonMd.validateIdParamMd,
  validateUpdateDataMd,
  updateProfessorMd,
  queryMemberMdById,
  CommonMd.responseMd,
];

export const studentLogin = [
  CommonMd.createConnectionMd,
  readStudentLoginMd,
  jwtGenerateMd,
  CommonMd.responseMd,
];

export const professorLogin = [
  CommonMd.createConnectionMd,
  readProfessorLoginMd,
  jwtGenerateMd,
  CommonMd.responseMd,
];

export const logout = [
  CommonMd.createConnectionMd,
  logoutMd,
  CommonMd.responseMd,
];

export const check = [
  CommonMd.createConnectionMd,
  checkMd,
  CommonMd.responseMd,
];
