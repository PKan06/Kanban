import React, { useState } from "react";
import { MoreVertical } from "react-feather";

import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import Editable from "../Editable/Editable";

import "./Board.css";

function Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="board">
      <div className="board_header">
        <p className="board_header_title">
          {props.board?.title} <span>{`${props.board?.cards?.length || "0"}`}</span>
        </p>
        <div
          className="board_header_title_more"
          onClick={() => {
            // console.log("showDropdown : ",showDropdown);
            setShowDropdown(true);
          }}
        >
          <MoreVertical />
          {showDropdown && (
            <Dropdown
              class="board_dropdown"
              onClose={() => {
                // console.log("showDropdown : ",showDropdown);
                setShowDropdown(false);
              }}
              children={
                <p onClick={() => props.removeBoard(props.board?.id)}>
                  Delete Board
                </p>
              }
            />
          )}
        </div>
      </div>
      <div className="board_cards custom-scroll">
        {props.board?.cards?.map((item) => (
          <Card
            key={item.id}
            card={item}
            removeCard={props.removeCard}
            boardID={props.board?.id}
            handeldragEnd={props.handeldragEnd}
            handeldragEnter={props.handeldragEnter}
            updateCard={props.updateCard}

          />
        ))}
        <Editable
          displayClass="board_add-card"
          text="Add Card"
          placeholder="Enter Card Title"
          buttonText="Add Card"
          onsubmit={(value) => {
            props.addCard(value, props.board?.id)
            // console.log(value, props.board?.id);
          }}
        />
      </div>
    </div>
  );
}

export default Board;
