import React from 'react';

const BudgetContext = React.createContext({
    budget: Object, 
    setBudget: () => {}
});

export default BudgetContext;