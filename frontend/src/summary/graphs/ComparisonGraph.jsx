import React, {Fragment, useEffect, useState} from "react";
import '../../../node_modules/react-vis/dist/style.css';
import {XYPlot, XAxis, YAxis, VerticalBarSeries} from 'react-vis';
import DiscreteColorLegend from 'react-vis/dist/legends/discrete-color-legend';
import { Colors } from "./colors";

const ComparisonGraph = ({expenses, revenues, columnNames}) => {
    const [dataExpenses, setDataExpenses] = useState(null);
    const [dataRevenues, setDataRevenues] = useState(null);
    const [min, setMin] = useState(null);
    const [max, setMax] = useState(null);

    useEffect(() => {
        var dataExp = [];
        var dataRev = [];

        const prepareData = () => {
            columnNames.forEach((column, key) => {
                dataExp = [...dataExp, {x: column, y: expenses[key]}];
                dataRev = [...dataRev, {x: column, y: revenues[key]}];
            });
            
            setDataExpenses(dataExp);
            setDataRevenues(dataRev);
        };

        if(columnNames && expenses && revenues){
            prepareData();
        }
    }, [columnNames, expenses, revenues]);

    useEffect(() => {
        if (dataExpenses && dataRevenues){
            var sortedExpenses = dataExpenses.map((exp) => exp.y).sort((a,b) => a-b);
            var sortedRevenues = dataRevenues.map((exp) => exp.y).sort((a,b) => a-b);
            
            var minExpense = Number(sortedExpenses[0]);
            var minRevenue = Number(sortedRevenues[0]);
            var maxExpense = Number(sortedExpenses[sortedExpenses.length-1]);
            var maxRevenue = Number(sortedRevenues[sortedRevenues.length-1]);

            if (minExpense < 0 || minRevenue < 0) {
                setMin(minExpense < minRevenue ? minExpense : minRevenue);
            }
            else {
                setMin(0);
            }
            setMax(maxExpense > maxRevenue ? maxExpense : maxRevenue);
        }

    }, [dataExpenses, dataRevenues]);

    return (
        <Fragment>
            {
                dataExpenses && dataRevenues && min !== null && max !== null && 
                <div className="flex">
                    <XYPlot yDomain={[min, max]} height={400} width={window.innerWidth * 0.50} margin={{left: 100}} xType="ordinal">
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
                        <VerticalBarSeries data={dataExpenses} color={Colors[0]}/>
                        <VerticalBarSeries data={dataRevenues} color={Colors[1]}/>
                    </XYPlot>
                    <DiscreteColorLegend
                        height={80}
                        width={300}
                        items={[
                            { title: 'Dépenses', color: Colors[0], stroke: '#fff', strokeWidth: '2' },
                            { title: 'Revenus', color: Colors[1], stroke: '#fff', strokeWidth: '2' }
                        ]}
                    />
                </div>
            }
        </Fragment>
    );
};

export default ComparisonGraph;