import React, { useState } from "react";
import styles from "./AdminPage.module.scss";
import {
    useTheme,
    IconButton,
    Typography,
    AppBar,
    Tabs,
    Tab
} from "@material-ui/core";
import { withThemeProvider } from "../components/DarkModeProvider";
import UsersTab from "../components/AdminPage/UsersTab";
import { Link } from "react-router-dom";
import { ArrowBack } from "@material-ui/icons";
import StatsTab from "../components/AdminPage/StatsTab";
import { useTranslation } from "react-i18next";

interface ITabPanelProps {
    children: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = ({ children, index, value }: ITabPanelProps) => {
    return (
        <div role="tabpanel" hidden={value !== index}>
            {value === index && children}
        </div>
    );
};

const AdminPage = () => {
    const theme = useTheme(),
        [value, setValue] = useState(0),
        { t } = useTranslation();

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) =>
        setValue(newValue);

    return (
        <div
            className={styles.page}
            style={{
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary
            }}
        >
            <AppBar position="static" color="transparent">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label={t("admin.users")} />
                    <Tab label={t("admin.statistics")} />
                </Tabs>
            </AppBar>
            <div className={styles.header}>
                <Link
                    to={"/"}
                    style={{
                        textDecoration: "none",
                        color: theme.palette.text.primary,
                        display: "flex",
                        alignItems: "center",
                        width: "min-content"
                    }}
                >
                    <IconButton>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" component="h6">
                        {t("admin.back")}
                    </Typography>
                </Link>
            </div>
            <TabPanel value={value} index={0}>
                <UsersTab />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <StatsTab />
            </TabPanel>
        </div>
    );
};

export default withThemeProvider(AdminPage);
