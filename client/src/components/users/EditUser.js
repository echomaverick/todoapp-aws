// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useHistory, useParams } from "react-router-dom";

// const EditUser = () => {
//   let history = useHistory();
//   const { id } = useParams();
//   const [user, setUser] = useState({
//     name: "",
//     surname: "",
//     username: "",
//     email: "",
//     role: "",
//   });
//   const [loading, setLoading] = useState(false);

//   const { name, surname, username, email, role } = user;
//   const onInputChange = (e) => {
//     console.log(e.target.value);
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };

//   useEffect(() => {
//     loadUser();
//   }, []);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const token = localStorage.getItem("accessToken");
//       const apiUrl = `https://3bivlllof3.execute-api.us-west-2.amazonaws.com/dev/users/edit/${user._id}`;
//       await axios.put(apiUrl, user, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setLoading(false);
//       loadUser();
//       history.push("/");
//     } catch (error) {
//       setLoading(false);
//       console.error("Error updating user:", error);
//     }
//   };

//   const loadUser = async () => {
//     try {
//       const result = await axios.get(
//         `https://3bivlllof3.execute-api.us-west-2.amazonaws.com/dev/users/${user._id}`
//       );
//       const { role, ...userData } = result.data;
//       setUser({ ...userData, role });
//       console.log(userData);
//     } catch (error) {
//       console.log(error);
//       console.error("Error loading user:", error);
//     }
//   };

  // return (
  //   <div className="container">
  //     <div className="w-75 mx-auto shadow p-5">
  //       <h2 className="text-center mb-4">Update your profile info</h2>
  //       <form onSubmit={onSubmit}>
  //         <div className="form-group mb-3">
  //           <input
  //             type="text"
  //             className="form-control form-control-lg"
  //             placeholder="Enter Your Name"
  //             name="name"
  //             value={name}
  //             onChange={onInputChange}
  //           />
  //         </div>
  //         <div className="form-group mb-3">
  //           <input
  //             type="text"
  //             className="form-control form-control-lg"
  //             placeholder="Enter Your Surname"
  //             name="surname"
  //             value={surname}
  //             onChange={onInputChange}
  //           />
  //         </div>
  //         <div className="form-group mb-3">
  //           <input
  //             type="text"
  //             className="form-control form-control-lg"
  //             placeholder="Enter Your Username"
  //             name="username"
  //             value={username}
  //             onChange={onInputChange}
  //           />
  //         </div>
  //         <div className="form-group mb-3">
  //           <input
  //             type="email"
  //             className="form-control form-control-lg"
  //             placeholder="Enter Your E-mail Address"
  //             name="email"
  //             value={email}
  //             onChange={onInputChange}
  //           />
  //         </div>
  //         <div className="form-group mb-3">
  //           <label hidden>Role:</label>
  //           <input
  //             type="text"
  //             className="form-control form-control-lg"
  //             value={role}
  //             disabled
  //             hidden
  //           />
  //         </div>
  //         <div className="d-flex justify-content-start">
  //           <button className="btn btn-primary me-2">Update info</button>
  //           <button
  //             className="btn btn-primary"
  //             onClick={() => history.push("/")}
  //           >
  //             Cancel
  //           </button>
  //         </div>
  //       </form>
  //       {loading && (
  //         <div className="loader-container">
  //           <div className="loader"></div>
  //         </div>
  //       )}
  //     </div>
  //   </div>
  // );
// };

// export default EditUser;




import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Auth } from "aws-amplify"; // Import AWS Amplify Auth module

const EditUser = () => {
  let history = useHistory();
  const [user, setUser] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const { name, surname, username, email, role } = user;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await Auth.currentAuthenticatedUser(); 
      const attributes = userData.attributes;

      setUser({
        name: attributes.name || "",
        surname: attributes.surname || "",
        username: attributes.username || "",
        email: attributes.email || "",
        role: attributes.role || "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userData = await Auth.currentAuthenticatedUser(); 
      const userId = userData.attributes.sub;

      const apiUrl = `https://3bivlllof3.execute-api.us-west-2.amazonaws.com/dev/users/edit/${userId}`;

      const token = userData.signInUserSession.idToken.jwtToken;

      await axios.put(apiUrl, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoading(false);
      history.push("/");
    } catch (error) {
      setLoading(false);
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="container">
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Update your profile info</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Name"
              name="name"
              value={name}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Surname"
              name="surname"
              value={surname}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Username"
              name="username"
              value={username}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter Your E-mail Address"
              name="email"
              value={email}
              onChange={onInputChange}
            />
          </div>
          <div className="form-group mb-3">
            <label hidden>Role:</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={role}
              disabled
              hidden
            />
          </div>
          <div className="d-flex justify-content-start">
            <button className="btn btn-primary me-2">Update info</button>
            <button
              className="btn btn-primary"
              onClick={() => history.push("/")}
            >
              Cancel
            </button>
          </div>
        </form>
        {loading && (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUser;
