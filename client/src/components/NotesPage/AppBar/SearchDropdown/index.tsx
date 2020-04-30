import React from "react";
import { Box, Typography, Switch } from "@material-ui/core";
import styles from "./SearchDropdown.module.scss";
import { useStore } from "../../../DarkModeProvider";
import { Check } from "@material-ui/icons";
import clsx from "clsx";
import FilterSettings from "../../../../models/FilterSettings";

interface ISearchDropdownProps {
    filterSettings: FilterSettings;
    setFilterSettings: (filterSettings: FilterSettings) => void;
}

const colors = [
    "transparent",
    "blue",
    "green",
    "red",
    "gray",
    "yellow",
    "orange"
];

const SearchDropdown = ({
    filterSettings,
    setFilterSettings
}: ISearchDropdownProps) => {
    const { darkMode } = useStore(),
        { selectedColors, titles, contents, tags } = filterSettings;

    const onColorClicked = (color: string) => {
        const newSettings = filterSettings.copy();

        if (selectedColors.includes(color)) {
            const colorIndex = selectedColors.indexOf(color);
            newSettings.selectedColors.splice(colorIndex, 1);
        } else newSettings.selectedColors.push(color);

        setFilterSettings(newSettings);
    };

    const onTitlesChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSettings = filterSettings.copy();
        newSettings.titles = event.target.checked;

        setFilterSettings(newSettings);
    };

    const onContentsChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSettings = filterSettings.copy();
        newSettings.contents = event.target.checked;

        setFilterSettings(newSettings);
    };

    const onTagsChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSettings = filterSettings.copy();
        newSettings.tags = event.target.checked;

        setFilterSettings(newSettings);
    };

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
                        onClick={() => onColorClicked(color)}
                        key={color}
                    >
                        {selectedColors.includes(color) && (
                            <Check fontSize="small" />
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.filter}>
                <Typography>Search in titles</Typography>
                <Switch
                    checked={titles}
                    color={darkMode ? "primary" : "secondary"}
                    onChange={onTitlesChanged}
                />
            </div>
            <div className={styles.filter}>
                <Typography>Search in contents</Typography>
                <Switch
                    checked={contents}
                    color={darkMode ? "primary" : "secondary"}
                    onChange={onContentsChanged}
                />
            </div>
            <div className={styles.filter}>
                <Typography>Search in tags</Typography>
                <Switch
                    checked={tags}
                    color={darkMode ? "primary" : "secondary"}
                    onChange={onTagsChanged}
                />
            </div>
        </Box>
    );
};

export default SearchDropdown;
