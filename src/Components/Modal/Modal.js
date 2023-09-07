import React from "react";

import "./Modal.css";

function Modal(props) {
  return (
    <div
      className="modal"
      onClick={() => (props.onClose ? props.onClose() : "")}
    >
      <div
        className="modal_content custom-scroll"
        onClick={(event) => event.stopPropagation()} // when clicking on modal view then no change 
      >
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
