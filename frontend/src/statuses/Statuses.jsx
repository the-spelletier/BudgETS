import React, { Fragment, useState, useEffect, useContext } from "react";
import moment from "moment";
import { Card, Table, notification, Button } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import BudgetHeader from "../budget/header/BudgetHeader"; 
import CreateStatus from "./create/CreateStatus";
import EditMenu from "../components/edit-menu/EditMenu";
import { EntryStatusClient } from "../clients/EntryStatusClient";
import UserContext from "../contexts/user/UserContext";
import BudgetContext from "../contexts/budget/BudgetContext";

const Statuses = () => {
    const statusClient = new EntryStatusClient();
    
    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);

    const [statuses, setStatuses] = useState(null);
    const [currentStatusId, setCurrentStatusId] = useState(null);
    const [createModalIsVisible, setCreateModalIsVisible] = useState(false);

    useEffect(() => {
        const getStatuses = async() => {
            var response = await statusClient.getAll(user.token, budget.id);
            setStatuses(response.data.length > 0 ? response.data.filter(s => !s.deleted) : [{}]);
        }

        getStatuses();
    }, [createModalIsVisible, budget]);

    const onEditStatus = (status) => {
        setCurrentStatusId(status.id);
        setCreateModalIsVisible(true);
    };

    const onCreateStatus = () => {
        setCurrentStatusId(null);
        setCreateModalIsVisible(true);
    };

    const onCreateOrEditStatusModalCancel = () => {
        setCurrentStatusId(null);
        setCreateModalIsVisible(false);
    };

    const onDeleteStatus = (status) => {
        const deleteStatus = async () => {
            try {
                await statusClient.delete(user.token, status.id);
                notification.open({
                message: "Succès",
                icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                description:
                  "Le statut a été supprimé avec succès",
                });
                
                // Removes from our list
                setStatuses(statuses.filter(s => s.id !== status.id));
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                    "Une erreur est survenue en supprimant le statut",
                    });
            }
        };

        deleteStatus();
    };

    const columns = [
        {
            title: "",
            width: 50,
            render: (status) => <EditMenu key={status.id} 
                onEditClick={() => onEditStatus(status)} 
                onDeleteClick={() => onDeleteStatus(status)} 
                onDeleteMessage="Voulez-vous vraiment supprimer ce statut?"/>
        },
        {
            title: "Ordre",
            width: 100,
            render: (status) => status.position,
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.position - b.position
        },
        {
            title: "Nom",
            render: (status) => status.name,
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title:  "Notifier?" ,
            width: 100,
            render: (status) => status.notify ? "Oui" : "Non",
            sorter: (a, b) => a.notify - b.notify
        },
        {
            title: <Button icon={<PlusOutlined/>} onClick={() => {onCreateStatus()}}/>,
            width: 50,
            render:() => ""
        }
    ]

    return (
        <Fragment>
            <BudgetHeader/>    
            <h1 className="logo">Statuts</h1>
            {
                statuses &&
                <Fragment>
                    <CreateStatus statusId={currentStatusId} visible={createModalIsVisible} onCancelParent={onCreateOrEditStatusModalCancel} />
                    <Table columns={columns} dataSource={statuses} className="no-paging"/>
                </Fragment>
            }
        </Fragment>
    );
};

export default Statuses;