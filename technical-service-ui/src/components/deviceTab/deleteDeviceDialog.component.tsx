import { Modal } from "antd";
import Text from "antd/lib/typography/Text";

type DeleteDeviceDialogProps = {
    onDelete: () => void;
    close: () => void; 
}

const DeleteDeviceDialog = (props: DeleteDeviceDialogProps) => {
    const { onDelete, close } = props;

    return (
        <>
            <Modal
                visible
                title='Удаление устройства'
                cancelText='Отмена'
                onCancel={close}
                onOk={onDelete}
            >
                <Text>Вы действительно хотите удалить устройство?</Text>
            </Modal>
        </>
    );
}

export default DeleteDeviceDialog;