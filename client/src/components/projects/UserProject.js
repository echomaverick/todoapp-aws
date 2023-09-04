import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import "../styles/projectSearch.css";
import '../styles/userProjects.css';

const ProjectCard = ({ project, onDelete, onEdit, markProjectAsCompleted }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete(project._id);
    setShowConfirmation(false);
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleEdit = () => {
    onEdit(project._id);
  };

  return (
    <div className="user-project-card">
      <div className="card-body">
        <h5 className="card-title">Name: {project.name}</h5>
        <p className="card-text">Description: {project.description}</p>
      </div>
      <div className="card-footer d-flex justify-content-between align-items-center rounded-bottom">
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
          <div className="btn-group">
            <Link
              className={`view-project-button ${
                project.completed ? "disabled" : ""
              }`}
              to={`/projects/${project._id}`}
              disabled={project.completed}
            >
              View
            </Link>
            <Link
              className={`edit-project-button ${
                project.completed ? "disabled" : ""
              }`}
              to={`/projects/edit/${project._id}`}
              disabled={project.completed}
            >
              Edit
            </Link>
            <button
              className="delete-project-button"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              className="completed-project-button"
              onClick={() => markProjectAsCompleted(project._id)}
              disabled={project.completed}
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

const UserProject = ({ match }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { username } = match.params;
  const history = useHistory();

  const handleEditProject = (projectId) => {
    history.push(`/projects/edit/${projectId}`);
  };

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        const response = await axios.get(
          `https://3pg6n3wy90.execute-api.us-west-2.amazonaws.com/dev/user/${username}/projects`
        );
        setProjects(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(true);
      }
    };
    fetchUserProjects();
  }, [username]);

  const oneDeleteProject = async (projectId) => {
    try {
      console.log(projectId);
      const response = await axios.delete(
        `https://3pg6n3wy90.execute-api.us-west-2.amazonaws.com/dev/projects/${projectId}`
      );
      console.log("Delete response:", response.data); // Log the response
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project._id !== projectId)
      );
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const markProjectAsCompleted = async (projectId) => {
    try {
      await axios.put(
        `https://3pg6n3wy90.execute-api.us-west-2.amazonaws.com/dev/projects/${[
          projectId,
        ]}/completed`,
        {
          completed: true,
          dueDate: new Date(),
        }
      );
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId ? { ...project, completed: true } : project
        )
      );
      console.log("Project is mark as completed", projectId);
    } catch (error) {
      console.log("Error marking project as completed", error);
    }
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="user-project">Projects for {username}</h2>
        <Link className="add-project-button" to="/projects">
          Add Project
        </Link>
      </div>
      <div className="row">
        {projects.map((project) => (
          <div key={project._id} className="col-md-4 md-4">
            <ProjectCard
              project={project}
              onEdit={handleEditProject}
              onDelete={oneDeleteProject}
              markProjectAsCompleted={markProjectAsCompleted}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProject;
