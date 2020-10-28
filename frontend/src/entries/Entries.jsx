import React, { Fragment, useState, useEffect, useContext } from "react";
import moment from "moment";
import { Card, Table, Button, notification } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone } from '@ant-design/icons';
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
    const [currentEntry, setCurrentEntry] = useState(null);
    const [createModalIsVisible, setCreateModalIsVisible] = useState(false);

    const getEntries = async() => {
        var response = await entryClient.getList(user.token, budget.id);
        setEntries(response.data);
    }

    useEffect(() => {
        if (user.token && budget.id) {
            getEntries();
        }
    }, [createModalIsVisible]);

    const onEditEntry = (entry) => {
        setCurrentEntry(entry.id);
        setCreateModalIsVisible(true);
    };

    const onCreateOrEditEntryModalCancel = () => {
        setCurrentEntry(null);
        setCreateModalIsVisible(false);
    };

    const onDeleteEntry = (entry) => {
        const deleteEntry = async () => {
            try {
                await entryClient.delete(user.token, entry.id);
                notification.open({
                message: "Succès",
                icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                description:
                  "L'entrée a été supprimée avec succès",
                });
                
                // Removes from our list
                setEntries(entries.filter(e => e.id !== entry.id));
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                    "Une erreur est survenue en supprimant l'entrée",
                    });
            }
        };

        deleteEntry();
    };

    const columns = [
        {
            title: "",
            render: (entry) => <EditMenu key={entry.id} onNewClick={() => setCreateModalIsVisible(true)} onEditClick={() => onEditEntry(entry)} onDeleteClick={() => onDeleteEntry(entry)} />
        },
        {
            title: "# Facture",
            render: (entry) => entry.receiptCode
        },
        {
            title: "Categorie",
            render: (entry) => entry.categoryName
        },
        {
            title: "Ligne",
            render: (entry) => entry.lineName
        },
        {
            title: "Description",
            render: (entry) => entry.description 
        },
        {
            title: "Membre",
            render: (entry) => entry.memberName 
        },
        {
            title: "Montant",
            render: (entry) => entry.amount ? entry.type === "revenue" ? Number(entry.amount).toFixed(2) : "(" + Number(entry.amount).toFixed(2) + ")" : ""
        },
        {
            title: "Date",
            render: (entry) => moment(entry.date).format("YYYY-MM-DD") 
        },
        {
            title: "Status",
            render: (entry) => entry.entryStatusName 
        }
    ]

    return (
        <Fragment>
            <BudgetHeader />
            <CreateEntry entryId={currentEntry} visible={createModalIsVisible} onCancelParent={onCreateOrEditEntryModalCancel} />
            <Card>
                <Table columns={columns} dataSource={entries} className="no-paging" />
                {
                    entries && entries.length === 0 &&
                    <Button onClick={() => {setCreateModalIsVisible(true)}}>Ajouter une entrée</Button>
                }
            </Card>
        </Fragment>
    );
};

export default Entries;