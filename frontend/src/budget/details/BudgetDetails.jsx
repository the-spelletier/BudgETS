import React, {Fragment, useContext, useEffect, useState} from "react";
import moment from "moment";
import { useHistory } from 'react-router-dom';
import { Card, Input, DatePicker, Button, notification, Select } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';

import BudgetHeader from "../header/BudgetHeader";

import BudgetContext from "../../contexts/budget/BudgetContext";
import UserContext from "../../contexts/user/UserContext";

import { BudgetClient } from "../../clients/BudgetClient";
import { AccessClient } from "../../clients/AccessClient";
import { UserClient } from "../../clients/UserClient";

import "./budgetDetails.scss";

const { RangePicker } = DatePicker;

const BudgetDetails = () => {
    const history = useHistory();

    const {budget, setCurrentBudget} = useContext(BudgetContext);
    const {user, setCurrentUser} = useContext(UserContext);

    const budgetClient = new BudgetClient();
    const accessClient = new AccessClient();
    const userClient = new UserClient();

    //Validation
    const [error, setError] = useState({name: false})
    
    const [initialBudget, setInitialBudget] = useState(null);
    const [accesses, setAccesses] = useState(null);
    const [users, setUsers] = useState(null);

    const getAccesses = async() => {
        var response = await accessClient.getAll(user.token, budget.id);
        setAccesses(response.data.length > 0 ? response.data.map(a => a.userId) : []);
    }

    const getUsers = async() => {
        var response = await userClient.getAll(user.token);
        setUsers(response.data.length > 0 ? response.data : [{}]);
    }

    useEffect(() => {
        setInitialBudget(budget);
    }, []);

    useEffect(() => {
        getAccesses();
        getUsers();
    }, [budget]);

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

    const onCreateAccess = (userId) => {
        const createAccess = async () => {
            try {
                await accessClient.create(user.token, budget.id, userId);
                    notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description: "L'accès a été ajouté avec succès",
                });

                getAccesses();
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description: "Une erreur est survenue en ajoutant l'accès",
                });
            }
        };

        createAccess();
    };

    const onDeleteAccess = (userId) => {

        const deleteAccess = async () => {
            try {
                await accessClient.delete(user.token, budget.id, userId);
                notification.open({
                message: "Succès",
                icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                description:
                  "L'accès a été supprimé avec succès",
                });
                
                getAccesses();
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                    "Une erreur est survenue en supprimant l'accès",
                    });
            }
        };

        deleteAccess();
    };

    return (
        <Fragment>
            <BudgetHeader />
            { budget && initialBudget &&
                <Fragment>
                <h1 className="logo">Détails</h1>
                <Card title={ <h2>Modifier le budget</h2> } className="budget-details-card">
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
                            disabled={budget.endDate == initialBudget.endDate 
                                && budget.startDate == initialBudget.startDate 
                                && budget.name == initialBudget.name}
                            onClick={submit}>
                                Modifier
                        </Button>
                    </div>
                </Card>
                <Card title={ <h2>Ajouter des accès en lecture</h2> }>
                    {
                        users && accesses &&
                        <Select
                            mode="multiple"
                            placeholder="Accès en lecture"
                            size="large" 
                            style={{ width: '100%' }}
                            dropdownMatchSelectWidth={false}
                            value={accesses}
                            onSelect={onCreateAccess}
                            onDeselect={onDeleteAccess}
                            filterOption={(input, option) =>  
                                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 
                                || option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            >
                            {
                                users.map((option) => 
                                    <Select.Option key={option.id} value={option.id}>
                                        {option.username}
                                    </Select.Option>)
                            }
                        </Select>
                    }
                </Card>
                </Fragment>
            }
            {
                !budget &&
                <p>Il n'y a pas de budget. Veuillez en créer un.</p>
            }
        </Fragment>
    )
};

export default BudgetDetails;