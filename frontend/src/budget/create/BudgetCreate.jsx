import React, { useContext, useState } from "react";
import { useHistory } from 'react-router-dom';
import { Card, Input, DatePicker, Button, notification } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
import { BudgetClient } from "../../clients/BudgetClient";
import UserContext from "../../contexts/user/UserContext";
import BudgetContext from "../../contexts/budget/BudgetContext";

const { RangePicker } = DatePicker;

const BudgetCreate = ({ clone }) => {
    const history = useHistory();
    const budgetClient = new BudgetClient();

    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);
    
    //Form info
    const [name, setName] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    //Validation
    const [error, setError] = useState({name: false})

    const changeDates = (dates) => {
        var [startCalendarDate, endCalendarDate] = dates;
        setStartDate(startCalendarDate);
        setEndDate(endCalendarDate);
    }

    const submit = () => {
        const save = async() => {
            try {
                let res = await budgetClient.create(user.token, name, startDate, endDate, false, clone, budget.id);
                notification.open({
                    message: "Succès",
                    icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                    description:
                        clone ? res.request.statusText : "Le budget a été créé avec succès",
                    });

                return history.push("/budget/summary");
            }
            catch (e) {
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                      "Une erreur est survenue en créant le budget",
                    });
            }
        }
        
        if (!name || name === "")
        {
            setError({...error, name: true});
        }
        else {
            save();
        }
    }

    return (
        <div>
            <Card title={<h2>Créer un nouveau budget</h2>}>
                <div className={error.name === false ? "form-section" : "form-section error"}>
                    <Input className="form-input" 
                        size="large" 
                        placeholder="Nom du budget"
                        value={name}
                        onChange={(event) => setName(event.target.value)} />
                </div>
                <div className="form-section">
                    <RangePicker className="form-input" 
                        size="large" 
                        placeholder={["Date de début", "Date de fin"]}
                        value={[startDate, endDate]}
                        onChange={changeDates}/>
                </div>
                <div className="form-section submit">
                    <Button size="large"
                        type="primary"
                        onClick={submit}>
                            Créer
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default BudgetCreate;