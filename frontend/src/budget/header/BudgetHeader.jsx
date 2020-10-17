import React, {useEffect, useState, useContext} from "react";
import { Link } from 'react-router-dom';
import { Select, Button, notification } from "antd";
import { PlusOutlined, CloseCircleTwoTone } from '@ant-design/icons';

import { BudgetClient } from "../../clients/BudgetClient";

import UserContext from "../../contexts/user/UserContext";
import BudgetContext from "../../contexts/budget/BudgetContext";

import "./budget-header.scss";

const { Option } = Select;

const BudgetHeader = () => {
    const budgetClient = new BudgetClient();
    const {user} = useContext(UserContext);
    const {budget, setCurrentBudget} = useContext(BudgetContext);

    const [budgets, setBudgets] = useState(null);
    const [selectedBudgetId, setSelectedBudgetId] = useState(budget.id);
   
    useEffect(() => {
        const listBudgets = async() => {
            try {
                var response = await budgetClient.list(user.token);
                setBudgets(response.data);
            }
            catch (e) {
                notification.open({
                message: "Erreur",
                icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                description:
                  "Une erreur est survenue en allant chercher les budgets",
                });
            }
        };

        if(user.token){
            listBudgets();
        }
    }, []);

    useEffect(() => {
        const getBudgets = async() => {
            try {
                var response = await budgetClient.get(user.token, selectedBudgetId);
                setCurrentBudget(response.data);
            }
            catch (e) {
                notification.open({
                message: "Erreur",
                icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                description:
                  "Une erreur est survenue en allant chercher le budget sélectionné",
                });
            }
        }

        if(user.token){
            getBudgets();
        }
    }, [selectedBudgetId]);


    return (
        <div className="header">
            {
                budgets &&
                <Select defaultValue={selectedBudgetId} size="large" onChange={(value) => setSelectedBudgetId(value)}>
                    {budgets.map((option) => 
                        <Option key={option.id} value={option.id}><h2 className="budget-select-option">{option.name}</h2></Option>
                    )}
                </Select>
            }
            <Button className="new-budget-button"
                size="large" 
                type="primary" 
                onClick={() => {return null}}>
                    <Link to="/budget/clone"><PlusOutlined /> Clôner</Link>
            </Button>
            <Button className="new-budget-button"
                size="large" 
                type="primary" 
                onClick={() => {return null}}>
                    <Link to="/budget/create"><PlusOutlined /> Nouveau</Link>
            </Button>
        </div>
    );
};

export default BudgetHeader;