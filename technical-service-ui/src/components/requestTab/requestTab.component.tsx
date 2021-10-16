import { Button, Select, Table } from "antd";
import Text from "antd/lib/typography/Text";
import Search from "antd/lib/input/Search";
import { useState } from "react";
import { ApiBundle, RequestDto, RequestStatus, statusMap, UserDto, UserRole } from "../../api/api";
import { Tab } from "../tab.component";
import DeleteRequestDialog from "./deleteRequestDialog.component";
import SaveRequestDialog from "./saveRequestDialog.component";
import { sortBy } from 'lodash';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

const ALL = 'all';
const BY_EXECUTOR = 'by-executor';
const ALL_TO_DO = 'all-to-do';
const ALL_AT_WORK = 'all-at-work';
const ALL_CLOSED = 'all-closed';
const ALL_WAIT_TO_DELIVERY = 'all-wait-to-delivery';

export type RequestTabProps = {
    api: ApiBundle;
    user: UserDto;
}

const RequestTab = (props: RequestTabProps) => {
    const { api, user } = props;

    const [requestTabState, setRequestTabState] = useState<RequestDto[]>([]);
    const [selectedVal, setSelectedVal] = useState<string>(ALL);
    const [saveDialogVisible, setSaveDialogVisible] = useState<boolean>(false);
    const [selectedRequest, setSelectedRequest] = useState<RequestDto>();
    const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
    const allowDeleteAndCreate = user.role === UserRole.MANAGER || user.role === UserRole.ADMIN;

    const closeSaveDialog = () => {
        setSaveDialogVisible(false);
        setSelectedRequest(undefined);
    }

    const closeDeleteDialog = () => {
        setDeleteDialogVisible(false);
        setSelectedRequest(undefined);
    }

    const save = (request: RequestDto) => {
        const devices = requestTabState.filter(d => d.id !== request.id);
        api.request
            .save(request)
            .then(d => setRequestTabState([...devices, d]));
        
        closeSaveDialog();
    };

    const deleteDevice = (id: string) => {
        api.request
            .delete(id)
            .then(r => setRequestTabState(requestTabState.filter(d => d.id !== id)));
    }

    const addHandle = () => {
        setSaveDialogVisible(true);
    };

    const editHandle = (request: RequestDto) => {
        setSelectedRequest(request);
        setSaveDialogVisible(true);
    };

    const deleteHandle = (request: RequestDto) => {
        setSelectedRequest(request);
        setDeleteDialogVisible(true);
    };

    const onOkDelete = () => {
        if (selectedRequest) {
            deleteDevice(selectedRequest.id);
        }
        closeDeleteDialog();
    };

    const searchHandle = (val: string) => {
        switch (selectedVal) {
            case ALL:
                api.request
                    .loadAll()
                    .then(r => setRequestTabState(r));
                break;
            case BY_EXECUTOR:
                api.request
                    .findByExecutor(val || '')
                    .then(r => setRequestTabState(r));
                break;
            case ALL_TO_DO:
                api.request
                    .findByStatus(RequestStatus.TO_DO)
                    .then(r => setRequestTabState(r));
                break;
            case ALL_AT_WORK:
                api.request
                    .findByStatus(RequestStatus.AT_WORK)
                    .then(r => setRequestTabState(r));
                break;
            case ALL_CLOSED:
                api.request
                    .findByStatus(RequestStatus.CLOSED)
                    .then(r => setRequestTabState(r));
                break;
            case ALL_WAIT_TO_DELIVERY:
                api.request
                    .findByStatus(RequestStatus.WAIT_TO_DELIVERY)
                    .then(r => setRequestTabState(r));
                break;
        }
    };

    return (
        <>
            <Tab
                header={
                    <RequestTabHeader
                        allowDeleteAndCreate={allowDeleteAndCreate}
                        setSelectedVal={setSelectedVal}
                        onSearch={searchHandle}
                        addHandle={addHandle}
                    />
                }
                table={
                    <RequestTabTable
                        data={requestTabState}
                        allowDeleteAndCreate={allowDeleteAndCreate}
                        onEdit={editHandle}
                        onDelete={deleteHandle}
                    />
                }
            />
            {saveDialogVisible &&
                <SaveRequestDialog
                    selectedRequest={selectedRequest}
                    onOk={save}
                    close={closeSaveDialog}
                />
            }
            {deleteDialogVisible &&
                <DeleteRequestDialog
                    onDelete={onOkDelete}
                    close={closeSaveDialog}
                />
            }
        </>
    );
};

type RequestTabHeaderProps = {
    allowDeleteAndCreate: boolean;
    setSelectedVal: (val: string) => void;
    addHandle: () => void;
    onSearch: (val: string) => void;
}

const RequestTabHeader = (props: RequestTabHeaderProps) => {
    const { allowDeleteAndCreate, setSelectedVal, addHandle, onSearch } = props;

    return (
        <>
            <div className='headerContainer' >
            <Text style={{ marginRight: 20 }}>
                Искать:
            </Text>
            <Select
                className='headerSelect'
                style={{width: 260}}
                defaultValue={ALL}
                onChange={(v, o) => setSelectedVal(v)}
            >
                <Select.Option key='1' value={ALL}>Все</Select.Option>
                <Select.Option key='2' value={BY_EXECUTOR}>По исполнителю</Select.Option>
                <Select.Option key='3' value={ALL_TO_DO}>Все ожидающие выполнения</Select.Option>
                <Select.Option key='4' value={ALL_AT_WORK}>Все в работе</Select.Option>
                <Select.Option key='5' value={ALL_WAIT_TO_DELIVERY}>Все ожидающие выдачи клиенту</Select.Option>
                <Select.Option key='6' value={ALL_CLOSED}>Все закрытые</Select.Option>
            </Select>
            <Search
                style={{ width: 200 }}
                type='text'
                onSearch={(v, e) => onSearch(v)}
            />
            {allowDeleteAndCreate &&
                <Button
                    style={{ marginLeft: 50 }}
                    type='primary'
                    onClick={addHandle}
                >
                    Добавить
                </Button>
            }
        </div>
        </>
    );
}

type RequestTabTableProps = {
    data: RequestDto[];
    allowDeleteAndCreate: boolean;
    onEdit: (request: RequestDto) => void;
    onDelete: (request: RequestDto) => void;
}

const RequestTabTable = (props: RequestTabTableProps) => {
    const { data, allowDeleteAndCreate, onEdit, onDelete } = props;

    const columns = [
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: 200,
            render: (val: RequestStatus, item) => (<>{statusMap[val]}</>)
        },
        {
            title: 'Контакт клиента',
            dataIndex: 'contactInfo',
            key: 'contactInfo',
            width: 150
        },
        {
            title: 'Описание проблемы',
            dataIndex: 'problemDescription',
            key: 'problemDescription',
            width: 200
        },
        {
            title: 'Описание решения',
            dataIndex: 'resolveDescription',
            key: 'resolveDescription',
            width: 200
        },
        {
            title: 'Исполнитель',
            dataIndex: 'assignedTo',
            key: 'assignedTo',
            width: 150
        },
        {
            title: 'S/N устройства',
            dataIndex: 'deviceSerialNumber',
            key: 'deviceSerialNumber',
            width: 150
        },
        {
            title: 'Дата создания',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (val, item) => (<>{val ? new Date(val).toLocaleString() : ''}</>)
        },
        {
            title: 'Дата изменения',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            width: 150,
            render: (val, item) => (<>{val ? new Date(val).toLocaleString() : ''}</>)
        },
        {
            title: 'Создал',
            dataIndex: 'createdBy',
            key: 'createdBy',
            width: 150
        },
        {
            title: 'Изменил',
            dataIndex: 'updatedBy',
            key: 'updatedBy',
            width: 150
        },
        {
            title: '',
            dataIndex: 'buutons',
            key: 'buutons',
            width: 200,
            render: (_, item) => (
                <>
                    {allowDeleteAndCreate &&
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
                    }
                </>
            )
        }
    ];

    return (
        <>
            <Table
                columns={columns}
                dataSource={sortBy(data, r => r.createdAt)}
                size="middle"
                rowKey={(item) => item.id}
            />
        </>
    );
}

export default RequestTab;