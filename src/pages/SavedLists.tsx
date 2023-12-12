import { IonContent, IonHeader, IonItem, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { useHistory} from 'react-router-dom'
import { useAuth } from '../context/AuthContext';
import "./NewList.css";

import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "@firebase/firestore";

interface documentType {
  [key: string]: any;
}

const SavedLists: React.FC = () => {
  const history = useHistory()

  const [shoppingLists, setShoppingLists] = useState<documentType[]>([])

  const shoppingListsCollectionRef = collection(db, "shoppingLists")

  const { currentUser } = useAuth()

  const getLists = async () => {
      const data = await getDocs(shoppingListsCollectionRef);
      setShoppingLists(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  }

  useEffect(() => {
    getLists()
  },[])

  const showList = (id: string) => {
    history.push(`/lists/${id}`);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Your shopping lists</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
       <IonList>
        {shoppingLists.map((list) => (
          <IonItem onClick={() => showList(list.id)} button={true} key={list.id}>
            {list.name}
          </IonItem>
        ))}        
       </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SavedLists;