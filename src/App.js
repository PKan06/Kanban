import React, { useEffect, useState } from "react";

import "./App.css";
import Board from "./Components/Board/board";
import Editable from "./Components/Editable/Editable";

function App() {
  const [boards, setBoards] = useState(JSON.parse(localStorage.getItem('kanban')) || [
    {
      id: Date.now() + Math.random() * 2,
      title: "To Do",
      cards:[]
    },
    {
      id: Date.now() + Math.random() * 2,
      title: "Doing",
      cards:[]
    },
    {
      id: Date.now() + Math.random() * 2,
      title: "Done",
      cards:[]
    }]);
  const [targetCard, setTargetCard] = useState({
    bid: "", // board id
    cid: "", // card id
  });

  const addCard = (title, bid) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoard = [...boards];
    tempBoard[index].cards.push({
      id: Date.now + Math.random(),
      title: title,
      tasks: [],
      labels: [],
      desc: "",
      date: "",
    });
    setBoards(tempBoard);
  };

  const removeCard = (bid, cid) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    cards.splice(cardIndex, 1); // removing i tem from the board
    setBoards(tempBoards);
  };

  const addboard = (name) => {
    const tempBoards = [...boards];
    tempBoards.push({
      id: Date.now() + Math.random() * 2,
      title: name,
      cards: [],
    });
    setBoards(tempBoards);
  };

  const removeBoard = (bid) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    tempBoards.splice(index, 1);
    setBoards(tempBoards);
  };

  const handeldragEnd = (bid, cid) => {
    let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    s_boardIndex = boards.findIndex((item) => item.id === bid);
    if (s_boardIndex < 0) return;

    s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
      (item) => item.id === cid
    );
    if (s_cardIndex < 0) return;

    t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
    if (t_boardIndex < 0) return;

    t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
      (item) => item.id === targetCard.cid
    );
    if (t_cardIndex < 0) return;

    const tempBoards = [...boards];
    const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    // console.log(sourceCard);
    tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    setBoards(tempBoards);

    // setTargetCard({
    //   bid: "",
    //   cid: "",
    // });
  };
  const handeldragEnter = (bid, cid) => {
    if (targetCard.cid === cid) return;
    setTargetCard({
      bid,
      cid,
    });
  };

  const updateCard = (bid, cid, card) => {
    const index = boards.findIndex((item) => item.id === bid);
    if (index < 0) return;

    const tempBoards = [...boards];
    const cards = tempBoards[index].cards;

    const cardIndex = cards.findIndex((item) => item.id === cid);
    if (cardIndex < 0) return;

    tempBoards[index].cards[cardIndex] = card;
    setBoards(tempBoards);
  };

  useEffect(() => {
    localStorage.setItem("kanban", JSON.stringify(boards));
  }, [boards]); // must to store in stringify other wize we will not able to retrive it back in strigify back
  return (
    <div className="app">
      <div className="app_nav">
        <h1>Kanban Board</h1>
      </div>

      <div className="app_boards_container">
        <div className="app_boards">
          {boards.map((item) => (
            <Board
              key={item.id}
              board={item}
              removeBoard={removeBoard}
              addCard={addCard}
              removeCard={removeCard}
              handeldragEnd={handeldragEnd}
              handeldragEnter={handeldragEnter}
              updateCard={updateCard}
            />
          ))}
          <div>
            <Editable
              displayClass="app_boards_add-board"
              editClass="app_boards_add-board_edit"
              placeholder="Enter Board Name"
              text="Add Board"
              buttonText="Add Board"
              onsubmit={(value) => addboard(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
