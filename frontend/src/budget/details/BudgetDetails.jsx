import React, {Fragment, useContext, useEffect, useState} from "react";
import moment from "moment";
import { useHistory } from 'react-router-dom';
import { Card, Input, DatePicker, Button, notification } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

import BudgetHeader from "../header/BudgetHeader";

import BudgetContext from "../../contexts/budget/BudgetContext";
import UserContext from "../../contexts/user/UserContext";

import { BudgetClient } from "../../clients/BudgetClient";

import "./budgetDetails.scss";

const { RangePicker } = DatePicker;

const BudgetDetails = () => {
    const history = useHistory();

    const {budget, setCurrentBudget} = useContext(BudgetContext);
    const {user, setCurrentUser} = useContext(UserContext);

    const budgetClient = new BudgetClient();

    //Validation
    const [error, setError] = useState({name: false})

    const submit = () => {
        const save = async() => {
            try {
                await budgetClient.update(user.token, budget.id, budget.name, budget.startDate, budget.endDate);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                      "Le budget a été modifié avec succès",
                    });
                setCurrentUser({...user, hasMadeChanges: true});

                //force reload
                return history.push("/budget/summary");
            }
            catch (e) {
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en modifiant le budget",
                    });
            }
        };

        if (!budget.name || budget.name === "")
        {
            setError({...error, name: true});
        }
        else {
            save();
        }
    }

    return (
        <Fragment>
            <BudgetHeader />
            <Card className="budget-details-card">
                <div className={error.name === false ? "form-section" : "form-section error"}>
                    <Input className="form-input" 
                        size="large" 
                        value={budget.name}
                        placeholder="Nom du budget"
                        onChange={(event) => setCurrentBudget({...budget, name: event.target.value}) }/>  
                </div>
                <div className="form-section">
                    <RangePicker className="form-input" 
                        size="large" 
                        placeholder={["Date de début", "Date de fin"]}
                        value={[moment(budget.startDate), moment(budget.endDate)]}
                        onChange={(dates) => setCurrentBudget({...budget, startDate: dates[0], endDate: dates[1]})}/>
                </div>
                <div className="form-section submit">
                    <Button size="large"
                        type="primary"
                        onClick={submit}>
                            Modifier
                    </Button>
                </div>
            </Card>
        </Fragment>
    )
};

export default BudgetDetails;