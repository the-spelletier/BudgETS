import React, { useState, useEffect, useContext, Fragment } from "react";
import { Card } from "antd";
import moment from "moment";

import UserContext from "../contexts/user/UserContext";
import BudgetContext from "../contexts/budget/BudgetContext";
import { CashflowClient } from "../clients/CashflowClient";
import BudgetHeader from "../budget/header/BudgetHeader";
import { dateRange } from "./cashflowUtils";
import { Table } from "antd";

import "./cashflow.scss";

const Cashflow = () => {
    const cashflowClient = new CashflowClient();

    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);

    const [estimateCashflows, setEstimateCashflows] = useState(null);
    const [realCashflows, setRealCashflows] = useState(null);
    const [dates, setDates] = useState(null);

    const [formattedEstimateCashflows, setFormattedEstimateCashflows] = useState(null);
    const [formattedRealCashflows, setFormattedRealCashflows] = useState(null);

    const [createOrEditModal, setCreateOrEditModal] = useState(false);

    useEffect(() => {
        const fetchEstimateCashflow = async () => {
            var response = await cashflowClient.get(user.token, budget.id, "estimate");
            setEstimateCashflows(response.data);
        };
        
        const fetchRealCashflow = async () => {
            var response = await cashflowClient.get(user.token, budget.id, "real");
            setRealCashflows(response.data);
        };     

        if(budget.id && user.token){
            fetchEstimateCashflow();
            fetchRealCashflow();
        }
    }, [budget.id, user.token]);

    useEffect(() => {
        setDates(dateRange(budget.startDate, budget.endDate));
    }, [budget.startDate, budget.endDate]);    

    //Data formatting
    useEffect(() => {
        if (dates && estimateCashflows) {
            var formattedEstimateCashflowsTemp = [];

            estimateCashflows.forEach((categoryCashflow) => {
                var cashflows = [];
                dates.forEach((date) => {
                    var dateSplit = date.split("-");
                    var year = dateSplit[0];
                    var month = dateSplit[1];

                    var cashflow = categoryCashflow.cashflows.find((c) => c.year === year && c.month === month)
                    if(cashflow){
                        cashflows.push({name: date, value: cashflow.estimate});
                    }
                    else {
                        cashflows.push({name: date, value: 0});
                    }
                });

                formattedEstimateCashflowsTemp.push({categoryName: categoryCashflow.name, cashflows: cashflows});
            });

            setFormattedEstimateCashflows(formattedEstimateCashflowsTemp);
        }

        if (dates && realCashflows) {
            var formattedRealCashflowsTemp = [];

            realCashflows.forEach((categoryCashflow) => {
                var cashflows = [];
                dates.forEach((date) => {
                    var dateSplit = date.split("-");
                    var year = dateSplit[0];
                    var month = dateSplit[1];

                    var cashflow = categoryCashflow.cashflows.find((c) => c.year === Number(year) && c.month === Number(month));
                    
                    if(cashflow){
                        cashflows.push({name: date, value: cashflow.real});
                    }
                    else {
                        cashflows.push({name: date, value: 0});
                    }
                });

                formattedRealCashflowsTemp.push({categoryName: categoryCashflow.name, cashflows: cashflows});
            });

            setFormattedRealCashflows(formattedRealCashflowsTemp);
        }
    }, [dates, estimateCashflows, realCashflows]);

    const buildColumns = () => {
        var columns = [
            {
                title: "Catégorie",
                render: (data) => data.categoryName,
                width: "15%",
                fixed: "left"
            }
        ];

        dates.forEach((date) => {
            columns.push({
                title: date,
                render: (data) => data.cashflows.find((c) => c.name === date) ? 
                    <div className="estimate-cashflow-cell-content" onClick={() => setCreateOrEditModal(true)}>
                        {Number(data.cashflows.find((c) => c.name === date).value).toFixed(2)}
                    </div> : 
                    <div className="estimate-cashflow-cell-content" onClick={() => setCreateOrEditModal(true)}>
                        {Number(0).toFixed(2)}
                    </div>,
                className: "estimate-cashflow-cell",
            })
        });

        return columns;
    };

    return (
        <Fragment>
            <BudgetHeader />
            <h1 className="logo">Cashflow</h1>
            {
                formattedEstimateCashflows &&
                <Card title={<h2>Cashflows prévus</h2>} >
                    <Table columns={buildColumns()} 
                        dataSource={formattedEstimateCashflows} 
                        scroll={{ x: 1500 }} 
                        className="no-paging"/>
                </Card>
            }
            {
                formattedRealCashflows &&
                <Card title={<h2>Cashflows réels</h2>} >
                    <Table columns={buildColumns()} 
                        dataSource={formattedRealCashflows} 
                        scroll={{ x: 1500 }} 
                        className="no-paging"/>
                </Card>
            }
        </Fragment>
    );
};

export default Cashflow;