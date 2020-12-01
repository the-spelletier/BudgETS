import React, { Fragment, useState, useEffect, useContext } from "react";
import moment from "moment";
import { Card, Table, Button, notification } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone, PlusOutlined } from '@ant-design/icons';
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
    const [currentEntryId, setCurrentEntryId] = useState(null);
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

    const onCreateOrEditEntry = (entryId) =>{
        setCurrentEntryId(entryId);
        setCreateModalIsVisible(true);
    };

    const onCreateOrEditEntryModalCancel = () => {
        setCurrentEntryId(null);
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

    const parseAmount = (entry) => {
        if (entry.type === "revenue"){
            if (entry.amount < 0){
                return "(" + Number(Math.abs(entry.amount)).toFixed(2) + ")";
            }
            return Number(entry.amount).toFixed(2);
        } else if (entry.type === "expense" && entry.amount < 0){
            return Number(Math.abs(entry.amount)).toFixed(2);
        } 
        return "(" + Number(entry.amount).toFixed(2) + ")";
    }

    const columns = [
        {
            title: "",
            render: (entry) => <EditMenu key={entry.id} 
                onEditClick={() => onCreateOrEditEntry(entry.id)} 
                onDeleteClick={() => onDeleteEntry(entry)} 
                onDeleteMessage="Voulez-vous vraiment supprimer l'entrée?"
                disabled={!budget.edit}/>
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
            render: (entry) => entry.amount ? parseAmount(entry) : "",
            sorter: (a, b) => a.amount - b.amount
        },
        {
            title: "Date",
            render: (entry) => moment(entry.date).format("YYYY-MM-DD"),
            defaultSortOrder: 'descend',
            sorter: (a, b) => moment(a.date).unix() - moment(b.date).unix()
        },
        {
            title: "Statut",
            render: (entry) => entry.entryStatusName ,
            sorter: (a, b) => a.entryStatusName.localeCompare(b.entryStatusName)
        },
        {
            title: <Button icon={<PlusOutlined/>} disabled={!budget.edit} onClick={() => {setCreateModalIsVisible(true)}}/>,
            width: 50
        }
    ];

    return (
        <Fragment>
            <BudgetHeader />
            <h1 className="logo">Entrées</h1>
            <CreateEntry entryId={currentEntryId} visible={createModalIsVisible} onCancelParent={onCreateOrEditEntryModalCancel} />
            <Card>
                <Table loading={entries === null} columns={columns} dataSource={entries} className="no-paging"/>
            </Card>
        </Fragment>
    );
};

export default Entries;