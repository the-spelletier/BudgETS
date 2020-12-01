import React, { useState, useContext, useEffect, Fragment } from "react";
import { Card, Spin, Table } from "antd";
import BudgetHeader from "../budget/header/BudgetHeader";
import { CategoryClient } from "../clients/CategoryClient";
import BudgetContext from "../contexts/budget/BudgetContext";
import UserContext from "../contexts/user/UserContext";

const formatCurrency = require('format-currency')

const RevenuesOrExpenses = ({type}) => {
    const categoryClient = new CategoryClient();

    const {budget} = useContext(BudgetContext);
    const {user} = useContext(UserContext);

    const [revenuesOrExpenses, setRevenuesOrExepenses] = useState(null);
    const [headerData, setHeaderData] = useState({total: "Total", estimateTotal: 0, realTotal: 0});

    const headerColumns = [
        {
            title: "",
            colSpan: 1,
            render: () => ""
        },
        {
            title: "",
            colSpan: 2,
            render: () => {
                return {
                    children: "",
                    props: {
                      colSpan: 2,
                    }
                }
            }
        },
        {
            title: "",
            colSpan: 3,
            render: () => {
                return {
                    children: "",
                    props: {
                      colSpan: 3,
                    }
                }
            }
        },
        {
            title: "",
            colSpan: 2,
            render: (val) => {
                return {
                    children: formatCurrency(val.total),
                    props: {
                      colSpan: 2,
                    }
                }
            }
        },
        {
            title: <div className="right-text">Prévisions</div>,
            colSpan: 1,
            render: (val) => type === "revenue" ?
                <div className="right-text">{formatCurrency(val.estimateTotal)}</div> : 
                <div className="right-text">{formatCurrency(val.estimateTotal)}</div>
        },
        {
            title: <div className="right-text">Réel</div>,
            colSpan: 1,
            render: (val) => type === "revenue" ?
                <div className="right-text">{formatCurrency(val.realTotal)}</div> : 
                <div className="right-text">{formatCurrency(val.realTotal)}</div>
        },
        {
            title: <div className="right-text">Reste</div>,
            colSpan: 1,
            render: (val) => type === "revenue" ?
                <div className="right-text">{formatCurrency(val.estimateTotal - val.realTotal)}</div> : 
                <div className="right-text">{formatCurrency(val.estimateTotal - val.realTotal)}</div>
        }
    ];

    const buildColumns = (category) => {
        var estimateTotal = 0;
        var realTotal = 0;
        category.lines.forEach((line) => {
            estimateTotal += Number(line.estimate)
            realTotal += Number(line.real)
        });

        return [
            { 
                title: category.orderNumber.toString().padStart(3, "0"),
                render: ""
            },
            {
                title: category.name,
                colSpan: 2,
                render: (line) => {
                    return {
                        children: <span className="line-id">{line.orderNumber.toString().padStart(3, "0")}</span>,
                        props: {
                          colSpan: 1,
                        }
                    }
                }
            },
            {
                title: "",
                colSpan: 2,
                render: (line) => {
                    return {
                        children: line.name,
                        props: {
                          colSpan: 3,
                        }
                    }
                }
            },
            {
                title: "",
                colSpan: 3,
                render: (line) =>  {
                    return {
                        children: line.description,
                        props: {
                          colSpan: 3,
                        }
                    }
                }
            },
            {
                title: <div className="right-text">{formatCurrency(estimateTotal)}</div>,
                render: (line) => <div className="right-text">{formatCurrency(line.estimate)}</div>
            },
            {
                title: <div className="right-text">{formatCurrency(realTotal)}</div>, 
                render: (line) => <div className="right-text">{formatCurrency(line.real)}</div>
            },
            {
                title: <div className="right-text">{formatCurrency(realTotal)}</div>, 
                render: (line) => <div className="right-text">{formatCurrency(line.estimate - line.real)}</div>
            }
        ]
    };

    useEffect(() => {
        const getRevenuesOrExpenses = async() => {
            var response = await categoryClient.getRevenuesOrExpenses(user.token, budget.id, type);
            
            if (response.data){
                setRevenuesOrExepenses(response.data);
            }
            else {
                setRevenuesOrExepenses([]);
            }

        };

        getRevenuesOrExpenses();
    }, [budget.id]);

    useEffect(() => {
        var estimateTotal = 0;
        var realTotal = 0;

        if(revenuesOrExpenses) {
            revenuesOrExpenses.forEach((revenueOrExpense) => {
                revenueOrExpense.lines.forEach((line) => {
                    estimateTotal += Number(line.estimate);
                    realTotal += Number(line.real);
                })
            });

            setHeaderData({...headerData, estimateTotal: estimateTotal, realTotal: realTotal});
        }
    }, [revenuesOrExpenses]);


    return (
        <Fragment>
            <BudgetHeader/>
            <h1 className="logo">{ type === "revenue" ? "Revenus" : "Dépenses"}</h1>
            <Spin tip="Chargement..." spinning={!revenuesOrExpenses}>
                <Card>
                    {
                        revenuesOrExpenses &&
                        <Fragment>
                            <Table columns={headerColumns} tableLayout="fixed" dataSource={[headerData]} className="no-paging"/>
                            {
                                revenuesOrExpenses.sort(function (a, b){
                                    return a.orderNumber > b.orderNumber;
                                }).map((category) =><Table tableLayout="fixed" className="no-paging" size="small" key={category.id} columns={buildColumns(category)} dataSource={category.lines.sort(function (a, b){
                                    return a.orderNumber > b.orderNumber;
                                })}/>)
                            }
                        </Fragment>
                    }
                </Card>
            </Spin>
        </Fragment>
    );
};

export default RevenuesOrExpenses;