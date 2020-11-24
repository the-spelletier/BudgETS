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

    return (
        <div>
            <h3>Revenus et dépenses</h3>
                {
                    formattedData && formattedData.length === 2 &&
                    <div className="flex">
                        <XYPlot height={500} width={700} xType="ordinal">
                            <XAxis
                                attr="x"
                                attrAxis="y"
                                orientation="bottom"
                            />
                            <YAxis
                                attr="y"
                                attrAxis="x"
                                orientation="left"
                            />
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