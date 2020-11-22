import React, { useState, Fragment } from "react";
import { Card, Tabs } from "antd";
import BudgetHeader from "../budget/header/BudgetHeader";

import CashflowTable from "./CashflowTable";
import CashflowChart from "./CashflowChart";
import "./cashflow.scss";

const { TabPane } = Tabs;

const Cashflow = () => {
    const [tab, setTab] = useState("estimate");

    return (
        <Fragment>
            <BudgetHeader />
            <h1 className="logo">Cashflow</h1>
            <Tabs activeKey={tab} onChange={(key) => setTab(key)}>
                <TabPane tab="Graphes de cashflows" key="graph">
                    <Card title={<h2>Prévisions</h2>}>
                        <CashflowChart type="estimate" isActive={tab==="graph"} />
                    </Card>
                    <Card title={<h2>Réels</h2>}>
                        <CashflowChart type="real" isActive={tab==="graph"} />
                    </Card>
                </TabPane>
                <TabPane tab="Cashflows prévus" key="estimate">
                    {
                        tab === "estimate" &&
                        <Fragment>
                            <CashflowTable cashflowType="estimate" categoryType="revenue" />
                            <CashflowTable cashflowType="estimate" categoryType="expense" />
                        </Fragment>
                    }
                </TabPane>
                
                <TabPane tab="Cashflows réels" key="real">
                    {
                        tab === "real" &&
                        <Fragment>
                            <CashflowTable cashflowType="real" categoryType="revenue" />
                            <CashflowTable cashflowType="real" categoryType="expense" />
                        </Fragment>
                    }
                </TabPane>
            </Tabs>
        </Fragment>
    );
};

export default Cashflow;