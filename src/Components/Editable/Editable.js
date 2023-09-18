import React, { useState } from "react";

import { X } from "react-feather";

import "./Editable.css";

function Editable(props) {
  const [showEdit, setShowEdit] = useState(false);
  const [inputValue, setInputValue] = useState(props.defaultValue || "");
  return (
    <div className="editable">
      {showEdit ? (
        <>
          <form
            className={`editable_edit ${props.editclass || ""}`}
            onSubmit={(event) => {
              event.preventDefault();
              if (inputValue === "") {
                alert(props.placeholder);
              } else {
                if (props.onsubmit) props.onsubmit(inputValue);
                setShowEdit(false);
                setInputValue("");
              }
            }}
          >
            <input
              autoFocus
              type="text"
              value={inputValue}
              onClick={(e) => {
                setInputValue(e.target.value);
              }}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={props.placeholder || "Enter item"}
            />
            {props.body || ""}
            <div className="editable_edit_footer">
              <button type="submit">{props.buttonText || "Add"}</button>
              <X className="hand" onClick={() => setShowEdit(false)} />
            </div>
          </form>
        </>
      ) : (
        <p
          className={` ${props.displayClass || "editable_display"}`}
          onClick={() => setShowEdit(true)}
        >
          {props.text || "Add items"}
        </p>
      )}
    </div>
  );
}

export default Editable;
