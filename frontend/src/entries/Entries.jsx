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
        setEntries(response.data.sort(function (a, b){
            return a.date < b.date;
        }));
    }

    useEffect(() => {
        if (user.token && budget.id) {
            getEntries();
        }
    }, [createModalIsVisible, budget.id]);

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
            render: (entry) => entry.receiptCode,
            sorter: (a, b) => a.receiptCode.localeCompare(b.receiptCode)
        },
        {
            title: "Categorie",
            render: (entry) => entry.categoryName,
            sorter: (a, b) => a.categoryName.localeCompare(b.categoryName)
        },
        {
            title: "Ligne",
            render: (entry) => entry.lineName,
            sorter: (a, b) => a.lineName.localeCompare(b.lineName)
        },
        {
            title: "Description",
            render: (entry) => entry.description ,
            sorter: (a, b) => a.description.localeCompare(b.description)
        },
        {
            title: "Membre",
            render: (entry) => entry.memberName ,
            sorter: (a, b) => a.memberName.localeCompare(b.memberName)
        },
        {
            title: "Montant",
            render: (entry) => entry.amount ? entry.type === "revenue" ? Number(entry.amount).toFixed(2) : "(" + Number(entry.amount).toFixed(2) + ")" : "",
            sorter: (a, b) => a.amount - b.amount
        },
        {
            title: "Date",
            render: (entry) => moment(entry.date).format("YYYY-MM-DD"),
            defaultSortOrder: 'descend',
            sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix()
        },
        {
            title: "Status",
            render: (entry) => entry.entryStatusName ,
            sorter: (a, b) => a.entryStatusName.localeCompare(b.entryStatusName)
        }
    ]

    return (
        <Fragment>
            <BudgetHeader />
            <h1 className="logo">Entrées</h1>
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