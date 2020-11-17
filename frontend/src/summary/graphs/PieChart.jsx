import React, {useState, useEffect} from "react";
import '../../../node_modules/react-vis/dist/style.css';
import {RadialChart} from 'react-vis';
import DiscreteColorLegend from 'react-vis/dist/legends/discrete-color-legend';

const PieChart = ({values}) => {
    const [isValid, setIsValid] = useState(null);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        if (values){
            var totalValue = 0;
            var noOfValues = 0;
            values.forEach((val) => {
                if (val.angle != 0)
                {
                    noOfValues = noOfValues + 1;
                    totalValue += Number(val.angle);
                }
            });
            setTotal(totalValue);
            setIsValid(noOfValues !== 0);
        }
    }, [values]);

    return (
        <div>
            {
                !isValid &&
                <p>Il n'y a pas de données.</p>
            }
            {
                isValid &&
                <div className="flex">
                <RadialChart
                    width={500}
                    height={350}
                    data={values.filter(v => v.angle != 0)}
                    colorType="literal"
                    />
                <DiscreteColorLegend
                    height={300}
                    width={300}
                    items={
                        values.filter(v => v.angle != 0)
                            .map((val) => {return {title: val.label + " (" + Number(100 * val.angle / (total == 0? 1 : total)).toFixed(2) + "%)", color: val.color, stroke: '#fff', strokeWidth: '10'}})
                        }
                    />
                </div>
            }
        </div>
    );
};

export default PieChart;