import { Redirect, Route, useParams } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Login from './pages/Login';
import Register from './pages/Register';
import NewList from './pages/NewList';
import SavedLists from './pages/SavedLists';
import ShoppingList from './pages/ShoppingList';
import Welcome from './pages/Welcome';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';


import { AuthProvider } from './context/AuthContext';

setupIonicReact();

const ShoppingListWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return <ShoppingList id={id} />;
};

const App: React.FC = () => (

  <IonApp>
    <AuthProvider>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/new" component={NewList}/>
        <Route exact path="/lists" component={SavedLists} />
        <Route exact path="/lists/:id" component={ShoppingListWrapper} />
        <Route exact path="/welcome" component={Welcome}/>

     
       
      </IonRouterOutlet>
    </IonReactRouter>
    </AuthProvider>
  </IonApp>
);

export default App;
