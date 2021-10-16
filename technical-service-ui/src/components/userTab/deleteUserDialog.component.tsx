import { Modal } from "antd";
import Text from "antd/lib/typography/Text";

type DeleteUserDialogProps = {
    onDelete: () => void;
    close: () => void; 
}

const DeleteUserDialog = (props: DeleteUserDialogProps) => {
    const { onDelete, close } = props;

    return (
        <>
            <Modal
                visible
                title='Удаление пользователя'
                cancelText='Отмена'
                onCancel={close}
                onOk={onDelete}
            >
                <Text>Вы действительно хотите удалить ползователя?</Text>
            </Modal>
        </>
    );
}

export default DeleteUserDialog;