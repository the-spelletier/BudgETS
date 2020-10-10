import React, { Fragment } from "react";
import { Card, Table } from "antd";
import BudgetHeader from "../budget/header/BudgetHeader";
import { useState } from "react";
import { useEffect } from "react";

const Entries = () => {
    const [entries, setEntries] = useState(null);

    //On load, get entries for budget
    useEffect(() => {
        const getEntries = async() => {
            //TODO : call client 
            //Set entries
        }

        // TODO : Remove
        setEntries([
            {
                type : "revenue", 
                categoryId : "001", 
                lineId : "001", 
                receiptId : "20201008R001001001", 
                member : "Veronique Bergeron", 
                description : "Une courte description", 
                date : "2020-10-09", 
                amount: 10,
                status : "Not Sent"
            },
            {
                type : "revenue", 
                categoryId : "001", 
                lineId : "001", 
                receiptId : "20201008R001001002", 
                member : "Veronique Bergeron", 
                description : "Une courte description", 
                date : "2020-10-09", 
                amount: 30,
                status : "Sent"
            },
            {
                type : "depense", 
                categoryId : "002", 
                lineId : "001", 
                receiptId : "20201008R002001001", 
                member : "Veronique Bergeron", 
                description : "Une courte description", 
                date : "2020-10-09", 
                amount: 60,
                status : "Not Sent"
            }
        ]);

        getEntries();
    }, []);

    const columns = [
        {
            title: "# Facture",
            render: (entry) => entry.receiptId 
        },
        {
            title: "Categorie",
            render: (entry) => entry.categoryId 
        },
        {
            title: "Ligne",
            render: (entry) => entry.lineId 
        },
        {
            title: "Description",
            render: (entry) => entry.description 
        },
        {
            title: "Membre",
            render: (entry) => entry.member 
        },
        {
            title: "Montant",
            render: (entry) => entry.type === "revenue" ? entry.amount : "(" + entry.amount + ")" 
        },
        {
            title: "Date",
            render: (entry) => entry.date 
        },
        {
            title: "Status",
            render: (entry) => entry.status 
        }
    ]

    return (
        <Fragment>
            <BudgetHeader />
            <Card>
                <Table columns={columns} dataSource={entries} className="no-paging" />
            </Card>
        </Fragment>
    );
};

export default Entries;