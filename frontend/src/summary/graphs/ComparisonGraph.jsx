import React, {Fragment, useEffect, useState} from "react";
import '../../../node_modules/react-vis/dist/style.css';
import {XYPlot, XAxis, YAxis, VerticalBarSeries} from 'react-vis';
import DiscreteColorLegend from 'react-vis/dist/legends/discrete-color-legend';
import { Colors } from "./colors";

const ComparisonGraph = ({expenses, revenues, columnNames}) => {
    const [dataExpenses, setDataExpenses] = useState(null);
    const [dataRevenues, setDataRevenues] = useState(null);

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

    return (
        <Fragment>
            {
                dataExpenses && dataRevenues &&
                <div className="flex">
                    <XYPlot margin={{left: 55}} height={300} width={500} xType="ordinal">
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