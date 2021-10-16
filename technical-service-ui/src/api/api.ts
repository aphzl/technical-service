export enum LoginStatus {
    OK = 'OK',
    USER_OR_PASSWORD_NOT_FOUND = 'USER_OR_PASSWORD_NOT_FOUND'
}

export enum UserRole {
    WORKER = 'WORKER',
    MANAGER = 'MANAGER',
    ADMIN = 'ADMIN'
}

export enum RequestStatus {
    TO_DO = 'TO_DO',
    AT_WORK = 'AT_WORK',
    WAIT_TO_DELIVERY = 'WAIT_TO_DELIVERY',
    CLOSED = 'CLOSED'
}

export const roleMap = {
    [UserRole.ADMIN]: 'Администратор',
    [UserRole.WORKER]: 'Рабочий',
    [UserRole.MANAGER]: 'Менеджер'
}

export const statusMap = {
    [RequestStatus.TO_DO]: 'Ожидает исполнения',
    [RequestStatus.AT_WORK]: 'В работе',
    [RequestStatus.WAIT_TO_DELIVERY]: 'Ожидает выдачи клиенту',
    [RequestStatus.CLOSED]: 'Закрыта'
}

export type UserDto = {
    login: string;
    password?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
    role: UserRole;
}

export type AuthorisationResponse = {
    status: LoginStatus;
    user: UserDto;
    jwt: string;
}

export type AuthorizationRequest = {
    login: string;
    password: string;
}

export type DeviceDto = {
    id: string;
    name: string;
    serialNumber: string;
    description: string;
    requests: RequestDto[];
}

export type RequestDto = {
    id: string;
    status: string;
    contactInfo?: string;
    problemDescription?: string;
    resolveDescription?: string;
    createdAt?: number;
    updatedAt?: number;
    createdBy?: string;
    updatedBy?: string;
    device: DeviceDto;
}

export class ApiBundle {
    public login: LoginApi = new LoginApi(this.url);
    public user: UserApi = new UserApi(this.url);

    constructor(private url: string) {}
};

class LoginApi {
    private urn = '/api';

    public login = (request: AuthorizationRequest): Promise<AuthorisationResponse> => {
        const fetchOptions: RequestInit = {
            method: "POST",
            body: JSON.stringify(request),
            headers: {"Content-Type": "application/json"}
        };

        return fetch(`${this.url}${this.urn}/login`, fetchOptions)
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
    };

    constructor(private url: string) {};
}

class UserApi {
    private urn = '/api/user';

    public loadAll = () =>
            fetch(`${this.url}${this.urn}/all`, { credentials: 'include' })
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });

    public findByLogin = (login: string) =>
            fetch(`${this.url}${this.urn}/${login}`, { credentials: 'include' })
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });

    public save = (user: UserDto): Promise<UserDto> => {
        const fetchOptions: RequestInit = {
            method: "POST",
            body: JSON.stringify(user),
            headers: {"Content-Type": "application/json", 'Access-Control-Allow-Origin': '*'},
            credentials: 'include'
        };

        return fetch(`${this.url}${this.urn}`, fetchOptions)
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response.json();
                    } else {
                        throw response;
                    }
                });
    };

    public delete = (login: string) => {
        const fetchOptions: RequestInit = {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
            credentials: 'include'
        };

        return fetch(`${this.url}${this.urn}/${login}`, fetchOptions)
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        return response;
                    } else {
                        throw response;
                    }
                });
    };

    constructor(private url: string) {};
}