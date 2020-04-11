import React from "react";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { Route, BrowserRouter } from "react-router-dom";
import SharedNotePage from "../pages/SharedNotePage";
import NotesPage from "../pages/NotesPage";
import { withThemeProvider } from "./DarkModeProvider";

const App = () => {
    return (
        <BrowserRouter>
            <Route exact path="/" component={LoginPage} />
            <Route path="/register" component={RegisterPage} />
            <Route
                exact
                path="/notes"
                component={withThemeProvider(NotesPage)}
            />
            <Route path="/notes/public/:noteId" component={SharedNotePage} />
        </BrowserRouter>
    );
};

export default App;
