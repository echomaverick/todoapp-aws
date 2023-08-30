// import React, { useState } from "react";
// import axios from "axios";
// import { Container, Form, Button, Alert, Card } from "react-bootstrap";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(
//         "https://3bivlllof3.execute-api.us-west-2.amazonaws.com/dev/auth/login",
//         {
//           username,
//           password,
//         }
//       );
//       //stores the received token in the storage
//       localStorage.setItem("accessToken", response.data.token);
//       setErrorMessage("");
//       window.location.href = "/";
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.error) {
//         console.log(error);
//         setErrorMessage(error.response.data.error);
//       } else {
//         console.log(error);
//         setErrorMessage(
//           "An error occurred during login. Please try again later."
//         );
//       }
//     }
//   };

//   return (
//     <Container
//       className="d-flex align-items-center justify-content-center"
//       style={{ minHeight: "100vh" }}
//     >
//       <Card
//         style={{
//           width: "400px",
//           padding: "20px",
//           boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <h2 className="text-center">Login</h2>
//         <Form onSubmit={handleLogin}>
//           <Form.Group controlId="username">
//             <Form.Label>Username:</Form.Label>
//             <Form.Control
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               style={{ height: "50px" }}
//             />
//           </Form.Group>
//           <Form.Group controlId="password">
//             <Form.Label>Password:</Form.Label>
//             <Form.Control
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={{ height: "50px" }}
//             />
//           </Form.Group>
//           {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//           <Button type="submit" className="w-100 mt-3">
//             Login
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };

// export default Login;


// import React, { useState } from "react";
// import { Auth } from "aws-amplify";
// import { Container, Form, Button, Alert, Card } from "react-bootstrap";

// Auth.configure({
//   region: "us-west-2",
//   userPoolId: "us-west-2_2USD15JUp",
//   userPoolWebClientId: "5it75nj4mdf4nhdifhnig5m3mp",
// });

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
      
//       const user = await Auth.signIn(username, password);
//       console.log(user);

//       localStorage.setItem("idToken", user.signInUserSession.idToken.jwtToken);
//       localStorage.setItem("accessToken", user.signInUserSession.accessToken.jwtToken);

//       setErrorMessage("");
//       window.location.href = "/";
//     } catch (error) {
//       if (error.message) {
//         console.log(error);
//         setErrorMessage(error.message);
//       } else {
//         console.log(error);
//         setErrorMessage(
//           "An error occurred during login. Please try again later."
//         );
//       }
//     }
//   };
//   return (
//     <Container
//       className="d-flex align-items-center justify-content-center"
//       style={{ minHeight: "100vh" }}
//     >
//       <Card
//         style={{
//           width: "400px",
//           padding: "20px",
//           boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
//         }}
//       >
//         <h2 className="text-center">Login</h2>
//         <Form onSubmit={handleLogin}>
//           <Form.Group controlId="username">
//             <Form.Label>Username:</Form.Label>
//             <Form.Control
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               style={{ height: "50px" }}
//             />
//           </Form.Group>
//           <Form.Group controlId="password">
//             <Form.Label>Password:</Form.Label>
//             <Form.Control
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               style={{ height: "50px" }}
//             />
//           </Form.Group>
//           {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//           <Button type="submit" className="w-100 mt-3">
//             Login
//           </Button>
//         </Form>
//       </Card>
//     </Container>
//   );
// };

// export default Login;




















import React, { useState } from "react";
import { Auth } from "aws-amplify";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";

Auth.configure({
  region: "us-west-2",
  userPoolId: "us-west-2_tXvx728pX",
  userPoolWebClientId: "30qpp3s8qr32ielb83cupocdkc",
});

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const user = await Auth.signIn(username, password, {
        authenticationFlowType: "USER_PASSWORD_AUTH",
      });
      console.log(user);
      if (!user || !user.signInUserSession || !user.signInUserSession.accessToken) {
        throw new Error("Invalid user object or access token");
      }
  
      const idToken = user.signInUserSession.idToken.jwtToken;
      const accessToken = user.signInUserSession.accessToken.jwtToken;

      localStorage.setItem("idToken", idToken);
      localStorage.setItem("accessToken", accessToken);
  
      const response = await fetch(
        "https://3bivlllof3.execute-api.us-west-2.amazonaws.com/dev/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: accessToken,
          },
          body: JSON.stringify({ username, password }),
        }
      );
  
      if (response.ok) {
        setErrorMessage("");
        window.location.href = "/";
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      if (error.message) {
        console.log(error);
        setErrorMessage(error.message);
      } else {
        console.log(error);
        setErrorMessage(
          "An error occurred during login. Please try again later."
        );
      }
    }
  };
  
  return (
    <Container className="mt-5">
      <Card className="w-50 mx-auto">
        <Card.Body>
          <Card.Title>Login</Card.Title>
          {errorMessage && (
            <Alert variant="danger" className="mt-3">
              {errorMessage}
            </Alert>
          )}
          <Form onSubmit={handleLogin} className="mt-3">
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;
