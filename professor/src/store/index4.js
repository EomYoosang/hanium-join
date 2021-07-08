import { createStore } from "redux";
import reducer from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {
  // 초기 test 값
  classes: [],
  assignments: [],
  members: [],
  teams: [],
};

const store = createStore(reducer, initialState, composeWithDevTools());

export default store;