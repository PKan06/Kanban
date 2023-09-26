import React, { useEffect, useState } from "react";

import "./App.css";
import Board from "./Components/Board/board";
import Editable from "./Components/Editable/Editable";
import axios from "axios";

function App() {
  const [boards, setBoards] = useState([]);

  let api_key = "";
  console.log(process.env.VERCEL_ENV, process.env.VERCEL_URL);
  if (process.env.VERCEL_ENV === "production") {
    api_key = `http://${process.env.VERCEL_URL}`;
  } else api_key = process.env.REACT_APP_API_KEY_LOCAL;

  const fetchcards = () => {
    axios
      .get(`${api_key}board/all`)
      .then((res) => {
        // console.log(res.data);
        setBoards(res.data);
      })
      .catch((err) => {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log("Error", err.message);
        }
        console.log(err.config);
      });
  };
  useEffect(() => {
    fetchcards();
    // eslint-disable-next-line
  }, []);

  const [targetCard, setTargetCard] = useState({
    bid: "", // board id
    cid: "", // card id
  });
  const [targetBoard, setTargetBoard] = useState("");

  const addCard = async (title, bid) => {
    // const index = boards.findIndex((item) => item.id === bid);
    // if (index < 0) return;
    // console.log("working");
    await axios.post(`${api_key}card/${bid}`, {
      title: title,
    });
    fetchcards();
    // const tempBoard = [...boards];
    // tempBoard[index].cards.push({
    //   id: Date.now + Math.random(),
    //   title: title,
    //   tasks: [],
    //   labels: [],
    //   desc: "",
    //   date: "",
    // });
    // setBoards(tempBoard);
  };

  const removeCard = async (bid, cid) => {
    // const index = boards.findIndex((item) => item.id === bid);
    // if (index < 0) return;
    const delete_card = await axios.delete(`${api_key}card/deleteCard/${bid}`, {
      data: { cardID: cid },
    });
    console.log(delete_card.data);
    fetchcards();
    // const tempBoards = [...boards];
    // const cards = tempBoards[index].cards;

    // const cardIndex = cards.findIndex((item) => item.id === cid);
    // if (cardIndex < 0) return;

    // cards.splice(cardIndex, 1); // removing i tem from the board
    // setBoards(tempBoards);
  };

  const addboard = async (name) => {
    const add_board = await axios.post(`${api_key}board/`, {
      title: name,
    });
    console.log(add_board.data);
    fetchcards();

    // const tempBoards = [...boards];
    // tempBoards.push({
    //   id: Date.now() + Math.random() * 2,
    //   title: name,
    //   cards: [],
    // });
    // setBoards(tempBoards);
  };

  const removeBoard = async (bid) => {
    const delete_board = await axios.delete(`${api_key}board/${bid}`);
    console.log(delete_board.data);
    fetchcards();
  };

  const handeldragEnd = async (bid, cid) => {
    // let s_boardIndex, s_cardIndex, t_boardIndex, t_cardIndex;
    if (targetBoard !== "") {
      // console.log("\nvalue ->", targetBoard);
      // console.log("bid -> ", bid);
      // console.log("cid -> ", cid);
      const card_on_board = await axios.put(`${api_key}board/card-on-board`, {
        T_bid: targetBoard,
        bid: bid,
        cid: cid,
      });
      setTargetBoard("");
      console.log(card_on_board.data);
      fetchcards();
    } else if (cid !== targetCard.cid) {
      // pick
      // console.log("bid -> ", bid);
      // console.log("cid -> ", cid);

      // un-pick
      // console.log("T_bid -> ", targetCard.bid);
      // console.log("T_cid -> ", targetCard.cid);

      const card_on_card_board = await axios.put(
        `${api_key}board/card-on-card`,
        {
          bid: bid,
          cid: cid,
          T_bid: targetCard.bid,
          T_cid: targetCard.cid,
        }
      );
      console.log(card_on_card_board.data);
      fetchcards();
    }

    // let s_boardIndex = boards.findIndex((item) => item.id === bid);
    // if (s_boardIndex < 0) return;

    // let s_cardIndex = boards[s_boardIndex]?.cards?.findIndex(
    //   (item) => item.id === cid
    // );
    // if (s_cardIndex < 0) return;

    // let t_boardIndex = boards.findIndex((item) => item.id === targetCard.bid);
    // if (t_boardIndex < 0) return;

    // let t_cardIndex = boards[t_boardIndex]?.cards?.findIndex(
    //   (item) => item.id === targetCard.cid
    // );
    // if (t_cardIndex < 0) return;

    // console.log("s_boardIndex -> ",s_boardIndex)
    // console.log("s_cardIndex -> ",s_cardIndex)
    // console.log("t_boardIndex -> ",t_boardIndex)
    // console.log("t_cardIndex -> ",t_cardIndex)

    // const tempBoards = [...boards];
    // const sourceCard = tempBoards[s_boardIndex].cards[s_cardIndex];
    // // console.log(sourceCard);
    // tempBoards[s_boardIndex].cards.splice(s_cardIndex, 1);
    // tempBoards[t_boardIndex].cards.splice(t_cardIndex, 0, sourceCard);
    // setBoards(tempBoards);

    // setTargetCard({
    //   bid: "",
    //   cid: "",
    // });
  };
  const handeldragEnter = (bid, cid) => {
    // tagerted card and board id
    if (targetCard.cid === cid) return;
    setTargetCard({
      bid,
      cid,
    });
  };

  const handelOnDrop = async (bid) => {
    // setTargetCard({
    //   bid: bid,
    //   cid: "",
    // });
    // console.log(e)
    setTargetBoard(bid);
    // if (bid !== "") {
    //   console.log("handelondrop : ", bid);
    //   console.log("T_bid -> ", targetCard.bid);
    //   console.log("T_cid -> ", targetCard.cid);
    //   const card_on_board = await axios.put(
    //     `http://localhost:5000/board/card-on-board`,
    //     {
    //       handelondrop: bid,
    //       T_bid: targetCard.bid,
    //       T_cid: targetCard.cid,
    //     }
    //   );
    //   console.log(card_on_board.data);
    //   fetchcards();
    // }
  };
  // const updateCard = (bid, cid, card) => {
  //   const index = boards.findIndex((item) => item.id === bid);
  //   if (index < 0) return;

  //   const tempBoards = [...boards];
  //   const cards = tempBoards[index].cards;

  //   const cardIndex = cards.findIndex((item) => item.id === cid);
  //   if (cardIndex < 0) return;

  //   tempBoards[index].cards[cardIndex] = card;
  //   setBoards(tempBoards);
  // };

  // useEffect(() => {
  //   localStorage.setItem("kanban", JSON.stringify(boards));
  // }, [boards]); // must to store in stringify other wize we will not able to retrive it back in strigify back

  // const [{ isOver }, addToTeamRef] = useDrop({
  //   accept: "player",
  //   collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  // });

  // // console.log(isOver);
  // const [{ isOver: isPlayerOver }, removeFromTeamRef] = useDrop({
  //   accept: "team",
  //   collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  // });
  // // console.log(isPlayerOver);

  // const movePlayerToTeam = (item) => {
  //   console.log(item);
  //   // setPlayer((prev) => prev.filter((_, i) => item.index !== i));
  //   // setTeam((prev) => [...prev, item]);
  // };
  // const removePlayerFromTeam = (item) => {
  //   console.log(item);
  //   // setTeam((prev) => prev.filter((_, i) => item.index !== i));
  //   // setPlayer((prev) => [...prev, item]);
  // };

  return (
    <div className="app">
      <div className="app_nav">
        <h1>Kanban Board</h1>
      </div>

      <div className="app_boards_container  custom-scroll">
        <div className="app_boards">
          {boards.map((item) => (
            <Board
              key={item.id}
              id={item.id}
              board={item}
              removeBoard={removeBoard}
              addCard={addCard}
              removeCard={removeCard}
              handeldragEnd={handeldragEnd}
              handeldragEnter={handeldragEnter}
              // updateCard={updateCard}
              fetchcards={fetchcards}
              handelOnDrop={handelOnDrop}
              api_key={api_key}
              // ref={removeFromTeamRef}
              // onDropPlayer={movePlayerToTeam}
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
