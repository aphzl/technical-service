import { Menu } from "antd";
import { useState } from "react";
import { ApiBundle, UserDto, UserRole } from "../api/api";
import { SelectInfo } from 'rc-menu/lib/interface';
import DeviceTab from "./deviceTab/deviceTab.component";
import RequestTab from "./requestTab/requestTab.component";
import UserTab from "./userTab/userTab.component";

const REQUESTS_TAB = 'requests-tab';
const DEVICES_TAB = 'devices-tab';
const USERS_TAB = 'users-tab';

export type PaneProps = {
    api: ApiBundle;
    user: UserDto;
}

const Pane = (paneProps: PaneProps) => {
    const { api, user } = paneProps;

    const [selectedTabKey, setSelectedTabKey] = useState<string>(REQUESTS_TAB);

    const onSelect = (param: SelectInfo) => setSelectedTabKey(param.key);

    return (
        <div className='pane' >
            <div style={{ float: 'left', width: '200px' }}>
                <Menu
                    style={{ width: '100%' }}
                    selectedKeys={[selectedTabKey]}
                    onSelect={onSelect}
                >
                    <Menu.Item key={REQUESTS_TAB}>Заявки</Menu.Item>
                    <Menu.Item key={DEVICES_TAB}>Устройства</Menu.Item>
                    {user.role === UserRole.ADMIN && <Menu.Item key={USERS_TAB}>Пользователи</Menu.Item>}
                </Menu>
            </div>
            <div style={{ float: 'left',  width: 'calc(100% - 200px)' }}>
                <TabsPane
                    selectedTabKey={selectedTabKey}
                    api={api}
                    // basketState={basketState}
                    // onAddToBasket={addToBaskeHandle}
                    // setBasketState={setBasketState}
                    // deleteFromBasket={deleteFromBasket}
                    // clearBasketState={() => setBasketState({})}
                    // updateStoreTab={updateStoreTab}
                    // setUpdateStoreTab={m => setUpdateStoreTab(() => m)}
                />
                {/* {visibleAddToBasketDialog &&
                    <AddToBasketDialog
                        resource={addingResource!}
                        close={closeBasketDialog}
                        onOk={onOkAddToBasket}
                    />
                } */}
            </div>
            <br/>
        </div>
    );
};

type TabsPaneProps = {
    selectedTabKey: string;
    api: ApiBundle;
    // basketState: BasketState;
    // setBasketState: (state: BasketState) => void;
    // onAddToBasket: (resource: ResourceInfo) => void;
    // deleteFromBasket: (resourceId: string) => void;
    // clearBasketState: () => void;
    // updateStoreTab: () => void;
    // setUpdateStoreTab: (func: () => void) => void;
};

const TabsPane = (props: TabsPaneProps) => {
    const { selectedTabKey, api } = props;

    

    

    const show = (key: string) => selectedTabKey === key ? 'block' : 'none';

    return (
        <>
            <div style={{ display: show(REQUESTS_TAB) }}>
                <RequestTab
                    // api={api}
                    // onAddToBasket={onAddToBasket}
                    // setUpdateStoreTab={setUpdateStoreTab}
                />
            </div>
            <div style={{ display: show(DEVICES_TAB) }}>
                <DeviceTab />
            </div>
            <div style={{ display: show(USERS_TAB) }}>
                <UserTab
                    // basketState={basketState}
                    api={api}
                    // onBasketEdit={onAddToBasket}
                    // onDelete={deleteFromBasket}
                    // clearBasketState={clearBasketState}
                    // updateAll={updateAll}
                />
            </div>
        </>
    );
};

export default Pane;