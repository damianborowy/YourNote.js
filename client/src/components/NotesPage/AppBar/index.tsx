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

interface IAppBarProps {
    onDrawerOpen: () => void;
}

const AppBar = ({ onDrawerOpen }: IAppBarProps) => {
    const [search, setSearch] = useState(""),
        [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) =>
        setSearch(event.target.value);

    return (
        <MaterialAppBar
            position="static"
            color="default"
            className={styles.appBar}
        >
            <Toolbar>
                <IconButton edge="start" onClick={onDrawerOpen}>
                    <Menu />
                </IconButton>
                <ClickAwayListener onClickAway={() => setDropdownOpen(false)}>
                    <div
                        className={styles.search}
                        onClick={() => setDropdownOpen(true)}
                    >
                        <div className={styles.searchIcon}>
                            <Search />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            className={styles.input}
                            classes={{
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
