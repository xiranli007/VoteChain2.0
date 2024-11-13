import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check"; // Adjusted icon import
import { POST_TRANSACTION, FETCH_TRANSACTION } from "../utils/ResDbApis";
import { sendRequest } from "../utils/ResDbClient";
import { auth } from '../../firebase';
import { useParams } from "react-router-dom";
import withAuthProtection from "../AuthProtect/AuthProtect";
import Navbar from "../Navbar2";
import Footer from "../Footer";
import styles from "./CandidatesList.module.css";
import { Container, Row, Col } from "reactstrap";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Avatar from '@mui/material/Avatar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import back_image_cand from "../../assest/undraw_people_re_8spw.svg";

import c1 from '../../assest/c1.png';
import c2 from '../../assest/c2.png';
import c3 from '../../assest/c3.png';
import c4 from '../../assest/c4.png';
import c5 from '../../assest/c5.png';
import c6 from '../../assest/c6.png';
import c7 from '../../assest/c7.png';
import c8 from '../../assest/c8.png';
import c9 from '../../assest/c9.png';
import c10 from '../../assest/c10.png';
import c11 from '../../assest/c11.png';
import c12 from '../../assest/c12.png';
import c13 from '../../assest/c13.png';
import c14 from '../../assest/c14.png';
import c15 from '../../assest/c15.png';
import c16 from '../../assest/c16.png';

const sampleCandidates = [
  { id: "1", name: "Candidate 1" },
  { id: "2", name: "Candidate 2" },
  { id: "3", name: "Candidate 3" },
];

const CandidatesList = ({ selectedElection, votedCandidates, handleVote, isElectionVoted }) => {
  const [isVotingDisabled, setVotingDisabled] = useState(false);
  const [votedCandidate, setVotedCandidate] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [voterList, setVoterList] = useState([]);
  const [isVoted, setIsVoted] = useState(false);
  const { electionId } = useParams();

  const svgImages = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16];
  const getRandomSvgImage = () => svgImages[Math.floor(Math.random() * svgImages.length)];

  useEffect(() => {
    if (selectedElection) {
      fetchTransactions(selectedElection);
    }
  }, [selectedElection]);

  const fetchTransactions = async (electionId) => {
    try {
      const res = await sendRequest(FETCH_TRANSACTION("PublicKey1", "PublicKey2"));
      if (res && res.data && res.data.getFilteredTransactions) {
        setTransactions(res.data.getFilteredTransactions);
        let voters = [...voterList];
        res.data.getFilteredTransactions.forEach(element => {
          voters.push(JSON.parse(element.asset.replace(/'/g, '"')).data);
        });
        setVoterList(voters);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleCandidateVote = async (candidateId) => {
    if (!candidateId) return;
    try {
      const user = auth.currentUser;
      if (!user) return;

      const metadata = {
        signerPublicKey: "PublicKey",
        signerPrivateKey: "PrivateKey",
        recipientPublicKey: "PublicKey",
      };

      const hasVoted = voterList.some(item => item.electionId === electionId && item.voterId === user.uid);

      if (!hasVoted) {
        const dataItem = {
          electionId,
          candidateId,
          voterId: user.uid,
          voteCount: 1,
          additionalData: {
            timestamp: Date.now(),
            location: "Precinct 123",
            verificationCode: "ABCDEF",
          },
        };

        const res = await sendRequest(POST_TRANSACTION(metadata, JSON.stringify(dataItem)));
        setVotedCandidate(candidateId);
        setVotingDisabled(true);
      } else {
        setIsVoted(true);
      }
    } catch (error) {
      console.error("Error while voting:", error);
    }
  };

  useEffect(() => {
    if (isVoted) {
      toast.info('You have already voted.', {
        position: "top-center",
        autoClose: 5000,
      });
    } else if (votedCandidate) {
      toast.success(`You have successfully voted for ${votedCandidate}.`, {
        position: "top-center",
        autoClose: 5000,
      });
    }
  }, [isVoted, votedCandidate]);

  return (
    <>
      <Navbar />
      <Container className={styles.container}>
        <Row className="justify-content-center">
          <Col md="6" className={styles.imageCol} style={{ paddingRight: "100px", paddingTop: "100px" }}>
            <div className={styles.imageContainer}>
              <img src={back_image_cand} alt="..." className={styles.back_image_cand} />
            </div>
          </Col>
          <Col md="6">
            <div>
              <Typography variant="h3" style={{ padding: "50px" }}>Candidates List</Typography>
              {selectedElection && (
                <Typography variant="h5">Election: {selectedElection.name}</Typography>
              )}
              {isElectionVoted && (
                <Typography variant="h6">You have already voted in this election.</Typography>
              )}
              <ToastContainer position="top-center" autoClose={5000} />

              <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: '20px' }}>
                {sampleCandidates.map(candidate => (
                  <List sx={{ width: '100%', maxWidth: 1000, bgcolor: 'background.paper', marginBottom: 2 }} key={candidate.id}>
                    <ListItem alignItems="flex-start">
                      <Avatar alt={candidate.name} src={getRandomSvgImage()} style={{ width: '80px', height: '80px' }} />
                      <Typography variant="h5" style={{ flex: 'column', marginLeft: 15, marginTop: '25px' }}>{candidate.name}</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CheckIcon />}
                        onClick={() => handleCandidateVote(candidate.id)}
                        disabled={isVotingDisabled}
                        style={{ whiteSpace: 'nowrap', marginLeft: '100px' }}
                      >
                        Vote
                      </Button>
                    </ListItem>
                  </List>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <Footer />
    </>
  );
};

export default withAuthProtection(CandidatesList);
