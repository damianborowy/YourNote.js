import {
    Toolbar,
    AppBar as MaterialAppBar,
    IconButton,
    InputBase,
    ClickAwayListener
} from "@material-ui/core";
import React, { useState } from "react";
import { Menu, Search } from "@material-ui/icons";
import styles from "./AppBar.module.scss";
import SearchDropdown from "./SearchDropdown";
import { useStore } from "../../DarkModeProvider";

interface IAppBarProps {
    onDrawerOpen: () => void;
}

const AppBar = ({ onDrawerOpen }: IAppBarProps) => {
    const [search, setSearch] = useState(""),
        [dropdownOpen, setDropdownOpen] = useState(false),
        { darkMode } = useStore();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setSearch(event.target.value);

    return (
        <MaterialAppBar
            position="static"
            color={darkMode ? "default" : "primary"}
            className={styles.appBar}
            style={darkMode ? {} : { color: "rgba(0, 0, 0, 0.87)" }}
        >
            <Toolbar>
                <IconButton
                    className={styles.menuButton}
                    edge="start"
                    onClick={onDrawerOpen}
                >
                    <Menu />
                </IconButton>
                <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
                    <div
                        className={styles.search}
                        style={
                            dropdownOpen
                                ? {
                                      borderRadius: "4px 4px 0 0",
                                      backgroundColor:
                                          "rgba(255, 255, 255, 0.25)"
                                  }
                                : {}
                        }
                        onClick={() => setDropdownOpen(true)}
                    >
                        <div className={styles.searchIcon}>
                            <Search />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            className={styles.input}
                            classes={{
                                root: styles.inputRoot,
                                input: styles.inputInput
                            }}
                            value={search}
                            onChange={handleSearchChange}
                        />
                        {dropdownOpen && <SearchDropdown />}
                    </div>
                </ClickAwayListener>
            </Toolbar>
        </MaterialAppBar>
    );
};

export default AppBar;
