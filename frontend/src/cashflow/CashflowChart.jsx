import React, {useState, useEffect, useContext} from "react";
import {XYPlot, XAxis, YAxis, VerticalBarSeries} from 'react-vis';
import DiscreteColorLegend from 'react-vis/dist/legends/discrete-color-legend';

import UserContext from "../contexts/user/UserContext";
import BudgetContext from "../contexts/budget/BudgetContext";
import { CashflowClient } from "../clients/CashflowClient";
import { dateRange } from "./cashflowUtils";
import { Colors } from "../summary/graphs/colors";

const CashflowChart = ({type, isActive}) => {
    const cashflowClient = new CashflowClient();

    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);

    const [dates, setDates] = useState(null);
    const [cashflowsRevenues, setCashflowsRevenues] = useState(null);
    const [cashflowsExpenses, setCashflowsExpenses] = useState(null);
    const [formattedData, setFormattedData] = useState(null);
    const [min, setMin] = useState(null);
    const [max, setMax] = useState(null);

    useEffect(() => {
        setDates(dateRange(budget.startDate, budget.endDate));
    }, [budget.startDate, budget.endDate]);   

    useEffect(() => {
        const loadRevenueCashflows = async() => {
            var response = await cashflowClient.getGrouped(user.token, budget.id, type, "revenue");
            setCashflowsRevenues(response.data[0] ? response.data[0].cashflows : []);
        }

        const loadExpensesCashflows = async() => {
            var response = await cashflowClient.getGrouped(user.token, budget.id, type, "expense");
            setCashflowsExpenses(response.data[0] ? response.data[0].cashflows : []);
        }

        if(user.token && budget.id && type){
            loadRevenueCashflows();
            loadExpensesCashflows();
        }
    }, [user.token, budget.id, isActive]);

    useEffect(() => {
        const formatData = () => {
            var formattedDataTemp = [];

            var formattedCashflowsRevenues = [];
            var formattedCashflowsExpenses = [];

            dates.forEach((date) => {
                var dateSplit = date.split("-");
                var year = dateSplit[0];
                var month = dateSplit[1];

                var cashflowRevenue = cashflowsRevenues.find((c) => c.year == year && c.month == month);
                var cashflowExpense = cashflowsExpenses.find((c) => c.year == year && c.month == month);

                if (cashflowRevenue) {
                    formattedCashflowsRevenues.push({x: date, y: type === "estimate" ? cashflowRevenue.estimate : cashflowRevenue.real});
                }
                else {
                    formattedCashflowsRevenues.push({x: date, y: 0});
                }

                if (cashflowExpense) {
                    formattedCashflowsExpenses.push({x: date, y: type === "estimate" ? cashflowExpense.estimate : cashflowExpense.real});
                }
                else {
                    formattedCashflowsExpenses.push({x: date, y: 0});
                }
                });

            formattedDataTemp.push(formattedCashflowsExpenses);
            formattedDataTemp.push(formattedCashflowsRevenues);

            setFormattedData(formattedDataTemp);
        }

        if(dates && cashflowsRevenues && cashflowsExpenses) {
            formatData();
        }
    }, [dates, cashflowsRevenues, cashflowsExpenses]);

    useEffect(() => {
        if (formattedData && formattedData.length == 2){
            var sortedExpenses = formattedData[0].map((exp) => exp.y).sort((a,b) => a-b);
            var sortedRevenues = formattedData[1].map((exp) => exp.y).sort((a,b) => a-b);

            var minExpense = sortedExpenses[0];
            var minRevenue = sortedRevenues[0];
            var maxExpense = sortedExpenses[sortedExpenses.length-1];
            var maxRevenue = sortedRevenues[sortedRevenues.length-1];

            if (minExpense < 0 || minRevenue < 0) {
                setMin(minExpense < minRevenue ? Number(minExpense) : Number(minRevenue));
            }
            else {
                setMin(0);
            }
            setMax(maxExpense > maxRevenue ? Number(maxExpense) : Number(maxRevenue));
        }
    }, [formattedData]);

    return (
        <div>
            <h3>Revenus et dépenses</h3>
                {
                    formattedData && formattedData.length === 2 && min !== null && max !== null && 
                    <div className="flex">
                        <XYPlot height={500} width={700} yDomain={[min, max]} xType="ordinal">
                            <XAxis />
                            <YAxis />
                            <VerticalBarSeries data={formattedData[0]} color={Colors[0]}/>
                            <VerticalBarSeries data={formattedData[1]} color={Colors[2]}/>
                        </XYPlot>
                        <DiscreteColorLegend
                            height={100}
                            width={300}
                            items={[
                                { title: 'Dépenses', color: Colors[0], stroke: '#fff', strokeWidth: '2' },
                                { title: 'Revenus', color: Colors[2], stroke: '#fff', strokeWidth: '2' }
                            ]}
                        />
                    </div>
                    }
        </div>
    );
};

export default CashflowChart;