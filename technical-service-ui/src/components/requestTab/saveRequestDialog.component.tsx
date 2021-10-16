import { RequestDto, RequestStatus, statusMap } from "../../api/api";
import { Form, Input, Modal, Select } from "antd";
import { createRef, RefObject, useState } from "react";
import uuid from 'react-uuid'

type SaveRequestDialogProps = {
    selectedRequest?: RequestDto;
    onOk: (request: RequestDto) => void;
    close: () => void;
}

const SaveRequestDialog = (props: SaveRequestDialogProps) => {
    const { selectedRequest, onOk, close } = props;

    const [status, setStatus] = useState<RequestStatus>(RequestStatus.TO_DO);
    const contactInfoInputRef = createRef<Input>();
    const deviceSerialNumberInputRef = createRef<Input>();
    const assignedToInputRef = createRef<Input>();
    const problemDescriptionInputRef = createRef<Input>();
    const resolveDescriptionInputRef = createRef<Input>();
    const requiredInputs = [contactInfoInputRef];

    const getValue = (inputRef: RefObject<Input>): string | undefined => inputRef.current?.input.value;
    const checkInput = (input: Input | null): boolean => !!!input?.props.required || !!input.input.value;
    const validate = () => requiredInputs.every(i => checkInput(i.current));

    const okHandle = () => {
        if (!validate()) {
            requiredInputs.find(i => !checkInput(i.current))?.current?.focus();
            return;
        }

        const request: RequestDto = {
            id: selectedRequest ? selectedRequest.id : uuid(),
            status: status,
            contactInfo: getValue(contactInfoInputRef)!,
            deviceSerialNumber: getValue(deviceSerialNumberInputRef),
            assignedTo: getValue(assignedToInputRef),
            problemDescription: getValue(problemDescriptionInputRef),
            resolveDescription: getValue(resolveDescriptionInputRef)
        };

        onOk(request);
    };

    return (
        <>
            <Modal
                visible
                title='Заявка'
                cancelText='Отмена'
                onCancel={close}
                onOk={okHandle}
            >
                <Form>
                    <Form.Item
                        label='Статус'
                        initialValue={selectedRequest ? selectedRequest.status : RequestStatus.TO_DO}
                        name='status'
                    >
                        <Select
                            onChange={(v, o) => setStatus(v as RequestStatus)}
                        >
                            <Select.Option key='1' value={RequestStatus.TO_DO}>
                                {statusMap[RequestStatus.TO_DO]}
                            </Select.Option>
                            <Select.Option key='2' value={RequestStatus.AT_WORK}>
                                {statusMap[RequestStatus.AT_WORK]}
                            </Select.Option>
                            <Select.Option key='3' value={RequestStatus.WAIT_TO_DELIVERY}>
                                {statusMap[RequestStatus.WAIT_TO_DELIVERY]}
                            </Select.Option>
                            <Select.Option key='4' value={RequestStatus.CLOSED}>
                                {statusMap[RequestStatus.CLOSED]}
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label='Контакт клиента'
                        initialValue={selectedRequest?.contactInfo}
                        name='contactInfo'
                        required
                    >
                        <Input
                            ref={contactInfoInputRef}
                            type='text'
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        label='S/N устройства'
                        initialValue={selectedRequest?.deviceSerialNumber}
                        name='deviceSerialNumber'
                    >
                        <Input
                            ref={deviceSerialNumberInputRef}
                            type='text'
                        />
                    </Form.Item>
                    <Form.Item
                        label='Исполнитель'
                        initialValue={selectedRequest?.assignedTo}
                        name='assignedTo'
                    >
                        <Input
                            ref={assignedToInputRef}
                            type='text'
                        />
                    </Form.Item>
                    <Form.Item
                        label='Описание проблемы'
                        initialValue={selectedRequest?.problemDescription}
                        name='problemDescription'
                    >
                        <Input
                            ref={problemDescriptionInputRef}
                            type='text'
                        />
                    </Form.Item>
                    <Form.Item
                        label='Описание решения'
                        initialValue={selectedRequest?.resolveDescription}
                        name='resolveDescription'
                    >
                        <Input
                            ref={resolveDescriptionInputRef}
                            type='text'
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
};

export default SaveRequestDialog;