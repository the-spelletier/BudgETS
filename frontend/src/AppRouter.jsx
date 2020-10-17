import React from "react";
import { Switch, Route } from "react-router-dom";

import Auth from "./auth/Auth";
import BudgetContainer from "./budget/BudgetContainer";
import BudgetCreate from "./budget/create/BudgetCreate";
import BudgetDetails from "./budget/details/BudgetDetails";
import Categories from "./categories/Categories";
import EmptyState from "./EmptyState";


const AppRouter = () => {
    return (
        <Switch>
            <Route exact path="/"><EmptyState /></Route>
            <Route path="/budget/create"><BudgetCreate clone={ false } /></Route>
            <Route path="/budget">
                <BudgetContainer>
                    <Route path="/budget/clone"><BudgetCreate clone={ true }  /></Route>
                    <Route path="/budget/summary"><EmptyState /></Route>
                    <Route path="/budget/details"><BudgetDetails /></Route>
                    <Route path="/budget/cat-and-lines"><Categories /></Route>
                    <Route path="/budget/revenues"><EmptyState /></Route>
                    <Route path="/budget/spending"><EmptyState /></Route>
                    <Route path="/budget/entries"><EmptyState /></Route>
                </BudgetContainer>
            </Route>
            <Route path="/auth"><Auth /></Route>
        </Switch>
    );
};

export default AppRouter;