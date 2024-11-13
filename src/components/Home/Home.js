import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Row, Col, Button } from "reactstrap";
import Navbar from "../Navbar1";
import Footer from "../Footer2";
import voting_home from "../../components/images/voting_home_2.svg";
import signup from "../../components/images/signup.svg";
import election from "../../components/images/election.svg";
import report from "../../components/images/report.svg";
import secure from "../../components/images/secure.svg";
import transparent from "../../components/images/Electronic Vote Visualisation in the Admin panel.svg";
import immutable from "../../components/images/Immutable_votes.svg";
import singleVoting from "../../components/images/Single_voting_instance.svg";
import restrictedAccess from "../../components/images/Restricted_access.svg";

function Home(props) {
  return (
    <div>
      <Navbar />
      <div className="wrapper" style={{ paddingLeft: "2rem", paddingRight: "2rem" }}>
        <div className="page-header header-filter">
          <Container>
            <div className="content-center brand">
              {/* Header Section */}
            </div>
          </Container>
        </div>
        <section className="section section-lg section-safe">
          <Container>
            <Row className="row-grid justify-content-between">
              <Col md="6">
                <div className="px-md-4 text-left">
                  <hr className="line-success" />
                  <Typography variant="h1" color="primary">
                    VoteChain
                  </Typography>
                  <Typography variant="h4" color="secondary">
                    Make Your Voice Heard: Vote for Change
                  </Typography>
                  <Typography sx={{ color: "#575989", mt: 2 }}>
                    Revolutionize democracy with our secure and user-friendly e-voting system. Experience the future of voting – convenient, transparent, and accessible to all.
                  </Typography>
                  <Button color="primary" href="https://naitikjain3071.wixsite.com/my-site">
                    Blog
                  </Button>
                </div>
              </Col>
              <Col md="6">
                <img alt="Voting Home" className="img-fluid floating" src={voting_home} />
              </Col>
            </Row>
          </Container>
        </section>

        <Container>
          <div className="content-center brand">
            <hr className="line-success" />
            <Typography variant="h2" align="center">
              How it works?
            </Typography>
          </div>
        </Container>

        <Container sx={{ padding: 4 }}>
          <Grid container spacing={3}>
            {[
              { img: signup, title: "Voter registration", text: "Register to vote and ensure your voice is counted in the upcoming elections." },
              { img: election, title: "Election day details", text: "Mark your calendar! Find essential information about election dates, polling locations, and voting hours." },
              { img: report, title: "Candidate profiles and issues", text: "Know your candidates and their stands on key issues. Explore profiles to make an informed decision." }
            ].map((item, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <Card sx={{ height: "100%" }}>
                  <CardContent>
                    <img alt="..." src={item.img} style={{ width: "100%", maxHeight: 300 }} />
                    <Typography variant="h5" color="primary" gutterBottom>
                      {item.title}
                    </Typography>
                    <Typography variant="body2">{item.text}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Container>
          <div className="content-center brand">
            <hr className="line-success" />
            <Typography variant="h2" align="center">
              Features
            </Typography>
          </div>
          <Grid container spacing={3} sx={{ paddingTop: 3 }}>
            {[
              { img: restrictedAccess, title: "Limited access" },
              { img: immutable, title: "Immutable votes" },
              { img: transparent, title: "Secure and Transparent Election" },
              { img: singleVoting, title: "Single voting" }
            ].map((feature, index) => (
              <Grid item xs={12} sm={6} key={index} sx={{ textAlign: "center" }}>
                <img alt="..." src={feature.img} style={{ width: "100%", maxHeight: 300 }} />
                <Typography variant="h5" sx={{ color: "#575989", mt: 2 }}>
                  {feature.title}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Footer />
      </div>
    </div>
  );
}

export default Home;