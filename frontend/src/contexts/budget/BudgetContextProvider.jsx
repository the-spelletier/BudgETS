import React from "react";
import PropTypes from "prop-types";

import BudgetContext from "./BudgetContext";
import useBudget from "./useBudget";

const BudgetContextProvider = ({children, initialBudget}) => {
    var budget = useBudget(initialBudget);

    return (
        <BudgetContext.Provider value={budget}>
            {children}
        </BudgetContext.Provider>
    );
};

BudgetContextProvider.propTypes = {
    children: PropTypes.node, 
    initialBudget: PropTypes.object
};

export default BudgetContextProvider;