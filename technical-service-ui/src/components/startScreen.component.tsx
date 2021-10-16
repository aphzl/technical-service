import { Button, Form, Input } from "antd";
import Text from "antd/lib/typography/Text";
import { createRef, RefObject, useState } from "react";
import { ApiBundle, AuthorizationRequest, LoginStatus, UserDto } from "../api/api";
import './startScreen.scss'

export type StartScreenProps = {
    api: ApiBundle;
    setUser: (user: UserDto) => void;
}

const StartScreen = (props: StartScreenProps) => {
    const { api, setUser } = props;

    const [loginStatus, setLoginStatus] = useState<LoginStatus>();

    const loginInputRef = createRef<Input>();
    const passwordInputRef = createRef<Input>();
    const inputRefs = [loginInputRef, passwordInputRef];

    const getValue = (inputRef: RefObject<Input>): string | undefined => inputRef.current?.input.value;
    const checkInput = (input: Input | null): boolean => !!!input?.props.required || !!input.input.value;
    const validate = () => inputRefs.every(i => checkInput(i.current));

    const onLogin = ()  => {
        if (!validate()) {
            inputRefs.find(i => !checkInput(i.current))?.current?.focus();
            return;
        }
        
        const loginRequest: AuthorizationRequest = {
            login: getValue(loginInputRef)!,
            password: getValue(passwordInputRef)!
        }

        api.login
            .login(loginRequest)
            .then(r => {
                setLoginStatus(r.status);
                if (r.status === LoginStatus.OK) {
                    document.cookie = `jwt=${r.jwt}`
                    setUser(r.user);
                }
            });
    };

    return (
        <div>
            <Form className='container' >
                <div className='header'>
                    <div>Здравсвуйте!</div>
                    <div>Чтобы продолжить войдите в систему</div>
                </div>                
                <div className='inputContainer'>
                    <Form.Item
                        className='input'
                        name='login'
                    >
                        <Input
                            type='text'
                            placeholder='Логин'
                            ref={loginInputRef}
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        className='input'
                    >
                        <Input.Password
                            type='text'
                            placeholder='Пароль'
                            ref={passwordInputRef}
                            required
                        />
                    </Form.Item>
                </div>
                
                <Form.Item>
                    <Button
                        onClick={onLogin}
                        type='primary'
                    >
                        Войти
                    </Button>
                </Form.Item>
                {loginStatus === LoginStatus.USER_OR_PASSWORD_NOT_FOUND
                    && <Text className='message'>Неверный логин или пароль</Text>}
            </Form>
        </div>
    );
};

export default StartScreen;