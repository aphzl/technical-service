import { RequestDto } from "../../api/api";

type SaveRequestDialogProps = {
    selectedRequest?: RequestDto;
    onOk: (request: RequestDto) => void;
    close: () => void;
}

const SaveRequestDialog = (props: SaveRequestDialogProps) => {
    return (
        <>
        </>
    )
};

export default SaveRequestDialog;