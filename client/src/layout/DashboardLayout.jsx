import MiniDrawer from "../components/Drawer";

import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import PrimarySearchAppBar from "../components/AppBar";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAllLabels } from "../pages/notes/NotesSlice";

const DashboardLayout = () => {
  const [isDrowerOpen, setisDrowerOpen] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllLabels());
    console.log("hii");
    
  }),[];
  return (
    <>
      <PrimarySearchAppBar
        setisDrowerOpen={setisDrowerOpen}
        isDrowerOpen={isDrowerOpen}
      />
      <Box sx={{ display: "flex"}} marginTop={10}>
        <MiniDrawer isDrowerOpen={isDrowerOpen} />
        <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default DashboardLayout;
