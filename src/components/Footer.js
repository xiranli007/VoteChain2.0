import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CopyrightImage from "../assest/82954a041b27eadab9a9bd64e718c0a9-removebg-preview.png";

const Footer = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#000",
        color: "#fff",
        textAlign: "center",
        padding: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      <img
        src={CopyrightImage}
        alt="Copyright"
        style={{
          width: "20px",
          marginRight: "5px",
          verticalAlign: "middle",
        }}
      />
      <Typography variant="body2" style={{ color: "white" }}>
        2024 VoteChain 2.0
      </Typography>
    </Box>
  );
};

export default Footer;