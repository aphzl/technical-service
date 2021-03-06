import { Button, Select, Table } from "antd";
import Text from "antd/lib/typography/Text";
import Search from "antd/lib/input/Search";
import { Tab } from "../tab.component";
import { sortBy } from 'lodash';
import '../tab.scss';
import { ApiBundle, roleMap as roleMap, UserDto, UserRole } from "../../api/api";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from "react";
import SaveUserDialog from "./saveUserDialog.component";
import DeleteUserDialog from "./deleteUserDialog.component";

const ALL = 'all';
const BY_LOGIN = 'by-login';

export type UserTabProps = {
    api: ApiBundle;
}

const UserTab = (props: UserTabProps) => {
    const { api } = props;
    
    const [userTabState, setUserTabState] = useState<UserDto[]>([]);
    const [selectedVal, setSelectedVal] = useState<string>(ALL);
    const [saveDialogVisible, setSaveDialogVisible] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<UserDto>();
    const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);

    const searchHandle = (val: string) => {
        switch (selectedVal) {
            case ALL:
                api.user
                    .loadAll()
                    .then(r => setUserTabState(r));
                break;
            case BY_LOGIN:
                api.user
                    .findByLogin(val || '-')
                    .then(r => setUserTabState(r == null ? [] : [r]));
                break;
        }
    };

    const closeSaveDialog = () => {
        setSaveDialogVisible(false);
        setSelectedUser(undefined);
    }

    const closeDeleteDialog = () => {
        setDeleteDialogVisible(false);
        setSelectedUser(undefined);
    }

    const save = (user: UserDto) => {
        const users = userTabState.filter(u => u.login !== user.login);
        api.user
            .save(user)
            .then(u => setUserTabState([...users, u]));
        
        closeSaveDialog();
    };

    const deleteUser = (login: string) => {
        api.user
            .delete(login)
            .then(r => setUserTabState(userTabState.filter(u => u.login !== login)));
    }

    const addHandle = () => {
        setSaveDialogVisible(true);
    };

    const editHandle = (user: UserDto) => {
        setSelectedUser(user);
        setSaveDialogVisible(true);
    };

    const deleteHandle = (user: UserDto) => {
        setSelectedUser(user);
        setDeleteDialogVisible(true);
    };

    const onOkDelete = () => {
        if (selectedUser) {
            deleteUser(selectedUser?.login);
        }
        closeDeleteDialog();
    };

    return (
        <>
            <Tab
                header={
                    <UserTabHeader
                        setSelectedVal={setSelectedVal}
                        onSearch={searchHandle}
                        addHandle={addHandle}
                    />
                }
                table={
                    <UserTabTable
                        data={userTabState}
                        onEdit={editHandle}
                        onDelete={deleteHandle}
                    />
                }
            />
            {saveDialogVisible &&
                <SaveUserDialog
                    selectedUser={selectedUser}
                    onOk={save}
                    close={closeSaveDialog}
                />
            }
            {deleteDialogVisible &&
                <DeleteUserDialog
                    onDelete={onOkDelete}
                    close={closeDeleteDialog}
                />
            }
        </>
    );
};

type UserTabHeaderProps = {
    setSelectedVal: (val: string) => void;
    addHandle: () => void;
    onSearch: (val: string) => void;
}

const UserTabHeader = (props: UserTabHeaderProps) => {
    const { setSelectedVal, addHandle, onSearch } = props;

    return (
        <div className='headerContainer' >
            <Text style={{ marginRight: 20 }}>
                ????????????:
            </Text>
            <Select
                className='headerSelect'
                defaultValue={ALL}
                onChange={(v, o) => setSelectedVal(v)}
            >
                <Select.Option key='1' value={ALL}>??????</Select.Option>
                <Select.Option key='2' value={BY_LOGIN}>???? ????????????</Select.Option>
            </Select>
            <Search
                style={{ width: 200 }}
                type='text'
                onSearch={(v, e) => onSearch(v)}
            />
            <Button
                style={{ marginLeft: 50 }}
                type='primary'
                onClick={addHandle}
            >
                ????????????????
            </Button>
        </div>
    );
};

type UserTabTableProps = {
    data: UserDto[];
    onEdit: (user: UserDto) => void;
    onDelete: (user: UserDto) => void;
}

const UserTabTable = (props: UserTabTableProps) => {
    const { data, onEdit, onDelete } = props;

    const columns = [
        {
            title: '??????????',
            dataIndex: 'login',
            key: 'login',
            width: 100
        },
        {
            title: '??????????????',
            dataIndex: 'lastName',
            key: 'lastName',
            width: 150
        },
        {
            title: '??????',
            dataIndex: 'firstName',
            key: 'firstName',
            width: 150
        },
        {
            title: '????????????????',
            dataIndex: 'middleName',
            key: 'middleName',
            width: 150
        },
        {
            title: '????????',
            dataIndex: 'role',
            key: 'role',
            width: 100,
            render: (val: UserRole, item) => (<>{roleMap[val]}</>)
        },
        {
            title: '',
            dataIndex: 'buutons',
            key: 'buutons',
            width: 150,
            render: (_, item) => (
                <>
                    <Button
                        style={{ marginInline: 10}}
                        shape="circle"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(item)}
                    />
                    <Button
                        shape="circle"
                        icon={<DeleteOutlined />}
                        onClick={() => onDelete(item)}
                    />
                </>
            )
        }
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={sortBy(data, r => r.login)}
                size="middle"
                rowKey={(item) => item.login}
            />
        </>
    );
};

export default UserTab;