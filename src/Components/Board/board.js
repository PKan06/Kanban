import React, { useState } from "react";
import { MoreVertical } from "react-feather";

import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import Editable from "../Editable/Editable";

import "./Board.css";

function Board(props) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div
      className="board"
      id={props.id}
      onDragOver={(e) => {
        e.preventDefault();
      }}
      onDrop={(e) => {
        props.handelOnDrop(e.target.id);
        e.target.style.border = "";
        e.target.style.opacity = "1";
        // console.log("getData", e.target.id);
      }} // function will handel whatwill happen on drop
    >
      <div className="board_header">
        <p className="board_header_title">
          {props.board?.title}{" "}
          <span>{`${props.board?.Cards?.length || "0"}`}</span>
        </p>
        <div className="board_header_title_more">
          <MoreVertical
            onClick={() => {
              // console.log("showDropdown : ",showDropdown);
              setShowDropdown(true);
            }}
          />
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
        {props.board?.Cards?.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            card={item}
            boardID={props.board?.id}
            removeCard={props.removeCard}
            handeldragEnd={props.handeldragEnd}
            handeldragEnter={props.handeldragEnter}
            api_key={props.api_key}
            // updateCard={props.updateCard}
            fetchcards={props.fetchcards}
            onDropPlayer={props.onDropPlayer}
          />
        ))}
        <Editable
          displayClass="board_add-card"
          text="Add Card"
          placeholder="Enter Card Title"
          buttonText="Add Card"
          onsubmit={(value) => {
            props.addCard(value, props.board?.id);
            // console.log(value, props.board?.id);
          }}
        />
      </div>
    </div>
  );
}

export default Board;
