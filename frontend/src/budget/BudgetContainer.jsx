import React, {useEffect, useState, useContext} from "react";
import { Link } from 'react-router-dom';
import { Select, Button, notification } from "antd";
import { PlusOutlined, CloseCircleTwoTone } from '@ant-design/icons';
import { BudgetClient } from "../clients/BudgetClient";
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
            try {
                var response = await budgetClient.list(user.token);
                setBudgets(response.data);
            }
            catch (e) {
                notification["error"].open({
                message: "Erreur",
                icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                description:
                  "Une erreur est survenue en allant chercher les budgets",
                });
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
                    <Select defaultValue={budgets.find((value) => value.isActive).id} size="large" onChange={(value) => setSelectedBudgetId(value)}>
                        {budgets.map((option) => 
                            <Option key={option.id} value={option.id}><h2 className="budget-select-option">{option.name}</h2></Option>
                        )}
                    </Select>
                }
                <Button className="new-budget-button"
                    size="large" 
                    type="primary" 
                    onClick={() => {return null}}>
                        <Link to="/budget/create"><PlusOutlined /> Nouveau</Link>
                </Button>
            </div>
            {children}
        </div>
    )
};

export default BudgetContainer;