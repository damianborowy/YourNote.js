import React, { useState, useRef, useEffect } from "react";
import {
    SwipeableDrawer,
    FormControlLabel,
    Switch,
    Divider,
    Typography,
    Button,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@material-ui/core";
import { GetApp as Download, Edit, Translate } from "@material-ui/icons";
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
import ViewModel from "../../../models/View";
import ViewSettings from "./ViewSettings";
import { useTranslation } from "react-i18next";
import useLocalStorage from "../../../utils/useLocalStorage";

interface DrawerProps {
    notes: NoteModel[] | null;
    drawerOpen: boolean;
    onDrawerClose: () => void;
    onDrawerOpen: () => void;
    handleLogOutButtonClick: () => void;
    getEmailFromToken: () => void;
    views: ViewModel[] | null;
    setViews: (views: ViewModel[]) => void;
    selectedView: ViewModel | null;
    setSelectedView: (view: ViewModel) => void;
}

const defaultPdf = (
    <Document>
        <Page>
            <View>
                <Text>Couldn't find any notes to export.</Text>
            </View>
        </Page>
    </Document>
);

const Drawer = (props: DrawerProps) => {
    const { darkMode, setDarkMode } = useStore(),
        { t, i18n } = useTranslation(),
        [dialogOpen, setDialogOpen] = useState(false),
        [clickedViewName, setClickedViewName] = useState(""),
        notesRef = useRef<NoteModel[] | null>(null),
        [lang, setLang] = useLocalStorage("lang", "en");

    useEffect(() => {
        if (!notesRef.current) notesRef.current = props.notes;
    }, [props.notes]);

    const toggleDarkMode = () => setDarkMode(!darkMode);

    const isAdmin = () => {
        const role = getRoleFromToken();

        return role === "Admin";
    };

    const handleEditClicked = (name: string) => {
        setClickedViewName(name);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setClickedViewName("");
    };

    const handleViewChange = (name: string) => {
        if (!props.views) return;

        const view = props.views.find((view) => view.name === name);

        if (!view) return;

        props.setSelectedView(view);
    };

    const handleLanguageChange = (
        event: React.ChangeEvent<{ value: unknown }>
    ) => {
        const newLang = event.target.value as string;
        setLang(newLang);
        i18n.changeLanguage(newLang);
    };

    const addNewView = () => {
        if (!props.views) return;

        const newViews = [...props.views];
        const newView = new ViewModel(
            `${t("notes.drawer.view")} ${newViews.length}`,
            []
        );

        newViews.push(newView);
        props.setViews(newViews);
    };

    const _generateDoc = () => {
        if (!notesRef.current) return defaultPdf;

        return (
            <Document title="My notes">
                <Page size="A4" style={{ margin: "0 30px", maxWidth: 535 }}>
                    {notesRef.current.map((note) => (
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
            <div>
                <Typography variant="h6">{t("notes.drawer.views")}</Typography>
                {props.views &&
                    props.selectedView &&
                    props.views.map((view) => (
                        <div className={styles.viewContainer} key={view.name}>
                            <Button
                                className={styles.viewButton}
                                onClick={() => handleViewChange(view.name)}
                                color={
                                    props.selectedView &&
                                    props.selectedView.name === view.name
                                        ? "primary"
                                        : "default"
                                }
                            >
                                {view.name === "All notes" ? t("notes.drawer.allNotes") : view.name}
                            </Button>
                            {view.name !== "All notes" && (
                                <IconButton
                                    onClick={() => handleEditClicked(view.name)}
                                >
                                    <Edit fontSize="small" />
                                </IconButton>
                            )}
                        </div>
                    ))}
                <div className={styles.viewContainer}>
                    <Button className={styles.viewButton} onClick={addNewView}>
                        {t("notes.drawer.newView")}
                    </Button>
                </div>
                <ViewSettings
                    open={dialogOpen}
                    clickedViewName={clickedViewName}
                    views={props.views}
                    setViews={props.setViews}
                    selectedView={props.selectedView}
                    setSelectedView={props.setSelectedView}
                    handleClose={handleDialogClose}
                />
            </div>
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
                    label={t("notes.drawer.darkModeToggler")}
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
                                {t("notes.drawer.saveAsPdf")}
                            </Button>
                        )
                    }
                </PDFDownloadLink>
                <div className={styles.language}>
                    <Translate />
                    <FormControl className={styles.form} variant="filled">
                        <InputLabel>{t("notes.drawer.language")}</InputLabel>
                        <Select value={lang} onChange={handleLanguageChange}>
                            <MenuItem value="en">English</MenuItem>
                            <MenuItem value="pl">Polski</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <Divider className={styles.divider} />
                <Typography>
                    {t("notes.drawer.loggedIn")}: <br />
                    {props.getEmailFromToken()}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={props.handleLogOutButtonClick}
                    className={styles.drawerButton}
                >
                    {t("notes.drawer.logout")}
                </Button>
                {isAdmin() && (
                    <Link to="/admin">
                        <Button
                            variant="contained"
                            color="primary"
                            className={styles.drawerButton}
                        >
                            {t("notes.drawer.adminPanel")}
                        </Button>
                    </Link>
                )}
            </div>
        </SwipeableDrawer>
    );
};

export default Drawer;
