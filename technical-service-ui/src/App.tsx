import { useState } from 'react';
import { ApiBundle, UserDto } from './api/api';
import './App.css';
import Pane from './components/pane.component';
import StartScreen from './components/startScreen.component';

function App(props) {
    const originUrl = window.location.origin;
    // 3000 and 3001 use for deev
    const serverUrl = (originUrl.endsWith('3000') || originUrl.endsWith('3001')) ? 'http://localhost:8080' : originUrl;
    const api = new ApiBundle(serverUrl);
    
    const [user, setUserState] = useState<UserDto>();

    return (
        <div>
            {user
                ? <Pane
                    api={api}
                    user={user}
                />
                : <StartScreen
                    api={api}
                    setUser={setUserState}
                />
            }
        </div>
    );
}

export default App;
