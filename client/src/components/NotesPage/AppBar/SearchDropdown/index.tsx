import React, { useState } from "react";
import { Box, Typography, Switch } from "@material-ui/core";
import styles from "./SearchDropdown.module.scss";
import { useStore } from "../../../DarkModeProvider";
import clsx from "clsx";

interface ISearchDropdownProps {}

const colors = [
    "transparent",
    "blue",
    "green",
    "red",
    "gray",
    "yellow",
    "orange"
];

const SearchDropdown = (props: ISearchDropdownProps) => {
    const { darkMode } = useStore(),
        [titles, setTitles] = useState(true),
        [contents, setContents] = useState(true),
        [tags, setTags] = useState(true);

    return (
        <Box
            className={styles.box}
            style={{ backgroundColor: darkMode ? "#595959" : "#59b0f6" }}
        >
            <div className={styles.colors}>
                {colors.map((color) => (
                    <div
                        className={clsx(
                            styles.color,
                            darkMode ? "dark" : "light",
                            color
                        )}
                        key={color}
                    />
                ))}
            </div>
            <div className={styles.filter}>
                <Typography>Search in titles</Typography>
                <Switch
                    checked={titles}
                    color={darkMode ? "primary" : "secondary"}
                    onChange={(e) => setTitles(e.target.checked)}
                />
            </div>
            <div className={styles.filter}>
                <Typography>Search in contents</Typography>
                <Switch
                    checked={contents}
                    color={darkMode ? "primary" : "secondary"}
                    onChange={(e) => setContents(e.target.checked)}
                />
            </div>
            <div className={styles.filter}>
                <Typography>Search in tags</Typography>
                <Switch
                    checked={tags}
                    color={darkMode ? "primary" : "secondary"}
                    onChange={(e) => setTags(e.target.checked)}
                />
            </div>
        </Box>
    );
};

export default SearchDropdown;
