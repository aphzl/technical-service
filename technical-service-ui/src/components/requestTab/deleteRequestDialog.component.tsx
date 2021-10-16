import { Modal } from "antd";
import Text from "antd/lib/typography/Text";

type DeleteRequestDialogProps = {
    onDelete: () => void;
    close: () => void; 
}

const DeleteRequestDialog = (props: DeleteRequestDialogProps) => {
    const { onDelete, close } = props;

    return (
        <>
            <Modal
                visible
                title='Удаление заявки'
                cancelText='Отмена'
                onCancel={close}
                onOk={onDelete}
            >
                <Text>Вы действительно хотите удалить заявку?</Text>
            </Modal>
        </>
    );
}

export default DeleteRequestDialog;