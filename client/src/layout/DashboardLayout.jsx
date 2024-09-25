import MiniDrawer from "../components/Drawer";

import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import PrimarySearchAppBar from "../components/AppBar";
import { useState } from "react";

const DashboardLayout = () => {
    const [isDrowerOpen, setisDrowerOpen] = useState(false);
  return (
    <>
      <PrimarySearchAppBar setisDrowerOpen={setisDrowerOpen} isDrowerOpen={isDrowerOpen}/>
      <Box sx={{ display: "flex", paddingInline:3}} marginTop={10}>
        <MiniDrawer isDrowerOpen={isDrowerOpen}/>
        <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
          
          <Outlet />
        </Box>
      </Box>
    </>
  );    
};

export default DashboardLayout;
