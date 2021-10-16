import { Form, Input, Modal } from "antd";
import { createRef, RefObject } from "react";
import { DeviceDto } from "../../api/api"
import uuid from 'react-uuid'

type SaveDeviceDialogProps = {
    selectedDevice?: DeviceDto;
    onOk: (device: DeviceDto) => void;
    close: () => void;
}

const SaveDeviceDialog = (props: SaveDeviceDialogProps) => {
    const { selectedDevice, onOk, close } = props;

    const nameInputRef = createRef<Input>();
    const serialNumberInputRef = createRef<Input>();
    const descriptionInputRef = createRef<Input>();
    const requiredInputs = [nameInputRef, serialNumberInputRef];

    const getValue = (inputRef: RefObject<Input>): string | undefined => inputRef.current?.input.value;
    const checkInput = (input: Input | null): boolean => !!!input?.props.required || !!input.input.value;
    const validate = () => requiredInputs.every(i => checkInput(i.current));

    const okHandle = () => {
        if (!validate()) {
            requiredInputs.find(i => !checkInput(i.current))?.current?.focus();
            return;
        }

        const device: DeviceDto = {
            id: selectedDevice ? selectedDevice.id : uuid(),
            name: getValue(nameInputRef)!,
            serialNumber: getValue(serialNumberInputRef)!,
            description: getValue(descriptionInputRef)
        };

        onOk(device);
    };

    return (
        <>
            <Modal
                visible
                title='Устройство'
                cancelText='Отмена'
                onCancel={close}
                onOk={okHandle}
            >
                <Form>
                    <Form.Item
                        label='Наименование'
                        required
                        initialValue={selectedDevice?.name}
                        name='name'
                    >
                        <Input
                            autoComplete='off'
                            ref={nameInputRef}
                            type='text'
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        label='Серийный номер'
                        required
                        initialValue={selectedDevice?.serialNumber}
                        name='serialNumber'
                    >
                        <Input
                            ref={serialNumberInputRef}
                            type='text'
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        label='Описание'
                        initialValue={selectedDevice?.description}
                        name='description'
                    >
                        <Input
                            ref={descriptionInputRef}
                            type='text'
                            required
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
};

export default SaveDeviceDialog;