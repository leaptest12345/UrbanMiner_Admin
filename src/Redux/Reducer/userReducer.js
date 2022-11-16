
let initialState = []
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "USER_DETAIL": 
        return state;
        case "SET_USER_DETAIL":
             return action.user
        default: 
        return state;
    }
}
export default userReducer;