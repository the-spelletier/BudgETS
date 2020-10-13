import React, { Fragment, useState, useEffect, useContext } from "react";
import { Card, Table, Button } from "antd";
import BudgetHeader from "../budget/header/BudgetHeader"; 
import CreateEntry from "./create/CreateEntry";
import EditMenu from "../components/edit-menu/EditMenu";
import { EntryClient } from "../clients/EntryClient";
import UserContext from "../contexts/user/UserContext";
import BudgetContext from "../contexts/budget/BudgetContext";

const Entries = () => {
    const entryClient = new EntryClient();
    
    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);

    const [entries, setEntries] = useState(null);
    const [createModalIsVisible, setCreateModalIsVisible] = useState(false);

    useEffect(() => {
        const getEntries = async() => {
            var response = await entryClient.getList(user.token, budget.id);
            setEntries(response.data.length > 0 ? response.data : [{}]);
        }

        getEntries();
    }, [createModalIsVisible]);

    const columns = [
        {
            title: "",
            render: (entry) => <EditMenu key={entry.id} onNewClick={() => setCreateModalIsVisible(true)} />
        },
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
            render: (entry) => entry.amount ? entry.type === "revenue" ? entry.amount : "(" + entry.amount + ")" : ""
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
            <CreateEntry visible={createModalIsVisible} onCancel={() => setCreateModalIsVisible(false)} />
            <Card>
                <Table columns={columns} dataSource={entries} className="no-paging" />
            </Card>
        </Fragment>
    );
};

export default Entries;