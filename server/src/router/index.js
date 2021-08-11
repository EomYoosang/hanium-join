import Router from "@koa/router";
import classes from "./classes";
import members from "./members";
import teams from "./teams";
import enrol from "./enrol";
// import discuss from "./discuss";

const router = new Router({
  prefix: "/api/v1",
});

router.use("/classes", classes.routes());
router.use("/members", members.routes());
router.use("/teams", teams.routes());
router.use("/enrol", enrol.routes());
// router.use("/discuss", discuss.routes());

export default router;
