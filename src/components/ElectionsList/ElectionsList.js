// import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
// import Container from "@mui/material/Container";
// import Typography from "@mui/material/Typography";
// import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
// import CardContent from "@mui/material/CardContent";
// import Grid from "@mui/material/Grid";
// import Box from "@mui/material/Box";
// import Navbar from "../Navbar2";
// import Footer from "../Footer2";
// import withAuthProtection from "../AuthProtect/AuthProtect";
// // import election_1 from '../../assest/election_1.jpg';
// // import election_2 from '../../assest/election_2.jpg';
// // import election_4 from '../../assest/election_4.jpg';

// const elections = [
//   {
//     id: 1,
//     name: "Constituency A",
//     logo: election_1,
//     title: "Constituency A Election",
//     description: "Join us on a successful journey towards a brighter future built on innovation, creativity, inclusivity, progress, etc.",
//     dates: "Election Dates: 12/1/2024 - 12/12/2024"
//   },
//   {
//     id: 2,
//     name: "Constituency B",
//     logo: election_2,
//     title: "Constituency B Election",
//     description: "We promote community empowerment, fostering strong, vibrant neighborhoods where every voice is heard.",
//     dates: "Election Dates: 12/5/2024 - 12/15/2024"
//   },
//   {
//     id: 3,
//     name: "Constituency C",
//     logo: election_4,
//     title: "Constituency C Election",
//     description: "Advocating for accountability and transparency, believing in a government that is open, honest, and responsible.",
//     dates: "Election Dates: 12/6/2024 - 12/12/2024"
//   },
// ];

// function ElectionsList({ selectedElection, handleElectionSelect }) {
//   useEffect(() => {
//     return () => {
//       handleElectionSelect(null);
//     };
//   }, [handleElectionSelect]);

//   return (
//     <>
//       <Navbar />
//       <Card sx={{ padding: 3, margin: 3 }}>
//         <Typography variant="h4" align="center" sx={{ marginBottom: 3, marginTop: 4 }}>
//           Select an Election
//         </Typography>
//         <Container sx={{ paddingBottom: 5 }}>
//           <Grid container spacing={4}>
//             {elections.map((election) => (
//               <Grid item key={election.id} xs={12} sm={6} md={4}>
//                 <Card>
//                   <CardContent>
//                     <Box display="flex" flexDirection="column" alignItems="center">
//                       <img src={election.logo} alt={`Logo for ${election.name}`} style={{ maxWidth: "100%", marginBottom: 16 }} />
//                       <Typography variant="h5" sx={{ marginBottom: 2 }}>
//                         {election.title}
//                       </Typography>
//                       <Typography variant="body1" sx={{ marginBottom: 2 }}>
//                         {election.description}
//                       </Typography>
//                       <Typography variant="body2" sx={{ marginBottom: 2 }}>
//                         {election.dates}
//                       </Typography>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         onClick={() => handleElectionSelect(election.id)}
//                         component={Link}
//                         to={`/candidates/${election.id}`}
//                         sx={{
//                           width: "100%",
//                           backgroundColor: selectedElection && selectedElection.includes(election.id) ? "#000" : "#000",
//                           color: "#fff",
//                           borderRadius: 2,
//                           boxShadow: "none",
//                           transition: "background-color 0.3s",
//                           "&:hover": {
//                             backgroundColor: selectedElection && selectedElection.includes(election.id) ? "#000" : "#000",
//                           }
//                         }}
//                       >
//                         {election.name}
//                       </Button>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Card>
//       <Footer />
//     </>
//   );
// }

// export default withAuthProtection(ElectionsList);


import React, { useEffect, useState } from "react";
import { sendRequest } from "../../utils/ResDbClient";
import { FETCH_ELECTIONS } from "../utils/ResDbApis";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Container,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import Navbar from "../Navbar2";
import Footer from "../Footer2";
import DefaultImage from "../../assest/election_default.jpeg"
const ElectionsList = () => {
  const [elections, setElections] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [refetchTrigger, setRefetchTrigger] = useState(false); 

  // Fetch all elections from ResilientDB
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await sendRequest(FETCH_ELECTIONS());
        if (res && res.data && res.data.getSpecificDataStructure) {
          const electionsData = res.data.getSpecificDataStructure.map((txn) => {
            try {
              const validString = txn.asset.replace(/'/g, '"');
              const parsedAsset = JSON.parse(validString).data; 
              return {
                realID: txn.id,
                ...parsedAsset
              };
            } catch(error) {
              console.error("Error parsing transaction assest", error, txn.asset)
              return null
            }
          }).filter(Boolean);
          setElections(electionsData);
        } else {
          setErrorMsg("Failed to fetch elections. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching elections:", error);
        setErrorMsg("An error occurred while fetching elections.");
      }
    };

    fetchElections();
  }, [refetchTrigger]);
  // Function to trigger a refetch
  const triggerRefetch = () => {
    setRefetchTrigger((prev) => !prev); // Toggle the refetch trigger
  };
return (
  <>
    <Navbar />
    <Card sx={{ padding: 3, margin: 3 }}>
      <Typography variant="h4" align="center" sx={{ marginBottom: 3, marginTop: 8 }}>
        Select an Election
      </Typography>
      <Container>
        <Grid container spacing={4}>
          {elections.map((election) => (
            <Grid item key={election.realID} xs={12} sm={6} md={4}>
              <Card sx={{ padding: 2 }}>
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <CardMedia
                      component="img"
                      alt={`Logo for ${election.name}`}
                      height="140"
                      image={election.logo?.trim() ? election.logo : DefaultImage}
                      sx={{ objectFit: "contain", padding: 1 }}
                    />
                    <Typography variant="h5" sx={{ marginBottom: 2, textAlign: "center" }}>
                      {election.title}
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 2, textAlign: "center" }}>
                      {election.description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                      <strong>Start Date:</strong> {election.dates?.startDate || "N/A"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2 }}>
                      <strong>End Date:</strong> {election.dates?.endDate || "N/A"}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/candidates/${election.realID}`}
                      sx={{
                        width: "100%",
                        borderRadius: 2,
                        textTransform: "none",
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "#115293",
                        },
                      }}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Card>
    <Footer />
  </>
  
);
};

export default ElectionsList;