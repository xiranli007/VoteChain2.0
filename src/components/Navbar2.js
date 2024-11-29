import React from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleClick}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6">
          {/* Replace any previous button links with the Logout link */}
          <Button component={Link} to="/elections" sx={{ color: "white", mr: 2 }}>
            All Elections
          </Button>
          <Button component={Link} to="/create-election" sx={{ color: "white", mr: 2 }}>
            Create Election
          </Button>
          <Button component={Link} to="/logout" sx={{ color: "white", mr: 2 }}>
            Logout
          </Button>
        </Typography>
      </Toolbar>
      {/* Responsive Menu */}
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {/* Add any additional menu items here if needed */}
      </Menu>
    </AppBar>
  );
};

export default Navbar;