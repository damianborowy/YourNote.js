import React from "react";
import {
    SwipeableDrawer,
    FormControlLabel,
    Switch,
    Divider,
    Typography,
    Button
} from "@material-ui/core";
import styles from "./Drawer.module.scss";
import { useStore } from "../../DarkModeProvider";
import { getRoleFromToken } from "../../../utils/TokenHandler";
import { Link } from "react-router-dom";

interface DrawerProps {
    drawerOpen: boolean;
    onDrawerClose: () => void;
    onDrawerOpen: () => void;
    handleLogOutButtonClick: () => void;
    getEmailFromToken: () => void;
}

const Drawer = (props: DrawerProps) => {
    const { darkMode, setDarkMode } = useStore();

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const isAdmin = () => {
        const role = getRoleFromToken();

        return role === "Admin";
    };

    return (
        <SwipeableDrawer
            classes={{ paper: styles.drawer }}
            open={props.drawerOpen}
            onClose={props.onDrawerClose}
            onOpen={props.onDrawerOpen}
        >
            <div className={styles.drawerBottom}>
                <FormControlLabel
                    control={
                        <Switch
                            checked={darkMode}
                            color="primary"
                            onChange={toggleDarkMode}
                        />
                    }
                    label="Toggle dark mode"
                />

                <Divider className={styles.divider} />
                <Typography>
                    Logged in as: <br />
                    {props.getEmailFromToken()}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={props.handleLogOutButtonClick}
                    className={styles.drawerButton}
                >
                    Log out
                </Button>
                {isAdmin() && (
                    <Link to="/admin">
                        <Button
                            variant="contained"
                            color="primary"
                            className={styles.drawerButton}
                        >
                            Admin panel
                        </Button>
                    </Link>
                )}
            </div>
        </SwipeableDrawer>
    );
};

export default Drawer;
