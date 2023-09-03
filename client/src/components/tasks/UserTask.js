import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import '../styles/userTasks.css';

const TaskCard = ({ task, onDelete, markTaskAsCompleted }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete(task._id);
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="user-task-card">
      <div className="card-body">
        <div className="task-title">
          <h5 className="card-title">
            <strong>Title:</strong> {task.title}
          </h5>
        </div>
        <div className="task-description">
          <p className="card-text">
            <strong>Description:</strong> {task.description}
          </p>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-between rounded-bottom">
        {showConfirmation ? (
          <div
            className="popup bg-white rounded p-3 d-flex flex-column align-items-center justify-content-center"
            style={{ width: "600px", minHeight: "200px" }}
          >
            <p className="confirmation-text" style={{ fontSize: "24px" }}>
              Are you sure you want to delete?
            </p>
            <div className="btn-group d-flex align-items-center">
              <button
                className="btn1 btn-danger btn-rounded"
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className="btn1 btn-secondary btn-rounded ml-2"
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="buttons-group">
            <Link
              className={`view-task-button ${
                task.completed ? "disabled" : ""
              }`}
              to={`/tasks/${task._id}`}
              disabled={task.completed}
            >
              View
            </Link>
            <Link
              className={`edit-task-button ${
                task.completed ? "disabled" : ""
              }`}
              to={`/tasks/edit/${task._id}`}
              disabled={task.completed}
            >
              Edit
            </Link>
            <button
              className="delete-task-button"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="completed-task-button"
              onClick={() => markTaskAsCompleted(task._id)}
              disabled={task.completed}
            >
              Completed
            </button>
          </div>
        )}
        {showConfirmation && <div className="popup-shadow"></div>}
      </div>
    </div>
  );
};

const UserTasks = ({ match }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = match.params;

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const response = await axios.get(
          `https://3pg6n3wy90.execute-api.us-west-2.amazonaws.com/dev/user/${username}/tasks`
        );
        setTasks(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchUserTasks();
  }, [username]);

  const onDeleteTask = async (taskId) => {
    try {
      await axios.delete(
        `https://3pg6n3wy90.execute-api.us-west-2.amazonaws.com/dev/tasks/${taskId}`
      );
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const markTaskAsCompleted = async (taskId) => {
    try {
      await axios.put(
        `https://3pg6n3wy90.execute-api.us-west-2.amazonaws.com/dev/tasks/${taskId}/completed`,
        {
          completed: true,
          dueDate: new Date(),
        }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, completed: true } : task
        )
      );
      console.log("Task is market as completed", taskId);
    } catch (error) {
      console.log("Error marking the task as completed", error);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="user-task">Tasks for {username}</h2>
        <Link className="add-task-button" to="/tasks">
          Add Task
        </Link>
      </div>
      <div className="row">
        {tasks.map((task) => (
          <div key={task._id} className="col-md-4 mb-4">
            <TaskCard
              task={task}
              onDelete={onDeleteTask}
              markTaskAsCompleted={markTaskAsCompleted}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTasks;
