import React, {useState, useEffect} from "react";
import '../../../node_modules/react-vis/dist/style.css';
import {RadialChart} from 'react-vis';

const PieChart = ({values}) => {
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
        if (values){
            var noOfValues = 0;
            console.log(values)
            values.forEach((val) => {
                if (val.angle != 0)
                    noOfValues = noOfValues + 1;
            });
            setIsValid(noOfValues !== 0);
        }
    }, [values])

    return (
        <div>
            {
                !isValid &&
                <p>Il n'y a pas de données.</p>
            }
            {
                isValid &&
                <RadialChart
                width={500}
                height={350}
                    data={values}
                    labelsRadiusMultiplier={1.2}
                    labelsStyle={{
                        fontSize: 14
                    }}
                    showLabels
                    />
            }
        </div>
    );
};

export default PieChart;