import MiniDrawer from "../components/Drawer";

import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import PrimarySearchAppBar from "../components/AppBar";

const DashboardLayout = () => {
  return (
    <>
      <PrimarySearchAppBar />
      <Box sx={{ display: "flex" }} marginTop={5}>
        <MiniDrawer />
        <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
          
          <Outlet />
        </Box>
      </Box>
    </>
  );    
};

export default DashboardLayout;
