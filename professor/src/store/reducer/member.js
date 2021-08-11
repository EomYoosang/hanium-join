import { createAction, handleActions } from "redux-actions";
import { pender } from "redux-pender";
import { Map, List, fromJS } from "immutable";
import { MemberApi } from "../../remote";


export const LISTALL_MEMBER = "member/LISTALL";


export const listAllMember = createAction(
    LISTALL_MEMBER,
    MemberApi.listAll
);

const initialState = Map({ 
    list: Map({
        count: 0,
        results: List([])
    })
});



export default handleActions({
    ...pender({
        type: LISTALL_MEMBER, 
        onSuccess: (state, action) => { 
            const data = action.payload.data;

            return state.set("list", fromJS(action.payload.data));
            // return state.setIn(["list", "count"], action.payload.data.count)
            // .setIn(["list", "result"], fromJS(action.payload.data.result));
            // return {
            //     ...state,
            //     count: action.payload.data.count,
            // }
        }
    })

}, initialState)