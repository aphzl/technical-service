import { Button, Select, Table } from "antd";
import Text from "antd/lib/typography/Text";
import Search from "antd/lib/input/Search";
import { Tab } from "../tab.component";
import { sortBy } from 'lodash';
import { ApiBundle, DeviceDto, UserDto, UserRole } from "../../api/api";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from "react";
import DeleteDeviceDialog from "./deleteDeviceDialog.component";
import SaveDeviceDialog from "./saveDeviceDialog.component";

const ALL = 'all';
const BY_SERIAL = 'by-serial';
const BY_NAME = 'by-name';

export type DeviceTabProps = {
    api: ApiBundle;
    user: UserDto;
}

const DeviceTab = (props: DeviceTabProps) => {
    const { api, user } = props;
    
    const [deviceTabState, setDeviceTabState] = useState<DeviceDto[]>([]);
    const [selectedVal, setSelectedVal] = useState<string>(ALL);
    const [saveDialogVisible, setSaveDialogVisible] = useState<boolean>(false);
    const [selectedDevice, setSelectedDevice] = useState<DeviceDto>();
    const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
    const allowEdit = user.role === UserRole.MANAGER || user.role === UserRole.ADMIN;

    const searchHandle = (val: string) => {
        switch (selectedVal) {
            case ALL:
                api.device
                    .loadAll()
                    .then(r => setDeviceTabState(r));
                break;
            case BY_SERIAL:
                api.device
                    .findBySerial(val || '')
                    .then(r => setDeviceTabState(r));
                break;
            case BY_NAME:
                api.device
                    .findByName(val || '')
                    .then(r => setDeviceTabState(r));
                break;
        }
    };

    const closeSaveDialog = () => {
        setSaveDialogVisible(false);
        setSelectedDevice(undefined);
    }

    const closeDeleteDialog = () => {
        setDeleteDialogVisible(false);
        setSelectedDevice(undefined);
    }

    const save = (device: DeviceDto) => {
        const devices = deviceTabState.filter(d => d.id !== device.id);
        api.device
            .save(device)
            .then(d => setDeviceTabState([...devices, d]));
        
        closeSaveDialog();
    };

    const deleteDevice = (id: string) => {
        api.device
            .delete(id)
            .then(r => setDeviceTabState(deviceTabState.filter(d => d.id !== id)));
    }

    const addHandle = () => {
        setSaveDialogVisible(true);
    };

    const editHandle = (device: DeviceDto) => {
        setSelectedDevice(device);
        setSaveDialogVisible(true);
    };

    const deleteHandle = (device: DeviceDto) => {
        setSelectedDevice(device);
        setDeleteDialogVisible(true);
    };

    const onOkDelete = () => {
        if (selectedDevice) {
            deleteDevice(selectedDevice.id);
        }
        closeDeleteDialog();
    };

    return (
        <>
            <Tab
                header={
                    <DeviceTabHeader
                        allowEdit={allowEdit}
                        setSelectedVal={setSelectedVal}
                        onSearch={searchHandle}
                        addHandle={addHandle}
                    />
                }
                table={
                    <DeviceTabTable
                        data={deviceTabState}
                        allowEdit={allowEdit}
                        onEdit={editHandle}
                        onDelete={deleteHandle}
                    />
                }
            />
            {saveDialogVisible &&
                <SaveDeviceDialog
                    selectedDevice={selectedDevice}
                    onOk={save}
                    close={closeSaveDialog}
                />
            }
            {deleteDialogVisible &&
                <DeleteDeviceDialog
                    onDelete={onOkDelete}
                    close={closeSaveDialog}
                />
            }
        </>
    );
};

type DeviceTabHeaderProps = {
    allowEdit: boolean;
    setSelectedVal: (val: string) => void;
    addHandle: () => void;
    onSearch: (val: string) => void;
}

const DeviceTabHeader = (props: DeviceTabHeaderProps) => {
    const { allowEdit, setSelectedVal, addHandle, onSearch } = props;

    return (
        <div className='headerContainer' >
            <Text style={{ marginRight: 20 }}>
                Искать:
            </Text>
            <Select
                className='headerSelect'
                style={{width: 200}}
                defaultValue={ALL}
                onChange={(v, o) => setSelectedVal(v)}
            >
                <Select.Option key='1' value={ALL}>Все</Select.Option>
                <Select.Option key='2' value={BY_SERIAL}>По Серийному номеру</Select.Option>
                <Select.Option key='3' value={BY_NAME}>По наименованию</Select.Option>
            </Select>
            <Search
                style={{ width: 200 }}
                type='text'
                onSearch={(v, e) => onSearch(v)}
            />
            {allowEdit &&
                <Button
                    style={{ marginLeft: 50 }}
                    type='primary'
                    onClick={addHandle}
                >
                    Добавить
                </Button>
            }
        </div>
    );
};

type DeviceTabTableProps = {
    data: DeviceDto[];
    allowEdit: boolean;
    onEdit: (device: DeviceDto) => void;
    onDelete: (device: DeviceDto) => void;
};

const DeviceTabTable = (props: DeviceTabTableProps) => {
    const { data, allowEdit, onEdit, onDelete } = props;

    const columns = [
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
            width: 100
        },
        {
            title: 'Серийный номер',
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            width: 150
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
            width: 150
        },
        {
            title: '',
            dataIndex: 'buutons',
            key: 'buutons',
            width: 150,
            render: (_, item) => (
                <>
                    {allowEdit &&
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
                dataSource={sortBy(data, r => r.id)}
                size="middle"
                rowKey={(item) => item.id}
            />
        </>
    );
};

export default DeviceTab;