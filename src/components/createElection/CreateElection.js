import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Grid,
    Card,
    CardContent,
  } from "@mui/material";
import { sendRequest } from "../../utils/ResDbClient";
import { POST_TRANSACTION } from "../../utils/ResDbApis";
import { useAuth } from "../../context/AuthContext";
import CreateElectionImage from "../../assest/create_election.svg"; // Import the image
import Navbar from "../Navbar2";
import Footer from "../Footer2";


function CreateElectionPage() {
    const { currentUser, fetchKeys } = useAuth();
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        logo: "",
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        candidates: [{ name: "", votes: 0 }, { name: "", votes: 0 }, { name: "", votes: 0 }],
    });
    
    const [userPublicKey, setUserPublicKey] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
    const [previewImage, setPreviewImage] = useState("")
    

    const navigate = useNavigate();

    // Fetch authenticated user's public key from Firebase
    useEffect(() => {
        const fetchUserPublicKey = async () => {
          if (!currentUser) {
            setErrorMsg("User is not logged in.");
            return;
          }
        if (!userPublicKey){
            const publicKey = await fetchKeys(currentUser.uid);
            console.log(`public sucessfully obtained: ${publicKey}`)
            setUserPublicKey(publicKey)
        }
        
        };
    
        fetchUserPublicKey();
      }, [currentUser, fetchKeys, userPublicKey]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };
  
      // Date validation
      if (name === "startDate" && updatedData.endDate) {
        if (new Date(updatedData.endDate) < new Date(value)) {
          setErrorMsg("End date must be after the start date.");
        } else {
          setErrorMsg("");
        }
      }
  
      if (name === "endDate" && updatedData.startDate) {
        if (new Date(value) < new Date(updatedData.startDate)) {
          setErrorMsg("End date must be after the start date.");
        } else {
          setErrorMsg("");
        }
      }
  
      return updatedData;
    });
  };

   // Handle candidate input changes
   const handleCandidateChange = (index, value) => {
    setFormData((prevData) => {
      const updatedCandidates = [...prevData.candidates];
      updatedCandidates[index].name = value;
      return { ...prevData, candidates: updatedCandidates };
    });
  };
    // Handle logo upload
    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result);
            setFormData((prevData) => ({ ...prevData, logo: reader.result }));
          };
          reader.readAsDataURL(file);
        }
    };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, logo, title, description, startDate, endDate, candidates } = formData;

    // Validate inputs
    if (!id || !name || !title || !description || !startDate || !endDate) {
      setErrorMsg("All fields except logo are required.");
      return;
    }
    if (!candidates.every((candidate) => candidate.name.trim())) {
        setErrorMsg("Each candidate must have a name.");
        return;
      }

    if (!userPublicKey) {
      setErrorMsg("User public key not available. Cannot create election.");
      return;
    }

    const privateKey = prompt("Enter your private key to sign the transaction:");
    if (!privateKey) {
      setErrorMsg("Private key is required to create the election.");
      return;
    }

    setErrorMsg("");
    setSubmitButtonDisabled(true);

    try {
      // Prepare election data to save in ResilientDB
      const electionData = {
        id,
        name,
        logo,
        title,
        description,
        dates: {
          startDate,
          endDate,
        },
        candidates,
      };


      // encapsulate the keys into metadata
      const metadata = {
        signerPublicKey: userPublicKey,
        signerPrivateKey: privateKey,
        recipientPublicKey: userPublicKey,
      };
      console.log("Signer Public Key:", metadata?.signerPublicKey);
      console.log("Signer Private Key:", metadata?.signerPrivateKey);
      console.log("Recipient Public Key:", metadata?.recipientPublicKey);
      const serilizedElectionData = JSON.stringify(electionData)
      console.log(serilizedElectionData)
      
      const res = await sendRequest(
        POST_TRANSACTION(metadata, serilizedElectionData)
      );

    //   console.log(res)
      if (res && res.data && res.data.postTransaction) {
        setSuccessMsg("Election created successfully!");
        navigate("/elections");
      } else {
        throw new Error("Failed to save election to ResilientDB.");
      }
    } catch (error) {
      console.error("Error creating election:", error);
      setErrorMsg("Failed to create the election. Please try again.");
    } finally {
      setSubmitButtonDisabled(false);
    }
  };

return (
    <>
      <Navbar />
      <Card sx={{ margin: 3, padding: 3 }}>
        <Box p={3} maxWidth="lg" mx="auto">
         
          <Grid container spacing={4} alignItems="center">
            {/* Left Side - Image */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" align="center" marginTop={10} gutterBottom>
                Create Election
              </Typography>
              <Box display="flex" justifyContent="center">
                <img
                  src={CreateElectionImage}
                  alt="Create Election Illustration"
                  style={{ width: "100%", maxHeight: "800px", objectFit: "contain" }}
                />
              </Box>
            </Grid>
  
            {/* Right Side - Form */}
            <Grid item xs={12} md={6}>
              {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
              {successMsg && <Alert severity="success">{successMsg}</Alert>}
              <Box>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Election ID"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Logo URL"
                    name="logo"
                    placeholder="Enter URL for logo (optional)"
                    value={formData.logo}
                    onChange={handleInputChange}
                  />
                  {formData.logo && (
                    <Box mt={2} textAlign="center">
                      <img
                        src={formData.logo}
                        alt="Logo Preview"
                        style={{
                          width: "100%",
                          maxWidth: "200px",
                          height: "auto",
                          borderRadius: "8px",
                          border: "1px solid #ccc",
                        }}
                      />
                    </Box>
                  )}
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Description"
                    name="description"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Start Date"
                        name="startDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="End Date"
                        name="endDate"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={formData.endDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Grid>
                  </Grid>
                  <Typography variant="h6" gutterBottom>
                    Candidates
                  </Typography>
                  <Grid container spacing={2}>
                    {formData.candidates.map((candidate, index) => (
                      <Grid item xs={12} key={index}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label={`Candidate ${index + 1}`}
                          value={candidate.name}
                          onChange={(e) =>
                            handleCandidateChange(index, e.target.value)
                          }
                          required
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Box mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={submitButtonDisabled}
                    >
                      Create Election
                    </Button>
                  </Box>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Box>
        <Footer />
      </Card>
    </>
  );}
export default CreateElectionPage;