import React from "react";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import { HashRouter, Route, BrowserRouter } from "react-router-dom";
import LoggedInPage from "../pages/NotesPage";

class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Route exact path="/" component={LoginPage} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/loggedIn" component={LoggedInPage} />
            </BrowserRouter>
        );
    }
}

export default App;
