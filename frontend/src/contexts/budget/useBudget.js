import { useState, useCallback } from "react";

const useBudget = (initialBudget) => {
    const [budget, setBudget] = useState(initialBudget ? initialBudget :
        {
            id: null,
            name: null, 
            startDate: null, 
            endDate: null
        });

    const setCurrentBudget = useCallback((currentBudget) => setBudget(currentBudget));

    return {budget, setCurrentBudget};
};

export default useBudget;