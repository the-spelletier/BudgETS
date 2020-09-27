import React, {useEffect, useState, useContext} from "react";
import { Select } from "antd";
import { BudgetClient } from "../clients/BudgetClient";
import { notification } from 'antd';
import UserContext from "../contexts/user/UserContext";

import "./budgetContainer.scss";

const { Option } = Select;

const BudgetContainer = ({children}) => {
    const budgetClient = new BudgetClient();
    const {user} = useContext(UserContext);

    const [selectedBudgetId, setSelectedBudgetId] = useState(null);
    const [budgets, setBudgets] = useState(null);
    
    useEffect(() => {
        const listBudgets = async() => {
            //TODO: remove after testing with db
            const mockBudgets = [{id: 1, name: "Budget 2018"}, {id: 2, name: "Budget 2019"}, {id: 3, name: "Budget 2020"}];
            
            try {
                var response = await budgetClient.list(user.token);
                //TODO: make sure it works with backend data
                setBudgets(response.data);
            }
            catch (e) {
                notification.open({
                message: "Erreur",
                description:
                  "Une erreur est arrivée en allant chercher les budgets",
                });
                
                //TODO: remove this when backend works
                setBudgets(mockBudgets);
            }
        }

        if(user.token){
            listBudgets();
        }
    }, [])

    useEffect(() => {
        if (selectedBudgetId !== null) {
            //Call backend to select current budget
        }
    }, [selectedBudgetId])

    return (
        <div>
            <div className="header">
                {
                    budgets &&
                    <Select defaultValue={1} size="large" onChange={(value) => setSelectedBudgetId(value)}>
                        {budgets.map((option) => 
                            <Option value={option.id}><h2 className="budget-select-option">{option.name}</h2></Option>
                        )}
                    </Select>
                }
            </div>
            {children}
        </div>
    )
};

export default BudgetContainer;