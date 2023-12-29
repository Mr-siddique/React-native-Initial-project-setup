export const FIRST_CALL_LOADING = 'first_call_loading';
export const FIRST_CALL_SUCCESS = 'first_call_success';
export const FIRST_CALL_FAILURE = 'first_call_failure';
const initialState = {
    first_call_loading: false,
    first_call_success: false,
    first_call_data:null
};

export default function firstcall(state = initialState, action = {}) {
  switch (action.type) {
    case FIRST_CALL_LOADING:
      return {...state, first_call_loading: true, first_call_success: false};
    case FIRST_CALL_SUCCESS:
      var result = action.result ? JSON.parse(action.result) : {};
      return {
        ...state,
        first_call_loading: false,
        first_call_data: result,
        first_call_success: false,
      };
    case FIRST_CALL_FAILURE:
      return {
        ...state,
        first_call_loading: false,
        first_call_success: false,
      };
    default:
        return {
            ...state,
        }
  }
}


export function makeFirstCall(){
    return {
        types: [FIRST_CALL_LOADING, FIRST_CALL_SUCCESS, FIRST_CALL_FAILURE],
        promise: client => client.default.get("https://webapi.magicpin.in/discovery/page")
    }
}
