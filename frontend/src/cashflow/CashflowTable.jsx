import React, { useState, useEffect, useContext, Fragment } from "react";
import { Card, Table } from "antd";

import UserContext from "../contexts/user/UserContext";
import BudgetContext from "../contexts/budget/BudgetContext";
import { CashflowClient } from "../clients/CashflowClient";
import CreateOrEditCashflow from "./create-or-edit/CreateOrEditCashflow";
import { dateRange } from "./cashflowUtils";

const CashflowTable = ({cashflowType, categoryType}) => {
    const cashflowClient = new CashflowClient();

    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);

    const [dates, setDates] = useState(null);
    const [cashflows, setCashflows] = useState(null);
    const [formattedCashflows, setFormattedCashflows] = useState(null);

    const [createOrEditModal, setCreateOrEditModal] = useState(false);
    const [currentCashflow, setCurrentCashflow] = useState(null);

    const openCreateOrEditModal = (data) => {
        setCurrentCashflow(data);
        setCreateOrEditModal(true);
    };

    const closeCreateOrEditModal = () => {
        setCurrentCashflow(null);
        setCreateOrEditModal(false);
    }

    useEffect(() => {
        setDates(dateRange(budget.startDate, budget.endDate));
    }, [budget.startDate, budget.endDate]);   

    useEffect(() => {
        const loadCashflows = async() => {
            var response = await cashflowClient.get(user.token, budget.id, cashflowType, categoryType);
            setCashflows(response.data);
        }

        if(user.token && budget.id && cashflowType && categoryType){
            loadCashflows();
        }
    }, [user.token, budget.id, createOrEditModal]);

    useEffect(() => {
        const formatCashflows = () => {
            const formattedCashflowsTemp = [];
            cashflows.forEach((categoryCashflows) => {
                var cashflowsTemp = [];
                dates.forEach((date) => {
                    var dateSplit = date.split("-");
                    var year = dateSplit[0];
                    var month = dateSplit[1];

                    var currCashflow = categoryCashflows.cashflows ? categoryCashflows.cashflows.find((c) => c.year == year && c.month == month) : null;
                    if (currCashflow) {
                        var value = cashflowType === "estimate" ? currCashflow.estimate : currCashflow.real;
                        cashflowsTemp.push({
                            id: currCashflow.id,
                            name: date,
                            value: value
                        });
                    }
                    else {
                        cashflowsTemp.push({
                            id: null,
                            name: date,
                            value: 0
                        }); 
                    }
                });

                formattedCashflowsTemp.push({
                    categoryName: categoryCashflows.name,
                    categoryId: categoryCashflows.id,
                    cashflows: cashflowsTemp
                });

                setFormattedCashflows(formattedCashflowsTemp)
            })
        };

        if (cashflows && dates){
            formatCashflows();
        }
    }, [cashflows]);
    
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
                className: "estimate-cashflow-cell",
                render: (data) => {
                    const cashflow = data.cashflows.find((c) => c.name === date);
                    if (cashflow) {
                        return (
                            <div className={cashflowType === "estimate" ? "estimate-cashflow-cell-content" : "estimate-cashflow-cell-content-real" }
                                onClick={() =>  cashflowType === "estimate" ? openCreateOrEditModal({
                                    name: date, 
                                    id: cashflow.id, 
                                    estimate: cashflow.value, 
                                    categoryId: data.categoryId, 
                                    categoryName: data.categoryName}) : null}
                                >
                                {Number(cashflow.value).toFixed(2)}
                            </div>
                        );
                    }
                    else {
                        return (
                            <div className={cashflowType === "estimate" ? "estimate-cashflow-cell-content" : "estimate-cashflow-cell-content-real" }
                                onClick={() => cashflowType === "estimate" ? openCreateOrEditModal({
                                    name: date, 
                                    id: null, 
                                    estimate: 0, 
                                    categoryId: data.categoryId, 
                                    categoryName: data.categoryName}) : null}
                                >
                                {Number(0).toFixed(2)}
                            </div>
                        );
                    }
                }
            })
        })
    
        return columns;
    }

    return (
        <Fragment>
            <CreateOrEditCashflow visible={createOrEditModal} onCancel={closeCreateOrEditModal} initialCashflow={currentCashflow} />
            <Card title={<h2>Cashflows {cashflowType === "estimate" ? "prévus" : "réels"} ({categoryType === "revenue" ? "Revenus" : "Dépenses"})</h2>}>
                  {
                      formattedCashflows && 
                      <Table 
                        columns={buildColumns()}
                        dataSource={formattedCashflows} 
                        scroll={{x:1500}}
                        className={formattedCashflows.lenght > 10 ? "" : "no-paging"}
                        />  
                  }
                  {
                      !formattedCashflows && 
                      <Table loading={true} />
                  }
            </Card>
        </Fragment>
    );

};

export default CashflowTable;