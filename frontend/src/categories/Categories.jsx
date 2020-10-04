import React, { Fragment } from "react";
import { Table, Button, Popover, Card} from "antd";
import { SettingOutlined } from '@ant-design/icons';

import EditableTable from "../components/editable-table/EditableTable";
import EditMenu from "../components/edit-menu/EditMenu";
import "./categories.scss";
import BudgetHeader from "../budget/header/BudgetHeader";

const Categories = () => {
    // TODO : get data from backend
    const sampleData = [
        {
            id: "1",
            name: "Cat 1",
            type: "R", 
            lines: [
                {
                    id: 1,
                    name: "line 1",
                    description: "My cool first description",
                    estimate: 100
                },
                {
                    id: 2,
                    name: "line 2",
                    description: "My cool second description",
                    estimate: 30
                }
            ]
        },
        {
            id: "2",
            name: "Cat 2",
            type: "D", 
            lines: [
                {
                    id: 1,
                    name: "line 1",
                    description: "My cool first description",
                    estimate: 100
                },
                {
                    id: 2,
                    name: "line 2",
                    description: "My cool second description",
                    estimate: 30
                }
            ]
        }
    ]

    // TODO : get data from backend
    const headerData = {total: "Total", estimateTotal: 0, realTotal: 0};

    const buildColumns = (category) => {
        var totalEstimate = 0;
        category.lines.forEach((line) => totalEstimate += line.estimate);

        return [
            {
                title: <EditMenu />,
                render: () => ""
            },
            { 
                title: category.id,
                render: () => <EditMenu /> 
            },
            {
                title: category.name,
                render: () => ""
            },
            {
                title: "",
                render: (line) => line.id
            },
            {
                title: "",
                render: (line) => line.name
            },
            {
                title: "",
                render: (line) => line.description
            },
            {
                title: totalEstimate,
                render: (line) => category.type === "R" ? line.estimate : "( " + line.estimate + " )"
            },
            {
                title: "0", 
                render: () => 0
            }
        ]
    };

    const headerColumns = [
        {
            title: "",
            render: () => ""
        },
        {
            title: "",
            render: () => ""
        },
        {
            title: "",
            render: () => ""
        },
        {
            title: "",
            render: () => ""
        },
        {
            title: "",
            render: (val) => val.total
        },
        {
            title: "Prévisions",
            render: (val) => val.estimateTotal
        },
        {
            title: "Réel",
            render: (val) => val.realTotal
        }
    ];

    return (
        <Fragment>
            <BudgetHeader />
            <Card>
                <Table columns={headerColumns} dataSource={[headerData]} className="no-paging"/>
                {
                    sampleData.map((category) => <EditableTable columns={buildColumns(category)} values={category.lines}/>)
                }    
            </Card>
        </Fragment>
    );
};

export default Categories;