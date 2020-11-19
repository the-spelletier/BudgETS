import React, { Fragment, useState, useEffect, useContext } from "react";
import moment from "moment";
import { Card, Table, notification, Button } from "antd";
import { CloseCircleTwoTone, CheckCircleTwoTone, PlusOutlined } from '@ant-design/icons';
import BudgetHeader from "../budget/header/BudgetHeader"; 
import CreateMember from "./create/CreateMember";
import EditMenu from "../components/edit-menu/EditMenu";
import { MemberClient } from "../clients/MemberClient";
import UserContext from "../contexts/user/UserContext";
import BudgetContext from "../contexts/budget/BudgetContext";

const Members = () => {
    const memberClient = new MemberClient();
    
    const {user} = useContext(UserContext);
    const {budget} = useContext(BudgetContext);

    const [members, setMembers] = useState(null);
    const [currentMember, setCurrentMember] = useState(null);
    const [createModalIsVisible, setCreateModalIsVisible] = useState(false);

    useEffect(() => {
        const getMembers = async() => {
            var response = await memberClient.getAll(user.token, user.id);
            setMembers(response.data.length > 0 ? response.data : [{}]);
        }

        getMembers();
    }, [createModalIsVisible]);

    const onEditMember = (member) => {
        setCurrentMember(member.id);
        setCreateModalIsVisible(true);
    };

    const onCreateMember = () => {
        setCurrentMember(null);
        setCreateModalIsVisible(true);
    };

    const onCreateOrEditMemberModalCancel = () => {
        setCurrentMember(null);
        setCreateModalIsVisible(false);
    };

    const onDeleteMember = (member) => {
        const deleteMember = async () => {
            try {
                await memberClient.delete(user.token, member.id);
                notification.open({
                message: "Succès",
                icon: <CheckCircleTwoTone twoToneColor="#52c41a" />,
                description:
                  "Le membre a été supprimé avec succès",
                });
                
                // Removes from our list
                setMembers(members.filter(m => m.id !== member.id));
            }
            catch (error){
                notification.open({
                    message: "Erreur",
                    icon: <CloseCircleTwoTone twoToneColor='#ff7773'/>,
                    description:
                    "Une erreur est survenue en supprimant le membre",
                    });
            }
        };

        deleteMember();
    };

    const columns = [
        {
            title: "",
            width: 50,
            render: (member) => <EditMenu key={member.id} 
                disabled={!budget.edit}
                onEditClick={() => onEditMember(member)} 
                onDeleteClick={() => onDeleteMember(member)} 
                onDeleteMessage="Voulez-vous vraiment supprimer ce membre?"/>
        },
        {
            title: "Nom",
            render: (member) => member.name,
            defaultSortOrder: 'ascend',
            sorter: (a, b) => a.name.localeCompare(b.name)
        },
        {
            title: "Code",
            render: (member) => member.code,
            sorter: (a, b) => a.code.localeCompare(b.code)
        },
        {
            title: "E-mail",
            render: (member) => member.email,
            sorter: (a, b) => a.email.localeCompare(b.email)
        },
        {
            title: "Notifer?",
            render: (member) => member.notify ? "Oui" : "Non"
        }
    ]

    const renderMembers = (members, title, active) => {
        members = members.filter(mem => mem.active === active);
        return (members.length > 0 || active) && 
                <Card title={ <h2>{title}</h2> } 
                    extra={active && <Button icon={<PlusOutlined/>} 
                        disabled={!budget.edit} 
                        onClick={() => {onCreateMember()}}/> } >
                    <Table columns={columns} dataSource={members} className="no-paging"/>
                </Card>
    }

    return (
        <Fragment>
            <BudgetHeader />
        <h1 className="logo">Membres</h1>
            {
                members &&
                <Fragment>
                    <CreateMember memberId={currentMember} visible={createModalIsVisible} onCancelParent={onCreateOrEditMemberModalCancel} />
                    {
                        renderMembers(members, "Actif", true)
                    }
                    {
                        renderMembers(members, "Inactif", false)
                    }
                </Fragment>
            }
        </Fragment>
    );
};

export default Members;