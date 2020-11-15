import React, { useState, useEffect, useContext, Fragment } from "react";
import { Card, Tabs, Table } from "antd";

import UserContext from "../contexts/user/UserContext";
import BudgetContext from "../contexts/budget/BudgetContext";
import { CashflowClient } from "../clients/CashflowClient";
import BudgetHeader from "../budget/header/BudgetHeader";

import CreateOrEditCashflow from "./create-or-edit/CreateOrEditCashflow";
import { dateRange } from "./cashflowUtils";

import "./cashflow.scss";

const { TabPane } = Tabs;

const Cashflow = () => {
    const cashflowClient = new CashflowClient();

    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);

    const [tab, setTab] = useState("estimate");

    const [estimateCashflows, setEstimateCashflows] = useState(null);
    const [realCashflows, setRealCashflows] = useState(null);
    const [dates, setDates] = useState(null);

    const [formattedEstimateCashflows, setFormattedEstimateCashflows] = useState(null);
    const [formattedRealCashflows, setFormattedRealCashflows] = useState(null);

    const [createOrEditModal, setCreateOrEditModal] = useState(false);
    const [currentCashflow, setCurrentCashflow] = useState(null);

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
    }, [budget.id, user.token, createOrEditModal]);

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

                    var cashflow = categoryCashflow.cashflows.find((c) => c.year == year && c.month == month)
                    if(cashflow){
                        cashflows.push({name: date, value: cashflow.estimate, id: cashflow.id});
                    }
                    else {
                        cashflows.push({name: date, value: 0, id: null});
                    }
                });

                formattedEstimateCashflowsTemp.push({categoryName: categoryCashflow.name, categoryId: categoryCashflow.id, cashflows: cashflows});
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

    const openCreateOrEditModal = (data) => {
        setCurrentCashflow(data);
        setCreateOrEditModal(true);
    };

    const closeCreateOrEditModal = () => {
        setCurrentCashflow(null);
        setCreateOrEditModal(false);
    }

    const buildColumnsEstimate = () => {
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
                render: (data) => {
                    const cashflow = data.cashflows.find((c) => c.name === date);
                    if (cashflow) {
                        return (
                            <div className="estimate-cashflow-cell-content" 
                                onClick={() => openCreateOrEditModal({
                                    name: date, 
                                    id: cashflow.id, 
                                    estimate: cashflow.value, 
                                    categoryId: data.categoryId, 
                                    categoryName: data.categoryName})}
                                >
                                {Number(cashflow.value).toFixed(2)}
                            </div>
                        );
                    }
                    else {
                        return (
                            <div className="estimate-cashflow-cell-content" 
                                onClick={() => openCreateOrEditModal({
                                    name: date, 
                                    id: null, 
                                    estimate: 0, 
                                    categoryId: data.categoryId, 
                                    categoryName: data.categoryName})}
                                >
                                {Number(0).toFixed(2)}
                            </div>
                        );
                    }
                },
                className: "estimate-cashflow-cell",
            })
        });

        return columns;
    };

    //We need separe methods to deal with classNames and onClicks. It's clearer than a bunch of ternary operators
    const buildColumnsReal = () => {
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
                    <div className="estimate-cashflow-cell-content-real">
                        {Number(data.cashflows.find((c) => c.name === date).value).toFixed(2)}
                    </div> : 
                    <div className="estimate-cashflow-cell-content-real">
                        {Number(0).toFixed(2)}
                    </div>,
                className: "estimate-cashflow-cell-real",
            })
        });

        return columns;
    };

    return (
        <Fragment>
            <BudgetHeader />
            <h1 className="logo">Cashflow</h1>
            
            <CreateOrEditCashflow visible={createOrEditModal} onCancel={closeCreateOrEditModal} initialCashflow={currentCashflow} />

            <Tabs activeKey={tab} onChange={(key) => setTab(key)}>
                <TabPane tab="Cashflows prévus" key="estimate">
                    {
                        formattedEstimateCashflows && tab === "estimate" &&
                        <Card title={<h2>Cashflows prévus</h2>}>
                            <Table columns={buildColumnsEstimate()} 
                                dataSource={formattedEstimateCashflows} 
                                scroll={{ x: 1500 }} 
                                className="no-paging"/>
                        </Card>
                    }
                </TabPane>
                
                <TabPane tab="Cashflows réels" key="real">
                    {
                        formattedRealCashflows && tab === "real" &&
                        <Card title={<h2>Cashflows réels</h2>}>
                            <Table columns={buildColumnsReal()} 
                                dataSource={formattedRealCashflows} 
                                scroll={{ x: 1500 }} 
                                className="no-paging"/>
                        </Card>
                    }
                </TabPane>
            </Tabs>
        </Fragment>
    );
};

export default Cashflow;