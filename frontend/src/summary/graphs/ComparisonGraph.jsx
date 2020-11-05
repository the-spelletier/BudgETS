import React, {Fragment, useEffect, useState} from "react";
import '../../../node_modules/react-vis/dist/style.css';
import {XYPlot, XAxis, YAxis, VerticalBarSeries} from 'react-vis';
import DiscreteColorLegend from 'react-vis/dist/legends/discrete-color-legend';

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
                <Fragment>
                    <XYPlot height={300} width= {500} xType="ordinal">
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
                        <VerticalBarSeries data={dataExpenses} color='#348c90'/>
                        <VerticalBarSeries data={dataRevenues} color='#0e6569'/>
                    </XYPlot>
                    <DiscreteColorLegend
                    height={80}
                    width={300}
                    items={[
                        { title: 'Dépenses', color: '#348c90', stroke: '#fff', strokeWidth: '2' },
                        { title: 'Revenus', color: '#0e6569', stroke: '#fff', strokeWidth: '2' }
                    ]}
                    />
                </Fragment>
            }
        </Fragment>
    );
};

export default ComparisonGraph;