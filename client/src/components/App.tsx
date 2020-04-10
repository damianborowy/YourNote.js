import React from "react";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { Route, BrowserRouter } from "react-router-dom";
import NotesPage from "../pages/NotesPage";
import SharedNotePage from "../pages/SharedNotePage";
import { ThemeProvider, createMuiTheme } from "@material-ui/core";

const darkTheme = createMuiTheme({
    palette: {
        type: "dark"
    }
});

const lightTheme = createMuiTheme({
    palette: {
        type: "light"
    }
});

const App = () => {
    return (
        <BrowserRouter>
            <Route exact path="/" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <ThemeProvider theme={darkTheme}>
                <Route exact path="/notes" component={NotesPage} />
            </ThemeProvider>
            <Route path="/notes/public/:noteId" component={SharedNotePage} />
        </BrowserRouter>
    );
};

export default App;
