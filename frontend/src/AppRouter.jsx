import React from "react";
import { Switch, Route } from "react-router-dom";
import EmptyState from "./EmptyState";

const AppRouter = () => {
    return (
        <Switch>
            <Route path="/"><EmptyState /></Route>
            <Route path="/budget-auth"><EmptyState /></Route>
            <Route path="/budget-summary"><EmptyState /></Route>
            <Route path="/budget-details"><EmptyState /></Route>
            <Route path="/revenues"><EmptyState /></Route>
            <Route path="/spending"><EmptyState /></Route>
            <Route path="/budget-entries"><EmptyState /></Route>
        </Switch>
    );
};

export default AppRouter;