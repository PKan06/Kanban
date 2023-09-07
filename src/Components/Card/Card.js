import React, { useState } from "react";
import { CheckSquare, Clock, MoreHorizontal } from "react-feather";

import Dropdown from "../Dropdown/Dropdown";

import "./Card.css";
import CardInfo from "./CardInfo/CardInfo";
import Chip from "../chip/chip";

function Card(props) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setshowModal] = useState(false);

  return (
    <>
      {showModal && (
        <CardInfo
          onClose={() => setshowModal(false)}
          card={props.card}
          updateCard={props.updateCard}
          boardID={props.boardID}
        />
      )}
      <div
        className="card"
        draggable
        onDragEnter={() => props.handeldragEnter(props.boardID, props.card?.id)} // target
        onDragEnd={() => props.handeldragEnd(props.boardID, props.card?.id)} // source
        onClick={() => setshowModal(true)}
      >
        <div className="card_top">
          <div className="card_top_labels">
            {props.card?.labels?.map((item, index) => (
              <Chip key={index} text={item.text} color={item.color} />
            ))}
          </div>
          <div
            className="card_top_more"
            onClick={(event) => {
              // event.stopPropagation();
              setShowDropdown(true);
            }}
          >
            <MoreHorizontal />
            {showDropdown && (
              <Dropdown
                class="board_dropdown"
                onClose={() => setShowDropdown(false)}
                children={
                  <p
                    onClick={() =>
                      props.removeCard(props.boardID, props.card?.id)
                    }
                  >
                    Delete Card
                  </p>
                }
              />
            )}
          </div>
        </div>

        <div className="card_title">{props.card?.title}</div>
        <div className="card_footer">
          {props.card?.date && (
            <p>
              <Clock /> {props.card?.date}
            </p>
          )}
          {props.card?.tasks?.length > 0 && (
            <p>
              <CheckSquare />
              {props.card?.tasks?.filter((item) => item.completed === true).length}/
              {props.card?.tasks?.length}
            </p>
          )}
        </div>
      </div>
    </>
  );
}

export default Card;
