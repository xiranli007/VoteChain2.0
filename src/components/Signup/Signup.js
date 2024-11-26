
// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   createUserWithEmailAndPassword,
//   updateProfile,
//   sendEmailVerification,
// } from "firebase/auth";
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
      
//       // Send email verification
//       await sendEmailVerification(user);
//       alert("Check your email for verification and verify before logging in.");
//       setSubmitButtonDisabled(false);
//       navigate("/");
  
//     } catch (err) {
//       setErrorMsg(err.message);
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
import { useAuth } from "../../context/AuthContext";
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
  const { signup } = useAuth(); 
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [privateKey, setPrivateKey] = useState(null);

  // Handle form submission
  const handleSubmission = async () => {
    if (!values.name || !values.email || !values.password) {
      setErrorMsg("Fill all fields");
      return;
    }

    setErrorMsg("");
    setSubmitButtonDisabled(true);

    try {
      const { user, privateKey } = await signup(values.email, values.password, values.name);
      console.log (privateKey)

      // Display private key to the user
      setPrivateKey(privateKey);

      // Clear input fields
      setValues({ name: "", email: "", password: "" });

      // Notify the user
      alert(
        "Signup successful! Check your email for verification and save your private key securely."
      );
  
    } catch (err) {
      console.error(err);
      setErrorMsg("Signup failed. Please try again.");
    } finally {
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
              {privateKey && ( // Display private key after signup
                <div className={styles.privateKeyBox}>
                  <h4>Save Your Private Key</h4>
                  <p>
                    This is your private key. Please save it securely. You will not see this again:
                  </p>
                  <pre className={styles.privateKeyDisplay}>
                    {privateKey}
                  </pre>
                  <Button
                    color="success"
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([privateKey], { type: "text/plain" });
                      element.href = URL.createObjectURL(file);
                      element.download = "privateKey.txt";
                      document.body.appendChild(element);
                      element.click();
                    }}
                  >
                    Download Private Key
                  </Button>{" "}
                  <Button
                    color="secondary"
                    onClick={() => {
                      navigator.clipboard.writeText(privateKey);
                      alert("Private key copied to clipboard.");
                    }}
                  >
                    Copy to Clipboard
                  </Button>
                </div>
              )}
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
                    value={values.password}
                    onChange={(e) => handleInputChange(e, "password")}
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