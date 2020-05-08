import React from "react";
import {
    SwipeableDrawer,
    FormControlLabel,
    Switch,
    Divider,
    Typography,
    Button
} from "@material-ui/core";
import { GetApp as Download } from "@material-ui/icons";
import styles from "./Drawer.module.scss";
import { useStore } from "../../DarkModeProvider";
import { getRoleFromToken } from "../../../utils/TokenHandler";
import { Link } from "react-router-dom";
import {
    Page,
    Text,
    View,
    Document,
    PDFDownloadLink
} from "@react-pdf/renderer";
import NoteModel from "../../../models/Note";

interface DrawerProps {
    notes: NoteModel[] | null;
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

    const _generateDoc = () => {
        const { notes } = props;

        if (!notes)
            return (
                <Document>
                    <Page>
                        <View>
                            <Text>Couldn't find any notes to export.</Text>
                        </View>
                    </Page>
                </Document>
            );

        return (
            <Document title="My notes">
                <Page size="A4" style={{ margin: "0 30px", maxWidth: 535 }}>
                    {notes.map((note) => (
                        <View
                            style={{
                                margin: "30px 0 0px"
                            }}
                            wrap={false}
                            key={note._id}
                        >
                            {note.title && note.title?.length > 0 && (
                                <Text style={{ fontSize: 25 }}>
                                    {note.title}
                                </Text>
                            )}
                            {note.tags && note.tags?.length > 0 && (
                                <Text style={{ fontSize: 15, color: "gray" }}>
                                    {note.tags
                                        .map((tag) => `#${tag}`)
                                        .join(" ")}
                                </Text>
                            )}
                            {note.content && note.content?.length > 0 && (
                                <Text style={{ fontSize: 12, marginTop: 3 }}>
                                    {note.content}
                                </Text>
                            )}
                        </View>
                    ))}
                </Page>
            </Document>
        );
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
                    classes={{
                        labelPlacementStart: styles.labelPlacementStart
                    }}
                    control={
                        <Switch
                            checked={darkMode}
                            color="primary"
                            onChange={toggleDarkMode}
                        />
                    }
                    label="Toggle dark mode"
                    labelPlacement="start"
                />
                <PDFDownloadLink document={_generateDoc()} fileName="notes.pdf">
                    {({ loading }) =>
                        loading ? (
                            <Button
                                variant="outlined"
                                className={styles.pdfButton}
                            >
                                Export is loading...
                            </Button>
                        ) : (
                            <Button
                                variant="outlined"
                                className={styles.pdfButton}
                                startIcon={<Download />}
                            >
                                Save as .pdf
                            </Button>
                        )
                    }
                </PDFDownloadLink>
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
