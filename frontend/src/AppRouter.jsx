import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Auth from "./auth/Auth";
import BudgetContainer from "./budget/BudgetContainer";
import BudgetCreate from "./budget/create/BudgetCreate";
import BudgetDetails from "./budget/details/BudgetDetails";
import Categories from "./categories/Categories";
import Entries from "./entries/Entries";
import Members from "./members/Members";
import Summary from "./summary/Summary";
import RevenuesOrExpenses from "./revenues-or-expenses/RevenuesOrExpenses";
import Help from "./help/Help";
import About from "./about/About";
import EmptyState from "./EmptyState";
import ProtectedRoute from "./components/ProtectedRoute";
import Cashflow from "./cashflow/Cashflow";


const AppRouter = () => {
    return (
        <Switch>
            <ProtectedRoute exact path="/"><Redirect to="/budget/summary"/></ProtectedRoute>
            <ProtectedRoute path="/budget/create"><BudgetCreate clone={ false } /></ProtectedRoute>
            <ProtectedRoute path="/budget">
                <BudgetContainer>
                    <ProtectedRoute path="/budget/clone"><BudgetCreate clone={ true }  /></ProtectedRoute>
                    <ProtectedRoute path="/budget/summary"><Summary /></ProtectedRoute>
                    <ProtectedRoute path="/budget/details" component={ BudgetDetails }></ProtectedRoute>
                    <ProtectedRoute path="/budget/cat-and-lines"><Categories /></ProtectedRoute>
                    <ProtectedRoute path="/budget/revenues"><RevenuesOrExpenses type="revenue" /></ProtectedRoute>
                    <ProtectedRoute path="/budget/expenses"><RevenuesOrExpenses type="expense" /></ProtectedRoute>
                    <ProtectedRoute path="/budget/entries"><Entries /></ProtectedRoute>
                    <ProtectedRoute path="/budget/cashflows"><Cashflow /></ProtectedRoute>
                </BudgetContainer>
            </ProtectedRoute>
            <ProtectedRoute path="/members"><Members /></ProtectedRoute>
            <Route path="/auth"><Auth /></Route>
            <Route path="/help"><Help /></Route>
            <Route path="/about"><About /></Route>
        </Switch>
    );
};

export default AppRouter;