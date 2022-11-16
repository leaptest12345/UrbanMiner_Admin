import { SET_USER_DETAIL } from "./constant"

export const setUser=(user)=>{
    return(
        {
            type:SET_USER_DETAIL,
            user
        }
    )
}

