import React, {useEffect, useState, useContext} from "react";
import { notification } from "antd";
import { CloseCircleTwoTone } from '@ant-design/icons';
import { BudgetClient } from "../clients/BudgetClient";
import UserContext from "../contexts/user/UserContext";
import BudgetContextProvider from "../contexts/budget/BudgetContextProvider";

import "./budgetContainer.scss";

const BudgetContainer = ({children}) => {
    const budgetClient = new BudgetClient();
    const {user} = useContext(UserContext);

    const [budget, setBudget] = useState(null);


    useEffect(() => {
        const getActiveBudget = async () => {
            try {
                var response = await budgetClient.getCurrent(user.token);
                setBudget(response.data);
            }
            catch (e) {
                notification.open({
                message: "Erreur",
                icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                description:
                  "Une erreur est survenue en allant chercher le budget sélectionné",
                });
            }
        };

        getActiveBudget();
    }, [])

    return (
        <div>
            {
                budget &&
                <BudgetContextProvider initialBudget={budget}>
                    {children}
                </BudgetContextProvider>
            }
        </div>
    )
};

export default BudgetContainer;