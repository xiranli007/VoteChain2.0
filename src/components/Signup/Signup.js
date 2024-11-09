// import React, { useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   createUserWithEmailAndPassword,
//   updateProfile,
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";
// import { auth } from "../../firebase"; // Ensure `auth` is correctly imported
// import {
//   Container,
//   Row,
//   Col,
//   Form,
//   FormGroup,
//   Label,
//   Input,
//   Button,
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "reactstrap";
// import styles from "./Signup.module.css";
// import signupImage from "../../assest/signup_undraw.svg"; // Replace with your image path
// import toast, { Toaster } from 'react-hot-toast';

// function Signup() {
//   const navigate = useNavigate();
//   const [values, setValues] = useState({ name: "", email: "", pass: "" });
//   const [errorMsg, setErrorMsg] = useState("");
//   const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
//   const [is2FAModalOpen, set2FAModalOpen] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [verificationId, setVerificationId] = useState("");
//   const [loading, setLoading] = useState(false);

//   const recaptchaVerifier = useRef(null);

//   const handleSubmission = async () => {
//     if (!values.name || !values.email || !values.pass) {
//       setErrorMsg("Fill all fields");
//       return;
//     }
//     setErrorMsg("");
//     setSubmitButtonDisabled(true);

//     try {
//       const res = await createUserWithEmailAndPassword(auth, values.email, values.pass);
//       const user = res.user;
//       await updateProfile(user, { displayName: values.name });

//       // Open 2FA modal after successful signup
//       set2FAModalOpen(true);
//       setSubmitButtonDisabled(false);
//     } catch (err) {
//       setSubmitButtonDisabled(false);
//       setErrorMsg(err.message);
//     }
//   };

//   const onCaptchVerify = () => {
//     if (!recaptchaVerifier.current) {
//       recaptchaVerifier.current = new RecaptchaVerifier(
//         auth,
//         "recaptcha-container",
//         { size: "invisible" },
      
//       );
//     }
//   };

//   const enable2FA = async () => {
//     setLoading(true);
//     onCaptchVerify();
//     const appVerifier = recaptchaVerifier.current;

//     const formattedPhone = `+${phoneNumber}`;

//     try {
//       const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
//       setVerificationId(confirmationResult.verificationId);
//       setLoading(false);
//       toast.success("OTP sent successfully!");
//     } catch (error) {
//       console.error("Error enabling 2FA:", error);
//       setLoading(false);
//       toast.error("Error sending OTP. Please try again.");
//     }
//   };

//   const verifyCode = async () => {
//     setLoading(true);
//     const confirmationResult = window.confirmationResult;

//     try {
//       await confirmationResult.confirm(verificationCode);
//       toast.success("2FA enabled successfully!");
//       set2FAModalOpen(false);
//       navigate("/"); // Redirect after 2FA setup
//     } catch (error) {
//       console.error("Error verifying code:", error);
//       setLoading(false);
//       toast.error("Invalid verification code.");
//     }
//   };

//   const handleInputChange = (event, field) => {
//     const { value } = event.target;
//     setValues((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   return (
//     <div className={styles.container}>
//       <Toaster position="top-right" reverseOrder={false} />
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
//               <img src={signupImage} alt="Signup" className={styles.signupImage} />
//             </div>
//           </Col>
//         </Row>
//       </Container>

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
//           <Button color="primary" onClick={enable2FA} disabled={loading}>
//             {loading ? "Sending OTP..." : "Send Verification Code"}
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
//           <Button color="primary" onClick={verifyCode} disabled={loading}>
//             {loading ? "Verifying..." : "Verify & Enable 2FA"}
//           </Button>
//           <Button color="secondary" onClick={() => set2FAModalOpen(false)}>
//             Cancel
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </div>
//   );
// }

// export default Signup;

// // import {At, GoogleLogo, Password} from "phosphor-react";
// // import { signInWithGoogle } from "../../authentication";
// // import { notify } from "../../utils/notify";
// // import { FormEvent, useRef } from "react";


// // export default function Signup(){
// //   const email = useRef<HTMLInputElement>(null);
// //   const password = useRef<HTMLInputElement>(null);


// //   async function loginWithGoogle() {
// //     const response = await signInWithGoogle();

// //     if (response !== true) {
// //       notify('Something went wrong')
// //     }
    
// //   }

// //   async function createAnAccount(event: FormEvent<HTMLFormElement>) {
// //     event.preventDefault();

// //     if (email.current && password.current) {
// //         const response = await signUp(email.current.value, password.current.value);

// //         if (!response) {
// //             notify('Something went wrong.');
// //         }
// //     }
// // }

// //   return (
// //     <div className="bg-white md:w-[500px] rounded-xl p-8">
// //         <h2 className="mt-20 mb-8 text-3xl font-bold text-center text-gray-800">Create an account</h2>
// //         <button
// //             onClick={loginWithGoogle}
// //             className="rounded-xl relative flex gap-x-4 mb-8 text-black h-11 w-full items-center justify-center px-6 border border-gray-500">
// //             <GoogleLogo className='w-6 h-6'/>
// //             <span className="relative text-base font-light">with Google</span>
// //         </button>
// //         <p className='text-center mb-8'>Or</p>
// //         <form
// //             className="space-y-8"
// //             onSubmit={createAnAccount}
// //         >
// //             <div className="space-y-4">
// //                 <div className="relative flex items-center">
// //                     <At className='w-6 h-6 absolute left-4 inset-y-0 my-auto'/>
// //                     <input
// //                         ref={email}
// //                         type="email"
// //                         name="email"
// //                         placeholder="Insert your email"
// //                         className="focus:outline-none
// //                                     block w-full rounded-xl placeholder-gray-500
// //                                     bg-gray-100 pl-12 pr-4 h-12 text-gray-600 transition
// //                                     duration-300 invalid:ring-2 invalid:ring-red-400
// //                                     focus:ring-2 focus:ring-black"
// //                     />
// //                 </div>
// //             </div>
// //             <div className="space-y-4">
// //                 <div className="relative flex items-center">
// //                     <Password className='w-6 h-6 absolute left-4 inset-y-0 my-auto'/>
// //                     <input
// //                         ref={password}
// //                         type="password"
// //                         name="password"
// //                         id="password"
// //                         placeholder="Insert your password"
// //                         className="focus:outline-none block w-full rounded-xl placeholder-gray-500 bg-gray-100 pl-12 pr-4 h-12 text-gray-600 transition duration-300 invalid:ring-2 invalid:ring-red-400 focus:ring-2 focus:ring-black"
// //                     />
// //                 </div>
// //             </div>
// //             <button type="submit"
// //                     className="bg-black rounded-xl relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95">
// //                             <span
// //                                 className="relative text-base font-light text-white">Sign Up</span>
// //             </button>
// //             <p className="border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
// //                 Do you have an account ?<Link href="/login" className="text-black"> Login</Link>
// //             </p>
// //         </form>
// //     </div>
// //   )
// // }

// import React, { useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//     createUserWithEmailAndPassword,
//     updateProfile,
//     RecaptchaVerifier,
//     PhoneAuthProvider,
//     PhoneMultiFactorGenerator,
//     sendEmailVerification,
//   } from "firebase/auth";
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
//   Modal,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "reactstrap";
// import styles from "./Signup.module.css";
// import signupImage from "/VoteChain2/src/assest/signup_undraw.svg"; // replace with your image path
// import toast, { Toaster } from "react-hot-toast";

// function Signup() {
//   const navigate = useNavigate();
//   const [values, setValues] = useState({ name: "", email: "", pass: "" });
//   const [errorMsg, setErrorMsg] = useState("");
//   const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
//   const [is2FAModalOpen, set2FAModalOpen] = useState(false);
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [verificationCode, setVerificationCode] = useState("");
//   const [verificationId, setVerificationId] = useState("");
//   const [loading, setLoading] = useState(false);

//   const recaptchaVerifier = useRef(null);

//   const handleSubmission = async () => {
//     if (!values.name || !values.email || !values.pass) {
//       setErrorMsg("Fill all fields");
//       return;
//     }
//     setErrorMsg("");
//     setSubmitButtonDisabled(true);

//     try {
//       const res = await createUserWithEmailAndPassword(auth, values.email, values.pass);
//       const user = res.user;
//       await updateProfile(user, { displayName: values.name });
//       await sendEmailVerification(user);

//       alert("Check your email for verification!");

//       set2FAModalOpen(true); // Open 2FA modal after successful signup
//       setSubmitButtonDisabled(false);
//     } catch (err) {
//       setSubmitButtonDisabled(false);
//       setErrorMsg(err.message);
//     }
//   };

//   const onCaptchVerify = () => {
//     if (!recaptchaVerifier.current) {
//       recaptchaVerifier.current = new RecaptchaVerifier(
//         auth,
//         "2fa-captcha",
//         { size: "invisible" },
//       );
//     }
//   };

//   const enable2FA = async () => {
//     setLoading(true);
//     onCaptchVerify();
//     const appVerifier = recaptchaVerifier.current;

//     try {
//       const user = auth.currentUser;
//       const session = await user.multiFactor.getSession();

//       const phoneAuthProvider = new PhoneAuthProvider(auth);
//       const verificationId = await phoneAuthProvider.verifyPhoneNumber(
//         { phoneNumber, session },
//         appVerifier
//       );

//       setVerificationId(verificationId);
//       setLoading(false);
//       toast.success("OTP sent successfully!");
//     } catch (error) {
//       console.error("Error enabling 2FA:", error);
//       setLoading(false);
//       toast.error("Error sending OTP. Please try again.");
//     }
//   };

//   const verifyCode = async () => {
//     setLoading(true);

//     try {
//       const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
//       const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

//       const user = auth.currentUser;
//       await user.multiFactor.enroll(multiFactorAssertion, "phone number");

//       toast.success("2FA enabled successfully!");
//       set2FAModalOpen(false);
//       navigate("/"); // Redirect after 2FA setup
//     } catch (error) {
//       console.error("Error verifying code:", error);
//       setLoading(false);
//       toast.error("Invalid verification code.");
//     }
//   };

//   const handleInputChange = (event, field) => {
//     const { value } = event.target;
//     setValues((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   return (
//     <div className={styles.container}>
//       <Toaster position="top-right" reverseOrder={false} />
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
//                     <Link to="/login">Login</Link>
//                   </p>
//                 </div>
//               </Form>
//             </div>
//           </Col>
//           <Col md={6}>
//             <div className={styles.imageContainer}>
//               <img src={signupImage} alt="Signup" className={styles.signupImage} />
//             </div>
//           </Col>
//         </Row>
//       </Container>

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
//           <Button color="primary" onClick={enable2FA} disabled={loading}>
//             {loading ? "Sending OTP..." : "Send Verification Code"}
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
//           <div id="2fa-captcha"></div>
//         </ModalBody>
//         <ModalFooter>
//           <Button color="primary" onClick={verifyCode} disabled={loading}>
//             {loading ? "Verifying..." : "Verify & Enable 2FA"}
//           </Button>
//           <Button color="secondary" onClick={() => set2FAModalOpen(false)}>
//             Cancel
//           </Button>
//         </ModalFooter>
//       </Modal>
//     </div>
//   );
// }

// export default Signup;
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    RecaptchaVerifier,
    PhoneAuthProvider,
    PhoneMultiFactorGenerator,
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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import styles from "./Signup.module.css";
import signupImage from "/VoteChain2/src/assest/signup_undraw.svg"; // replace with your image path
import toast, { Toaster } from "react-hot-toast";

function Signup() {
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", pass: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
  const [is2FAModalOpen, set2FAModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [loading, setLoading] = useState(false);

  const recaptchaVerifier = useRef(null);

  const handleSubmission = async () => {
    if (!values.name || !values.email || !values.pass) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");
    setSubmitButtonDisabled(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, values.email, values.pass);
      const user = res.user;
      await updateProfile(user, { displayName: values.name });
      
      // Send email verification
      await sendEmailVerification(user);
      alert("Check your email for verification and verify before logging in.");

      set2FAModalOpen(true); // Open 2FA modal after successful signup
      setSubmitButtonDisabled(false);
    } catch (err) {
      setSubmitButtonDisabled(false);
      setErrorMsg(err.message);
    }
  };

  const onCaptchVerify = () => {
    if (!recaptchaVerifier.current) {
      recaptchaVerifier.current = new RecaptchaVerifier(
        "2fa-captcha",
        { size: "invisible" },
        auth
      );
    }
  };

  const enable2FA = async () => {
    setLoading(true);
    onCaptchVerify();
    const appVerifier = recaptchaVerifier.current;

    try {
      const user = auth.currentUser;
      const session = await user.multiFactor.getSession();

      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        { phoneNumber, session },
        appVerifier
      );

      setVerificationId(verificationId);
      setLoading(false);
      toast.success("OTP sent successfully!");
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      setLoading(false);
      toast.error("Error sending OTP. Please try again.");
    }
  };

  const verifyCode = async () => {
    setLoading(true);

    try {
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

      const user = auth.currentUser;
      await user.multiFactor.enroll(multiFactorAssertion, "phone number");

      toast.success("2FA enabled successfully!");
      set2FAModalOpen(false);
      navigate("/"); // Redirect after 2FA setup
    } catch (error) {
      console.error("Error verifying code:", error);
      setLoading(false);
      toast.error("Invalid verification code.");
    }
  };

  const handleInputChange = (event, field) => {
    const { value } = event.target;
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-right" reverseOrder={false} />
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
                    <Link to="/login">Login</Link>
                  </p>
                </div>
              </Form>
            </div>
          </Col>
          <Col md={6}>
            <div className={styles.imageContainer}>
              <img src={signupImage} alt="Signup" className={styles.signupImage} />
            </div>
          </Col>
        </Row>
      </Container>

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
          <Button color="primary" onClick={enable2FA} disabled={loading}>
            {loading ? "Sending OTP..." : "Send Verification Code"}
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
          <div id="2fa-captcha"></div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={verifyCode} disabled={loading}>
            {loading ? "Verifying..." : "Verify & Enable 2FA"}
          </Button>
          <Button color="secondary" onClick={() => set2FAModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default Signup;
