import React from "react";

export default function CheckBox({
    isChecked,
    handleOnChange
})
{
    return(
        <input
        style={{
            width:40,
            height:40,
        }}
          type="checkbox"
          checked={isChecked}
          onChange={handleOnChange}
        />
    )
}