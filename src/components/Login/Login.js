// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { signInWithEmailAndPassword, RecaptchaVerifier, PhoneAuthProvider, PhoneMultiFactorGenerator } from "firebase/auth";
// import { auth } from "../../firebase"; // Adjust path as necessary
// import { Container, Row, Col, Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";
// import styles from "./Login.module.css";
// import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
// import loginImage from "../../assest/login_undraw.svg";

// function Login() {
//   const navigate = useNavigate();
//   const [values, setValues] = useState({ email: "", pass: "" });
//   const [errorMsg, setErrorMsg] = useState("");
//   const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
//   const [is2FAModalOpen, set2FAModalOpen] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [verificationId, setVerificationId] = useState("");
//   const [appVerifier, setAppVerifier] = useState(null);

//   useEffect(() => {
//     if (is2FAModalOpen && !appVerifier) {
//       const verifier = new RecaptchaVerifier("recaptcha-container", {
//         size: "invisible",
//         callback: (response) => {
//           console.log("reCAPTCHA verified:", response);
//         },
//         "expired-callback": () => {
//           alert("reCAPTCHA expired. Please try again.");
//         },
//       }, auth);
//       setAppVerifier(verifier);
//     }
//   }, [is2FAModalOpen]);

//   const handleSubmission = async () => {
//     if (!values.email || !values.pass) {
//       setErrorMsg("Fill all fields");
//       return;
//     }
//     setErrorMsg("");
//     setSubmitButtonDisabled(true);

//     try {
//       const res = await signInWithEmailAndPassword(auth, values.email, values.pass);
//       const user = res.user;

//       if (user.multiFactor.enrolledFactors.length === 0) {
//         set2FAModalOpen(true);
//       } else {
//         navigate("/elections");
//       }
//       setSubmitButtonDisabled(false);
//     } catch (err) {
//       setSubmitButtonDisabled(false);
//       setErrorMsg(err.message);
//     }
//   };

//   const enable2FA = async () => {
//     if (!appVerifier) return;

//     try {
//       const user = auth.currentUser;
//       const multiFactorSession = await user.multiFactor.getSession();
//       const phoneAuthProvider = new PhoneAuthProvider(auth);
//       const id = await phoneAuthProvider.verifyPhoneNumber(
//         { phoneNumber, session: multiFactorSession },
//         appVerifier
//       );
//       setVerificationId(id);
//       alert("Verification code sent to your phone.");
//     } catch (error) {
//       console.error(error);
//       alert("Error enabling 2FA.");
//     }
//   };

//   const verifyCode = async () => {
//     try {
//       const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
//       const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
//       const user = auth.currentUser;

//       await user.multiFactor.enroll(multiFactorAssertion, "Your Phone");
//       alert("2FA enabled successfully!");
//       set2FAModalOpen(false);
//       navigate("/elections");
//     } catch (error) {
//       console.error(error);
//       alert("Invalid verification code.");
//     }
//   };

//   return (
//     <Container className={styles.container}>
//       <Row className="justify-content-center">
//         <Col md="6" className={styles.imageCol} style={{ paddingRight: "50px" }}>
//           <div className={styles.imageContainer}>
//             <img src={loginImage} alt="Login" className={styles.loginImage} />
//           </div>
//         </Col>
//         <Col md="6">
//           <div className={styles.innerBox}>
//             <h1 className={styles.heading}>Login</h1>
//             <Form>
//               <FormGroup>
//                 <Label for="email">Email</Label>
//                 <Input
//                   type="email"
//                   id="email"
//                   placeholder="Enter email address"
//                   value={values.email}
//                   onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
//                 />
//               </FormGroup>
//               <FormGroup>
//                 <Label for="password">Password</Label>
//                 <Input
//                   type="password"
//                   id="password"
//                   placeholder="Enter Password"
//                   value={values.pass}
//                   onChange={(event) => setValues((prev) => ({ ...prev, pass: event.target.value }))}
//                 />
//               </FormGroup>

//               {errorMsg && <Alert color="danger">Invalid Credentials</Alert>}
//               <div className={styles.footer}>
//                 <Button color="primary" disabled={submitButtonDisabled} onClick={handleSubmission}>
//                   {submitButtonDisabled ? "Logging in..." : "Login"}
//                 </Button>
//                 <p>
//                   Already have an account?{" "}
//                   <span>
//                     <Link to="/signup">Signup</Link>
//                   </span>
//                 </p>
//               </div>
//             </Form>
//           </div>
//         </Col>
//       </Row>

//       {/* 2FA Modal */}
//       <Modal isOpen={is2FAModalOpen}>
//         <ModalHeader>Enable Two-Factor Authentication</ModalHeader>
//         <ModalBody>
//           <FormGroup>
//             <Label for="phone">Phone Number</Label>
//             <Input
//               type="tel"
//               id="phone"
//               placeholder="+1234567890"
//               value={phoneNumber}
//               onChange={(e) => setPhoneNumber(e.target.value)}
//             />
//           </FormGroup>
//           <Button color="primary" onClick={enable2FA}>
//             Send Verification Code
//           </Button>

//           <FormGroup className="mt-3">
//             <Label for="verificationCode">Verification Code</Label>
//             <Input
//               type="text"
//               id="verificationCode"
//               placeholder="Enter verification code"
//               value={verificationCode}
//               onChange={(e) => setVerificationCode(e.target.value)}
//             />
//           </FormGroup>
//           <div id="recaptcha-container"></div>
//         </ModalBody>
//         <ModalFooter>
//           <Button color="primary" onClick={verifyCode}>Verify & Enable 2FA</Button>
//           <Button color="secondary" onClick={() => set2FAModalOpen(false)}>Cancel</Button>
//         </ModalFooter>
//       </Modal>
//     </Container>
//   );
// }

// export default Login;
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  RecaptchaVerifier,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
} from "firebase/auth";
import { auth } from "../../firebase"; // Adjust path as necessary
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from "reactstrap";
import styles from "./Login.module.css";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import loginImage from "../../assest/login_undraw.svg";

function Login() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ email: "", pass: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [is2FAModalOpen, set2FAModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [appVerifier, setAppVerifier] = useState(null);

  useEffect(() => {
    if (is2FAModalOpen && !appVerifier) {
      const verifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA verified:", response);
          },
          "expired-callback": () => {
            alert("reCAPTCHA expired. Please try again.");
          },
        },
        auth
      );
      setAppVerifier(verifier);
    }
  }, [is2FAModalOpen]);

  // const handleSubmission = async () => {
  //   if (!values.email || !values.pass) {
  //     setErrorMsg("Fill all fields");
  //     return;
  //   }
  //   setErrorMsg("");
  //   setSubmitButtonDisabled(true);

  //   try {
  //     const res = await signInWithEmailAndPassword(auth, values.email, values.pass);
  //     const user = res.user;

  //     // Check if the user's email is verified
  //     if (!user.emailVerified) {
  //       alert("Please verify your email before logging in.");
  //       await auth.signOut(); // Sign out unverified user
  //       setSubmitButtonDisabled(false);
  //       return;
  //     }

  //     // Check if the user has enrolled in MFA
  //     if (user.multiFactor.enrolledFactors.length === 0) {
  //       set2FAModalOpen(true); // Show 2FA modal if no MFA is set up
  //     } else {
  //       navigate("/elections"); // Navigate to the main page if MFA is already set up
  //     }
  //     setSubmitButtonDisabled(false);
  //   } catch (err) {
  //     setSubmitButtonDisabled(false);
  //     setErrorMsg(err.message);
  //   }
  // };
  const handleSubmission = async () => {
    if (!values.email || !values.pass) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    setErrorMsg("");
    setSubmitButtonDisabled(true);
  
    try {
      // Attempt to sign in with email and password
      const res = await signInWithEmailAndPassword(auth, values.email, values.pass);
      const user = res.user;
  
      // Check if the user's email is verified
      if (!user.emailVerified) {
        setErrorMsg("Please verify your email before logging in.");
        await auth.signOut(); // Sign out the unverified user
        setSubmitButtonDisabled(false);
        return;
      }
  
      // If email is verified, navigate to the main page
      navigate("/elections");
    } catch (err) {
      console.error("Login error:", err);
      // Display specific error messages
      if (err.code === "auth/wrong-password") {
        setErrorMsg("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setErrorMsg("No account found with this email.");
      } else if (err.code === "auth/too-many-requests") {
        setErrorMsg("Too many unsuccessful attempts. Please try again later.");
      } else {
        setErrorMsg("Failed to log in. Please check your credentials.");
      }
    } finally {
      setSubmitButtonDisabled(false);
    }
  };
  
  

  const enable2FA = async () => {
    if (!appVerifier) return;

    try {
      const user = auth.currentUser;
      const multiFactorSession = await user.multiFactor.getSession();
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const id = await phoneAuthProvider.verifyPhoneNumber(
        { phoneNumber, session: multiFactorSession },
        appVerifier
      );
      setVerificationId(id);
      alert("Verification code sent to your phone.");
    } catch (error) {
      console.error(error);
      alert("Error enabling 2FA.");
    }
  };

  const verifyCode = async () => {
    try {
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      const user = auth.currentUser;

      await user.multiFactor.enroll(multiFactorAssertion, "Your Phone");
      alert("2FA enabled successfully!");
      set2FAModalOpen(false);
      navigate("/elections");
    } catch (error) {
      console.error(error);
      alert("Invalid verification code.");
    }
  };

  return (
    <Container className={styles.container}>
      <Row className="justify-content-center">
        <Col md="6" className={styles.imageCol} style={{ paddingRight: "50px" }}>
          <div className={styles.imageContainer}>
            <img src={loginImage} alt="Login" className={styles.loginImage} />
          </div>
        </Col>
        <Col md="6">
          <div className={styles.innerBox}>
            <h1 className={styles.heading}>Login</h1>
            <Form>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Enter email address"
                  value={values.email}
                  onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
                />
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  placeholder="Enter Password"
                  value={values.pass}
                  onChange={(event) => setValues((prev) => ({ ...prev, pass: event.target.value }))}
                />
              </FormGroup>

              {errorMsg && <Alert color="danger">Invalid Credentials</Alert>}
              <div className={styles.footer}>
                <Button color="primary" disabled={submitButtonDisabled} onClick={handleSubmission}>
                  {submitButtonDisabled ? "Logging in..." : "Login"}
                </Button>
                <p>
                  Already have an account?{" "}
                  <span>
                    <Link to="/signup">Signup</Link>
                  </span>
                </p>
              </div>
            </Form>
          </div>
        </Col>
      </Row>

      {/* 2FA Modal */}
      <Modal isOpen={is2FAModalOpen}>
        <ModalHeader>Enable Two-Factor Authentication</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </FormGroup>
          <Button color="primary" onClick={enable2FA}>
            Send Verification Code
          </Button>

          <FormGroup className="mt-3">
            <Label for="verificationCode">Verification Code</Label>
            <Input
              type="text"
              id="verificationCode"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </FormGroup>
          <div id="recaptcha-container"></div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={verifyCode}>Verify & Enable 2FA</Button>
          <Button color="secondary" onClick={() => set2FAModalOpen(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
}

export default Login;
