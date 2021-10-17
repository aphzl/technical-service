import { Form, Input, Modal, Select } from "antd";
import { createRef, RefObject, useState } from "react";
import { roleMap, UserDto, UserRole } from "../../api/api";

type SaveUserDialogProps = {
    selectedUser?: UserDto;
    onOk: (user: UserDto) => void;
    close: () => void;
}

const SaveUserDialog = (props: SaveUserDialogProps) => {
    const { selectedUser, onOk, close } = props;

    const loginInputRef = createRef<Input>();
    const passwordInputRef = createRef<Input>();
    const lastNameInputRef = createRef<Input>();
    const firstNameInputRef = createRef<Input>();
    const middleNameInputRef = createRef<Input>();
    const [role, setRole] = useState<UserRole>(UserRole.WORKER);
    const requiredPassword = !!!selectedUser;
    const requiredInputs = requiredPassword ? [loginInputRef, passwordInputRef] : [loginInputRef];

    const getValue = (inputRef: RefObject<Input>): string | undefined => inputRef.current?.input.value;
    const checkInput = (input: Input | null): boolean => !!!input?.props.required || !!input.input.value;
    const validate = () => requiredInputs.every(i => checkInput(i.current));

    const okHandle = () => {
        if (!validate()) {
            requiredInputs.find(i => !checkInput(i.current))?.current?.focus();
            return;
        }

        const user: UserDto = {
            login: getValue(loginInputRef)!,
            password: getValue(passwordInputRef)!.length === 0 ? undefined : getValue(passwordInputRef)!,
            firstName: getValue(firstNameInputRef),
            middleName: getValue(middleNameInputRef),
            lastName: getValue(lastNameInputRef),
            role
        };

        onOk(user);
    };

    return (
        <>
            <Modal
                visible
                title='Пользователь'
                cancelText='Отмена'
                onCancel={close}
                onOk={okHandle}
            >
                <Form>
                    <Form.Item
                        label='Логин'
                        required
                        initialValue={selectedUser?.login}
                        name='login'
                    >
                        <Input
                            disabled={!!selectedUser}
                            autoComplete='off'
                            ref={loginInputRef}
                            type='text'
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        label='Пароль'
                        required
                        name='password'
                    >
                        <Input.Password
                            ref={passwordInputRef}
                            type='text'
                            required
                            autoComplete='new-password'
                        />
                    </Form.Item>
                    <Form.Item
                        label='Фамилия'
                        initialValue={selectedUser?.lastName}
                        name='lastName'
                    >
                        <Input
                            ref={lastNameInputRef}
                            type='text'
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        label='Имя'
                        initialValue={selectedUser?.firstName}
                        name='firstName'
                    >
                        <Input
                            ref={firstNameInputRef}
                            type='text'
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        label='Отчество'
                        initialValue={selectedUser?.middleName}
                        name='middleName'
                    >
                        <Input
                            ref={middleNameInputRef}
                            type='text'
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        label='Роль'
                        initialValue={UserRole.WORKER}
                        name='role'
                    >
                        <Select
                            onChange={(v, o) => setRole(v as UserRole)}
                        >
                            <Select.Option key='1' value={UserRole.WORKER}>
                                {roleMap[UserRole.WORKER]}
                            </Select.Option>
                            <Select.Option key='2' value={UserRole.MANAGER}>
                                {roleMap[UserRole.MANAGER]}
                            </Select.Option>
                            <Select.Option key='3' value={UserRole.ADMIN}>
                                {roleMap[UserRole.ADMIN]}
                            </Select.Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default SaveUserDialog;