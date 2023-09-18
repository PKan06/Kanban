import React, { useRef } from "react";

import "./Dropdown.css";
import { X } from "react-feather";

function Dropdown(props) {
  const dropdownRef = useRef();

  // const handleClick = (event) => {
  //   // console.log("working -> ",dropdownRef.current.contains(event.target)) // is we have clicked inside
  //   if (
  //     dropdownRef &&
  //     !dropdownRef?.current?.contains(event.target) &&
  //     props.onClose
  //   ) {
  //     console.log(" outside ");
  //     // props.onClose();
  //   } else {
  //     console.log("on click ");
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("click", handleClick); // when component is mount

  //   return () => {
  //     document.removeEventListener("click", handleClick); // component is unmount
  //   };
  // });

  return (
    <>
      <div
        ref={dropdownRef}
        className={`dropdown custom-scroll ${props.class ? props.class : ""}`}
        onClick={(e)=>e.stopPropagation()}
      >
        {props.children}
        <div className="hand">
          <X
            onClick={() => {
              if (props.onClose) {
                props.onClose(false);
              }
            }}
          />
        </div>
      </div>
    </>
  );
}

export default Dropdown;
