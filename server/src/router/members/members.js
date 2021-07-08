import Boom from "@hapi/boom";

export const responseMiddleware = async (ctx) => {
  const { body } = ctx.state;

  ctx.state = 200;
  ctx.body = body;
};

export const getDataFromBodyMd = async (ctx, next) => {
  const { email, password, name, type, mobile } = ctx.request.body;

  console.log(ctx.request.body);

  ctx.state.reqBody = {
    email,
    password,
    name,
    type,
    mobile,
  };

  await next();
};

export const validateDataMd = async (ctx, next) => {
  const { email, password, name, type } = ctx.state.reqBody;

  if (!email || !password || !type || !name) {
    throw Boom.badRequest();
  }

  await next();
};

export const isDuplicatedEmailMd = async (ctx, next) => {
  const { email } = ctx.state.reqBody;
  const { dbPool } = ctx;

  const conn = await dbPool.getConnection();
  const rows = await conn.query("SELECT * FROM tb_member WHERE email = ?", [
    email,
  ]);

  if (rows.length > 0) {
    throw Boom.badRequest();
  }

  ctx.state.conn = conn;

  await next();
};

export const saveMemberMd = async (ctx, next) => {
  const { email, password, name, type, mobile } = ctx.state.reqBody;
  const { conn } = ctx.state;

  // eslint-disable-next-line max-len
  await conn.query(
    "INSERT INTO tb_member(email, name, password, type, mobile) VALUES (?, ?, password(?), ?, ?)",
    [email, name, password, type, mobile]
  );

  await next();
};

export const queryMemberMdByEmail = async (ctx, next) => {
  const { email } = ctx.state.reqBody;
  const { conn } = ctx.state;

  const rows = await conn.query(
    "SELECT email, name, type, mobile, createdAt FROM tb_member WHERE email = ?",
    [email]
  );

  ctx.state.body = rows[0];

  await next();
};

export const removeMemberMd = async (ctx, next) => {
  const { email } = ctx.params;
  const { conn } = ctx.state;
  await conn.query("DELETE FROM tb_member");
  console.log("ok");
  await next();
};

export const create = [
  getDataFromBodyMd,
  validateDataMd,
  isDuplicatedEmailMd,
  saveMemberMd,
  queryMemberMdByEmail,
  responseMiddleware,
];

export const read = [];

export const remove = [removeMemberMd, responseMiddleware];
