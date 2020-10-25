import React from "react";
import { Switch, Route } from "react-router-dom";

import Auth from "./auth/Auth";
import BudgetContainer from "./budget/BudgetContainer";
import BudgetCreate from "./budget/create/BudgetCreate";
import BudgetDetails from "./budget/details/BudgetDetails";
import Categories from "./categories/Categories";
import Entries from "./entries/Entries";
import Members from "./members/Members";
import Help from "./help/Help";
import EmptyState from "./EmptyState";
import ProtectedRoute from "./components/ProtectedRoute";


const AppRouter = () => {
    return (
        <Switch>
            <ProtectedRoute exact path="/"><EmptyState /></ProtectedRoute>
            <ProtectedRoute path="/budget/create"><BudgetCreate clone={ false } /></ProtectedRoute>
            <ProtectedRoute path="/budget">
                <BudgetContainer>
                    <ProtectedRoute path="/budget/clone"><BudgetCreate clone={ true }  /></ProtectedRoute>
                    <ProtectedRoute path="/budget/summary"><EmptyState /></ProtectedRoute>
                    <ProtectedRoute path="/budget/details" component={ BudgetDetails }></ProtectedRoute>
                    <ProtectedRoute path="/budget/cat-and-lines"><Categories /></ProtectedRoute>
                    <ProtectedRoute path="/budget/revenues"><EmptyState /></ProtectedRoute>
                    <ProtectedRoute path="/budget/spending"><EmptyState /></ProtectedRoute>
                    <ProtectedRoute path="/budget/entries"><Entries /></ProtectedRoute>
                </BudgetContainer>
            </ProtectedRoute>
            <Route path="/members"><Members /></Route>
            <Route path="/auth"><Auth /></Route>
            <Route path="/help"><Help /></Route>
        </Switch>
    );
};

export default AppRouter;