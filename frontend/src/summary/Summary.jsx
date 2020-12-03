import React, { Fragment, useContext, useEffect, useState } from "react";

import BudgetHeader from "../budget/header/BudgetHeader";
import UserContext from "../contexts/user/UserContext";
import BudgetContext from "../contexts/budget/BudgetContext";
import { BudgetClient } from "../clients/BudgetClient";
import { Table, Card } from "antd";
import ComparisonGraph from "./graphs/ComparisonGraph";
import PieChart from "./graphs/PieChart";
import { Colors } from "./graphs/colors";

const formatCurrency = require('format-currency')

const Summary = () => {
    const budgetClient = new BudgetClient();

    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);

    const [summary, setSummary] = useState(null);
    const [formattedSummary, setFormattedSummary] = useState(null);

    const [revenueCategories, setRevenueCategories] = useState(null);
    const [expensesCategories, setExpenseCategories] = useState(null);

    const [formattedRevenueCategories, setFormattedRevenueCategories] = useState(null);
    const [formattedExpenseCategories, setFormattedExpenseCategories] = useState(null);

    useEffect(() => {
        const getSummary = async() => {
            var response = await budgetClient.getSummary(user.token, budget.id);
            setSummary(response.data);
        };

        const getChartInfo = async() => {
            var response = await budgetClient.getSummaryCategories(user.token, budget.id);
            setRevenueCategories([...response.data].filter((cat) => cat.type === "revenue"));
            setExpenseCategories([...response.data].filter((cat) => cat.type === "expense"));
        }

        if(budget.id && user.token) {
            getSummary();
            getChartInfo();
        }
    }, [budget.id])

    useEffect(() => {
        const format = () => {
            var formatted = [];
            var i = 0;
            revenueCategories.forEach((category) => {
                formatted = [...formatted, {label: category.name, angle: category.real, color: Colors[i]}];
                //We have 16 colors. 
                i < Colors.length ? i++ : i = 0;
            });
            setFormattedRevenueCategories(formatted);
        }

        if (revenueCategories)
            format();
    }, [revenueCategories]);

    useEffect(() => {
        const format = () => {
            var formatted = [];
            var i = 0;
            expensesCategories.forEach((category) => {
                formatted = [...formatted, {label: category.name, angle: category.real, color: Colors[i]}];
                //We have 16 colors. 
                i < Colors.length ? i++ : i = 0;
            });
            setFormattedExpenseCategories(formatted);
        }

        if (expensesCategories)
            format();
    }, [expensesCategories]);

    useEffect(() => {
        const format = () => {
            var formatted = {
                columnsNames : [],
                expenses : [],
                revenues : [],
                totals : [],
                percentOver : []
            };
            
            formatted.columnsNames = [...formatted.columnsNames,  summary.currentBudget.name + " réel"];
            formatted.columnsNames = [...formatted.columnsNames,  summary.currentBudget.name + "  prévu"];

            formatted.expenses = [...formatted.expenses, Number(summary.currentBudget.expense.real)];
            formatted.expenses = [...formatted.expenses, Number(summary.currentBudget.expense.estimate)];

            formatted.revenues = [...formatted.revenues, Number(summary.currentBudget.revenue.real)];
            formatted.revenues = [...formatted.revenues, Number(summary.currentBudget.revenue.estimate)];

            formatted.totals = [...formatted.totals, Number(summary.currentBudget.revenue.real) - Number(summary.currentBudget.expense.real)];
            formatted.totals = [...formatted.totals, Number(summary.currentBudget.revenue.estimate) - Number(summary.currentBudget.expense.estimate)];
            
            formatted.percentOver = [...formatted.percentOver, ((Number(summary.currentBudget.revenue.real)/Number(summary.currentBudget.expense.real == 0 ? 1 : summary.currentBudget.expense.real)) - 1) * 100];
            formatted.percentOver = [...formatted.percentOver, ((Number(summary.currentBudget.revenue.estimate)/Number(summary.currentBudget.expense.estimate == 0 ? 1 : summary.currentBudget.expense.estimate)) - 1) * 100];
            
            summary.previousBudgets.forEach((budget) => {
                formatted.columnsNames = [...formatted.columnsNames, budget.name + " réel"];
                formatted.expenses = [...formatted.expenses, budget.expense.real]; 
                formatted.revenues = [...formatted.revenues, budget.revenue.real];
                formatted.totals = [...formatted.totals, Number(budget.revenue.real) - Number(budget.expense.real)];
                formatted.percentOver = [...formatted.percentOver, ((Number(budget.revenue.real)/Number(budget.expense.real === 0? 1 : budget.expense.real)) - 1) * 100];
            });         
            
            setFormattedSummary(formatted);
        };       
        
        if (summary && summary.currentBudget && summary.previousBudgets){
            format();
        }
    }, [summary]);

    const buildColumns = () => {
        var columns = [];

        columns = [...columns, 
            {
                title : "",
                render : (line) => line.name 
            }
        ];

        formattedSummary.columnsNames.forEach((column, key) => {
            columns = [...columns,
                {
                    title: column,
                    render: (line) => formatCurrency(line.values[key])
                }
            ];
        });

        return columns;
    }

    return (
        <Fragment>
            <BudgetHeader />
                <div>
                    <div>
                    {
                        formattedSummary && formattedSummary.columnsNames.length > 0 &&
                        <Fragment>
                            <h1 className="logo">Sommaire</h1>
                            <Card>
                                <Table columns={buildColumns()} 
                                    className="no-paging"
                                    tableLayout="fixed" 
                                    size="small"
                                    dataSource={
                                        [{name: "Dépenses", values: formattedSummary.expenses},
                                        {name: "Revenus", values: formattedSummary.revenues},
                                        {name: "Total ($)", values: formattedSummary.totals},
                                        {name: "Dépassement (%)", values: formattedSummary.percentOver}]
                                    }/>
                            </Card>
                            <Card>
                                <ComparisonGraph expenses={formattedSummary.expenses} revenues={formattedSummary.revenues} columnNames={formattedSummary.columnsNames}/>
                            </Card>
                            {
                                formattedExpenseCategories &&
                                <Card>
                                    <h2>Dépenses</h2>
                                    <PieChart values={formattedExpenseCategories} />
                                </Card>
                            }
                            {
                                formattedRevenueCategories &&
                                <Card>
                                    <h2>Revenus</h2>
                                    <PieChart values={formattedRevenueCategories} />
                                </Card>
                            }
                        </Fragment>
                    }
                    </div>
                    <div></div>
                </div>
        </Fragment>
    );
};

export default Summary;