// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
// import { CeramicClient } from "@ceramicnetwork/http-client";
// import { DIDSession } from "did-session";
// import { EthereumAuthProvider } from "@ceramicnetwork/blockchain-utils-linking";
// import { auth } from "../../firebase";
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
// } from "reactstrap";
// import styles from "./Signup.module.css";
// import signupImage from "../../assest/signup_undraw.svg"; // Replace with your image path

// // Initialize Ceramic Client
// const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com"); // Ceramic testnet

// function Signup() {
//   const navigate = useNavigate();
//   const [values, setValues] = useState({
//     name: "",
//     email: "",
//     pass: "",
//   });
//   const [errorMsg, setErrorMsg] = useState("");
//   const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

//   // Handle form submission
//   const handleSubmission = async () => {
//     if (!values.name || !values.email || !values.pass) {
//       setErrorMsg("Fill all fields");
//       return;
//     }
//     setErrorMsg("");
//     setSubmitButtonDisabled(true);

//     try {
//       // Firebase Signup
//       const res = await createUserWithEmailAndPassword(auth, values.email, values.pass);
//       const user = res.user;
//       await updateProfile(user, { displayName: values.name });
      
//       // Generate DID for the new user
//       await generateDIDForUser();

//       // Navigate to homepage on successful signup and DID generation
//       navigate("/");
//     } catch (err) {
//       setErrorMsg(err.message);
//       setSubmitButtonDisabled(false);
//     }
//   };

//   // Generate a DID for the user using MetaMask
//   const generateDIDForUser = async () => {
//     try {
//       // Check if MetaMask is installed
//       if (!window.ethereum) {
//         throw new Error("MetaMask is not installed. Please install MetaMask to use DID functionality.");
//       }

//       // Request account access
//       const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//       const authProvider = new EthereumAuthProvider(window.ethereum, accounts[0]);

//       // Authorize a DID session
//       const didSession = await DIDSession.authorize(authProvider, { resources: ["*"] });
//       ceramic.did = didSession.did; // Attach DID to Ceramic client

//       console.log("DID generated successfully:", didSession.did.id);
//     } catch (error) {
//       console.error("DID generation failed:", error);
//       setErrorMsg(error.message || "Error generating DID. Please try again.");
//       setSubmitButtonDisabled(false);
//     }
//   };

//   // Handle input change
//   const handleInputChange = (event, field) => {
//     const { value } = event.target;
//     setValues((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   return (
//     <div className={styles.container}>
//       <Container fluid>
//         <Row>
//           <Col md={{ size: 4, offset: 1 }}>
//             <div className={styles.innerBox}>
//               <h1 className={styles.heading}>Signup</h1>
//               <Form>
//                 <FormGroup>
//                   <Label for="name">Name</Label>
//                   <Input
//                     type="text"
//                     id="name"
//                     placeholder="Enter your name"
//                     value={values.name}
//                     onChange={(e) => handleInputChange(e, "name")}
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label for="email">Email</Label>
//                   <Input
//                     type="email"
//                     id="email"
//                     placeholder="Enter email address"
//                     value={values.email}
//                     onChange={(e) => handleInputChange(e, "email")}
//                   />
//                 </FormGroup>
//                 <FormGroup>
//                   <Label for="password">Password</Label>
//                   <Input
//                     type="password"
//                     id="password"
//                     placeholder="Enter password"
//                     value={values.pass}
//                     onChange={(e) => handleInputChange(e, "pass")}
//                   />
//                 </FormGroup>
//                 <div className={styles.footer}>
//                   <b className={styles.error}>{errorMsg}</b>
//                   <Button
//                     color="primary"
//                     onClick={handleSubmission}
//                     disabled={submitButtonDisabled}
//                   >
//                     Signup
//                   </Button>
//                   <p>
//                     Already have an account?{" "}
//                     <span>
//                       <Link to="/login">Login</Link>
//                     </span>
//                   </p>
//                 </div>
//               </Form>
//             </div>
//           </Col>
//           <Col md={6}>
//             <div className={styles.imageContainer}>
//               <img
//                 src={signupImage}
//                 alt="Signup"
//                 className={styles.signupImage}
//               />
//             </div>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// }

// export default Signup;




import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import styles from "./Signup.module.css";
import signupImage from "../../assest/signup_undraw.svg"; // Replace with your image path

function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  // Handle form submission
  const handleSubmission = async () => {
    if (!values.name || !values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");
    setSubmitButtonDisabled(true);

    try {
      // Firebase Signup
      const res = await createUserWithEmailAndPassword(auth, values.email, values.pass);
      const user = res.user;
      await updateProfile(user, { displayName: values.name });
      
      // Send email verification
      await sendEmailVerification(user);
      alert("Check your email for verification and verify before logging in.");
      setSubmitButtonDisabled(false);
      navigate("/");
  
    } catch (err) {
      setErrorMsg(err.message);
      setSubmitButtonDisabled(false);
    }
  };
  
  // Handle input change
  const handleInputChange = (event, field) => {
    const { value } = event.target;
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <Container fluid>
        <Row>
          <Col md={{ size: 4, offset: 1 }}>
            <div className={styles.innerBox}>
              <h1 className={styles.heading}>Signup</h1>
              <Form>
                <FormGroup>
                  <Label for="name">Name</Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter your name"
                    value={values.name}
                    onChange={(e) => handleInputChange(e, "name")}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="Enter email address"
                    value={values.email}
                    onChange={(e) => handleInputChange(e, "email")}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="password">Password</Label>
                  <Input
                    type="password"
                    id="password"
                    placeholder="Enter password"
                    value={values.pass}
                    onChange={(e) => handleInputChange(e, "pass")}
                  />
                </FormGroup>
                <div className={styles.footer}>
                  <b className={styles.error}>{errorMsg}</b>
                  <Button
                    color="primary"
                    onClick={handleSubmission}
                    disabled={submitButtonDisabled}
                  >
                    Signup
                  </Button>
                  <p>
                    Already have an account?{" "}
                    <span>
                      <Link to="/login">Login</Link>
                    </span>
                  </p>
                </div>
              </Form>
            </div>
          </Col>
          <Col md={6}>
            <div className={styles.imageContainer}>
              <img
                src={signupImage}
                alt="Signup"
                className={styles.signupImage}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Signup;