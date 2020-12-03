import React, { Fragment, useState, useEffect, useContext } from "react";
import moment from "moment";
import { Card, Table, notification, Button } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import BudgetHeader from "../budget/header/BudgetHeader"; 
import CreateOrEditUser from "./create/CreateOrEditUser";
import EditMenu from "../components/edit-menu/EditMenu";
import { UserClient } from "../clients/UserClient";
import UserContext from "../contexts/user/UserContext";
import BudgetContext from "../contexts/budget/BudgetContext";

const Admin = () => {
    const userClient = new UserClient();
    
    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);

    const [users, setUsers] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [createModalIsVisible, setCreateModalIsVisible] = useState(false);

    useEffect(() => {
        const getUsers = async() => {
            var response = await userClient.getAll(user.token);
            setUsers(response.data.length > 0 ? response.data : [{}]);
        }

        getUsers();
    }, [createModalIsVisible]);

    const onEditUser = (currentUser) => {
        setCurrentUserId(currentUser.id);
        setCreateModalIsVisible(true);
    };

    const onCreateUser = () => {
        setCurrentUserId(null);
        setCreateModalIsVisible(true);
    };

    const onCreateOrEditUserModalCancel = () => {
        setCurrentUserId(null);
        setCreateModalIsVisible(false);
    };

    const onDeleteUser = (currentUser) => {
        const deleteUser = async () => {
            try {
                await userClient.delete(user.token, currentUser.id);
                notification.open({
                message: "Succès",
                icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                description:
                  "L'utilisateur a été supprimé avec succès",
                });
                
                // Removes from our list
                setUsers(users.filter(s => s.id !== currentUser.id));
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                    "Une erreur est survenue en supprimant l'utilisateur",
                    });
            }
        };

        deleteUser();
    };

    const columns = [
        {
            title: "",
            width: 50,
            render: (lineUser) => <EditMenu key={lineUser.id} 
                onEditClick={() => onEditUser(lineUser)} 
                onDeleteClick={() => onDeleteUser(lineUser)} 
                onDeleteMessage="Voulez-vous vraiment supprimer cet utilisateur?"/>
        },
        {
            title: "Nom d'utilisateur",
            render: (lineUser) => lineUser.username,
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.username.localeCompare(b.username)
        },
        {
            title: "Nom complet",
            render: (lineUser) => lineUser.fullname, 
            sorter: (a, b) => a.fullname && b.fullname && a.fullname.localeCompare(b.fullname)
        },
        {
            title: "E-mail",
            render: (lineUser) => lineUser.email, 
            sorter: (a, b) => a.email && b.email && a.email.localeCompare(b.email)
        },
        {
            title: "Bloqué",
            width: 100,
            render: (lineUser) => lineUser.isBlocked ? "Oui" : "Non"
        },
        {
            title: "Admin",
            width: 100,
            render: (lineUser) => lineUser.isAdmin ? "Oui" : "Non"
        },
        {
            title: <Button icon={<PlusOutlined/>} onClick={() => {onCreateUser()}}/>,
            width: 50,
            render:() => ""
        }
    ]

    return (
        <Fragment>
        <h1 className="logo">Admin</h1>
            {
                users &&
                <Fragment>
                    <CreateOrEditUser userId={currentUserId} visible={createModalIsVisible} onCancelParent={onCreateOrEditUserModalCancel} />
                    <Table columns={columns} dataSource={users} className="no-paging"/>
                </Fragment>
            }
        </Fragment>
    );
};

export default Admin;