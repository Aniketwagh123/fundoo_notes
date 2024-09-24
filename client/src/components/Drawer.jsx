import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
// import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LabelIcon from "@mui/icons-material/Label";
import EditIcon from "@mui/icons-material/Edit";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useNavigate } from "react-router-dom";
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    borderRight: "none", // Remove the right border
  },
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function MiniDrawer() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleNavigation = (index) => {
    setSelectedIndex(index);
    switch (index) {
      case 0:
        navigate(""); // Navigate to Notes
        break;
      case 1:
        navigate("reminder"); // Navigate to Reminder
        break;
      case 2:
        navigate("complete"); // Navigate to Complete
        break;
      case 3:
        navigate("edit-labels"); // Navigate to Edit Labels
        break;
      case 4:
        navigate("archive"); // Navigate to Archive
        break;
      case 5:
        navigate("trash"); // Navigate to Trash
        break;
      default:
        navigate(""); // Fallback to home or default route
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* <CssBaseline /> */}

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(!open)}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <List>
          {[
            "Notes",
            "Reminder",
            "Complete",
            "Edit labels",
            "Archive",
            "Trash",
          ].map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => handleNavigation(index)} // Handle navigation on click
            >
              <ListItemButton
                sx={[
                  {
                    minHeight: 48,
                    px: 2.5,
                    "&:hover": {
                      backgroundColor:
                        selectedIndex === index ? "#feefc3" : "#f1f3f4",
                      borderTopRightRadius: 25,
                      borderBottomRightRadius: 25,
                    },
                  },
                  open
                    ? {
                        justifyContent: "initial",
                        backgroundColor:
                          selectedIndex === index ? "#feefc3" : "inherit",
                        borderTopRightRadius:
                          selectedIndex === index ? 25 : "inherit",
                        borderBottomRightRadius:
                          selectedIndex === index ? 25 : "inherit",
                        transition: "all 0.3s ease",
                      }
                    : {
                        justifyContent: "center",
                        backgroundColor:
                          selectedIndex === index ? "#feefc3" : "inherit",
                        borderTopRightRadius:
                          selectedIndex === index ? 25 : "inherit",
                        borderBottomRightRadius:
                          selectedIndex === index ? 25 : "inherit",
                        transition: "all 0.3s ease",
                        
                      },
                ]}
              >
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  {(() => {
                    switch (index) {
                      case 0:
                        return <LightbulbIcon />;
                      case 1:
                        return <NotificationsNoneIcon />;
                      case 2:
                        return <LabelIcon />;
                      case 3:
                        return <EditIcon />;
                      case 4:
                        return <ArchiveOutlinedIcon />;
                      default:
                        return <DeleteOutlineOutlinedIcon />;
                    }
                  })()}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </Box>
  );
}
