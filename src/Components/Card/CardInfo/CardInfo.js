import React, { useEffect, useState } from "react";
import {
  Calendar,
  CheckSquare,
  List,
  Tag,
  Trash,
  Type,
  X,
} from "react-feather";

import Modal from "../../Modal/Modal";
import Editable from "../../Editable/Editable";

import "./CardInfo.css";
import axios from "axios";

function CardInfo(props) {
  const colors = [
    "#a8193d",
    "#4fcc25",
    "#1ebffa",
    "#8da377",
    "#9975bd",
    "#cf61a1",
    "#240959",
  ];

  const [selectedColor, setSelectedColor] = useState("#240959");
  const [values, setValues] = useState({
    ...props.card,
  });

  const updateCard = () => {
    axios
      .get(`http://localhost:5000/card/${props.cardID}`)
      .then((res) => {
        // console.log(res.data);
        setValues(res.data);
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
  const updateTitle = async (value) => {
    await axios
      .put(`http://localhost:5000/card/${props.cardID}`, {
        title: value,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
    updateCard();
    // setValues({ ...values, title: value });
  };

  const updateDesc = async (value) => {
    await axios
      .put(`http://localhost:5000/card/${props.cardID}`, {
        desc: value,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
    updateCard();

    // setValues({ ...values, desc: value });
  };

  const addLabel = async (label) => {
    // const index = values.labels.findIndex((item) => item.text === label.text);
    // if (index > -1) return;
    console.log(label, selectedColor);
    if (label.color === "") {
      alert("Specify the color for the label");
    } else {
      // const addedlabel = await axios.put(
      await axios.put(
        `http://localhost:5000/card/addLabel/${props.cardID}`,
        {
          text: label.text,
          color: selectedColor,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      updateCard();
      setSelectedColor("#240959");
    }
    // setValues({
    //   ...values,
    //   labels: [...values.labels, label],
    // });
  };

  const removeLabel = async (labelID) => {
    // const tempLabels = values.labels.filter((item) => item.text !== label.text);
    // const removelabel = await axios.put(
    await axios.put(
      `http://localhost:5000/card/deleteLabel/${props.cardID}`,
      {
        LabelID: labelID,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    updateCard();

    // setValues({
    //   ...values,
    //   labels: tempLabels,
    // });
  };

  const addTask = async (value) => {
    // console.log(value);
    if (value === "") {
      alert("Enter the task title");
    } else {
      // const task = await axios.put(
      await axios.put(
        `http://localhost:5000/card/addTask/${props.cardID}`,
        {
          title: value,
          completed: false,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(task.data);
      updateCard();
    }
    // props.fetchcards();
    // console.log({...values})
    // setValues({
    //   ...values,
    //   task: [...values.task, task.data],
    // });
  };

  const removeTask = async (id) => {
    // const tasks = [...values.task];
    await axios
      .put(`http://localhost:5000/card/deleteTask/${props.cardID}`, {
        taskID: id,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
    updateCard();
    // props.fetchcards();
    // const tempTasks = tasks.filter((item) => item.id !== id);
    // setValues({
    //   ...values,
    //   task: tempTasks,
    // });
  };

  const updateTask = async (id, value) => {
    // const tasks = [...values.task];

    await axios
      .put(`http://localhost:5000/task/${id}`, {
        completed: value,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
    updateCard();

    // const index = tasks.findIndex((item) => item.id === id);
    // if (index < 0) return;

    // tasks[index].completed = value;

    // setValues({
    //   ...values,
    //   task: tasks,
    // });
  };

  const calculatePercent = () => {
    if (!values.task?.length) return 0;
    const completed = values.task?.filter((item) => item.completed)?.length;
    return (completed / values.task?.length) * 100;
  };

  const updateDate = async (date) => {
    console.log(date + new Date().toISOString().substr(10));
    if (!date) return;

    await axios
      .put(`http://localhost:5000/card/${props.cardID}`, {
        date: date + new Date().toISOString().substr(10),
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
    updateCard();
    // setValues({
    //   ...values,
    //   date,
    // });
  };
  // hook will run when values will change
  useEffect(() => {
    // if (props.updateCard) {
    //   props.updateCard(props.boardID, values.id, values);
    // }
    props.fetchcards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <Modal
      onClose={() => props.onClose()}
      children={
        <div className="cardinfo">
          <div className="cardinfo_box">
            <div className="cardinfo_box_title">
              <Type />
              <p>Title</p>
            </div>
            <Editable
              defaultValue={values.title}
              default={values.title}
              buttonText="Set Title"
              text={values.title}
              onsubmit={updateTitle}
              displayClass="enter-value"
            />
          </div>

          <div className="cardinfo_box">
            <div className="cardinfo_box_title">
              <List />
              <p>Description</p>
            </div>
            <Editable
              defaultValue={values.desc}
              default={values.desc}
              text={values.desc || "Add a Description"}
              buttonText="Set Description"
              placeholder="Enter description"
              onsubmit={updateDesc}
              displayClass="enter-value"
            />
          </div>

          <div className="cardinfo_box  center">
            <div className="cardinfo_box_title">
              <Calendar />
              <p>Date</p>
            </div>
            <input
              type="date"
              defaultValue={values.date.substr(0, 10)}
              min={new Date().toISOString().substr(0, 10)}
              onChange={(event) => updateDate(event.target.value)}
            />
          </div>

          <div className="cardinfo_box">
            <div className="cardinfo_box_title">
              <Tag />
              <p>Labels</p>
            </div>
            <div className="cardinfo_box_labels">
              {values.labels?.map((item, index) => (
                <label
                  key={index}
                  style={{ backgroundColor: item.Color, color: "#fff" }}
                >
                  {item.text}
                  <X onClick={() => removeLabel(item.id)} />
                </label>
              ))}
            </div>

            <Editable
              text="Add Label"
              placeholder="Enter label text"
              buttonText="Set Label"
              body={
                <ul>
                  {colors.map((item, index) => (
                    <li
                      key={index + item}
                      style={{ backgroundColor: item }}
                      className={selectedColor === item ? "li_active" : ""}
                      onClick={() => {
                        setSelectedColor(item);
                      }}
                    />
                  ))}
                </ul>
              }
              onClick={(e) => e.preventDefault()}
              onsubmit={(value) =>
                addLabel({ color: selectedColor, text: value })
              }
            />
          </div>

          <div className="cardinfo_box">
            <div className="cardinfo_box_title">
              <CheckSquare />
              <p>Tasks</p>
            </div>
            <div className="cardinfo_box_progress-bar">
              <div
                className="cardinfo_box_progress"
                style={{
                  width: `${calculatePercent()}%`,
                  backgroundColor:
                    calculatePercent() === 100 ? "limegreen" : "",
                }}
              />
            </div>
            <div className="cardinfo_box_task_list">
              {values.task?.map((item) => (
                <div key={item.id} className="cardinfo_box_task_checkbox">
                  <input
                    type="checkbox"
                    defaultChecked={item.completed}
                    onChange={(event) =>
                      updateTask(item.id, event.target.checked)
                    }
                  />
                  <p className={item.completed ? "completed" : ""}>
                    {item.title}
                  </p>
                  <Trash onClick={() => removeTask(item.id)} />
                </div>
              ))}
            </div>
            <Editable
              text={"Add a Task"}
              placeholder="Enter task title"
              default="Task"
              onsubmit={(value) => addTask(value)}
            />
          </div>
        </div>
      }
    />
  );
}

export default CardInfo;
