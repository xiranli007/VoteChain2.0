import React, { useContext, useEffect, useState } from 'react'
import { sendRequest } from '../utils/ResDbClient'
import { generatePath, useNavigate } from "react-router-dom";
import { GENERATE_KEYS } from '../utils/ResDbApis'
import { set, ref, get } from 'firebase/database'
import { auth, database} from "../firebase";
import emailjs from "emailjs-com"; // Email service for OTP


export const AuthContext = React.createContext()
// Function to generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [loading, setLoading] = useState(true)
    const [userKeys, setUserKeys] = useState(null);
    const navigate = useNavigate();

  
    async function signup(email, password, name) {

        try {
            // Step 1: create user with email and password
            const response = await auth.createUserWithEmailAndPassword(email, password);
            const user = response.user
            const userId = user.uid

            // Step 2: Update user profile with display name
            await user.updateProfile({ displayName: name });

            // Step 3: Send email verification
            const actionCodeSettings = {
                url: "http://localhost:3000/vote-chain#/login",
                handleCodeInApp: true,
            }
            await user.sendEmailVerification(actionCodeSettings);

            // Step 4: Generate keys
            const keyResponse = await sendRequest(GENERATE_KEYS);
            console.log(keyResponse)
            const { publicKey, privateKey } = keyResponse.data.generateKeys;
            
            console.log("Keys generated:", { publicKey, privateKey });

           
            // Step 5: Store the public key in Firebase Database
            console.log("Storing public key in database...");
            await set(ref(database, "users/" + userId), {
            publicKey: publicKey,
            });
            await fetchKeys(userId);
            console.log("Signup complete. Returning user and privateKey.");
            // return user data and private key
            return { user, privateKey };
            } catch(error) {
                console.error("Failed to sign up:", error.message);
                throw error;
            }
    }
  
  
    async function login(email, password) {
        try {
        // perform firebase email and password log in 
        const response = await auth.signInWithEmailAndPassword(email, password);
        const user = response.user
        
        // check if the user email in verified
        if (!user.emailVerified) {
            await auth.signOut();
            return { success: false, message :"please verifiy your email before logging in."}
        }
        // generate OTP
        const otpCode = generateOtp()
        await emailjs.send(
            "service_ung542x",
            "template_pxz840y",
            { to_email: email, otp: otpCode },
            "ssHxJNhH5p4KKMeFo"
          );

        // fetch public key for user 
        const userId = user.uid;
        await fetchKeys(userId);
        return { success: true, otpCode };
        } catch (error) {
        console.error("Login failed:", error);
        return { success: false, message: error.message };
        }
    }
    
    async function fetchKeys(userId) {
      const dbRef = ref(database, 'users/'+userId);
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
          const data = snapshot.val();
          setUserKeys(data);
      } else {
          setUserKeys(null); 
      }
      return;
    }
  
  
    function logout() {
      return auth.signOut()
    }
  
    function resetPassword(email) {
      return auth.sendPasswordResetEmail(email)
    }
  
    function updateEmail(email) {
      return currentUser.updateEmail(email)
    }
  
    function updatePassword(password) {
      return currentUser.updatePassword(password)
    }
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        setCurrentUser(user)
        fetchKeys(user?.uid);
        setLoading(false)
      })
  
      return unsubscribe
    }, [])
  
    const value = {
      currentUser,
      userKeys,
      login,
      signup,
      logout,
      resetPassword,
      updateEmail,
      updatePassword
    }
  
    return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
    )
  }