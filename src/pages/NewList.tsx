import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFabButton,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonLoading,
  useIonRouter,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import "./NewList.css";
import { useToast } from "../hooks/useToast";
import {
  addCircleOutline,
  addCircleSharp,
  checkmarkCircleOutline,
  checkmarkOutline,
  closeOutline,
  logOut,
  saveOutline,
  trashOutline,
} from "ionicons/icons";
import { Redirect } from "react-router";

import { useAuth } from "../context/AuthContext";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useHistory } from "react-router";

import { db } from "../../firebase";
import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "@firebase/firestore";
import Menu from "../components/Menu";
import { h } from "ionicons/dist/types/stencil-public-runtime";

interface documentType {
  [key: string]: any;
}

const NewList: React.FC = () => {
  const [newItem, setNewItem] = useState("");
  const [listName, setListName] = useState("");
  const [items, setItems] = useState<documentType[]>([]);
  const [isOpen, setIsOpen] = useState(false);


  const itemsCollectionRef = collection(db, "items");
  const shoppingListsCollectionRef = collection(db, "shoppingLists");

  const getItems = async () => {
    const itemData = await getDocs(itemsCollectionRef);
   
    setItems(itemData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };


  useEffect(() => {
  
    if (!currentUser) {
      router.push("/")
    }
    getItems();

  }, []);

  const { currentUser } = useAuth();
  const router = useIonRouter();

  const toast = useToast();

  const [present, dismiss] = useIonLoading();

  useEffect(() => {}, [items]);

  const addItem = async (e: any) => {
  

    if (newItem === "") {
      toast("Add valid item name", "top");
    } else {
      await addDoc(itemsCollectionRef, {
        name: newItem,
        isDone: false,
        user: currentUser?.uid,
      });
    }

    setNewItem("");
    getItems();
  };

  const deleteAllDocuments = async () => {
    try {
      const collectionRef = collection(db, 'items')
      const itemsSnap = await getDocs(collectionRef);
  
      itemsSnap.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
  
      console.log('All documents deleted from the collection.');
    } catch (error) {
      console.error('Error deleting documents:', error);
    }
  };

  const deleteItem = async (id: string) => {
    const itemDoc = doc(db, "items", id);
    await deleteDoc(itemDoc);

    getItems();
  };

  const markAsDone = async (id: string, isDone: boolean) => {
    const itemDoc = doc(db, "items", id);
    const newField = { isDone: !isDone };
    await updateDoc(itemDoc, newField);

    getItems();
  };

  const openSave = (e: any) => {
    e.preventDefault();
    setIsOpen(true);
  };

  const saveList = async (e: any) => {
    e.preventDefault();


    if (listName === "") {
      toast("You need to give a name to your list", "top")
    } else {
      await addDoc(shoppingListsCollectionRef, {
        name: listName,
        list: items,
        user: currentUser?.uid
      });
      present(`Saving shopping list "${listName}"`)
      setTimeout(() => {
        dismiss();
        toast(`"${listName}" saved!`, "bottom")
          router.push("/lists")
      },1000)
      

      setIsOpen(false);
      setListName("")
      setItems([])
      deleteAllDocuments()
    }
  };
  
  const cancelSave = (e: any) => {
    e.preventDefault()
    setIsOpen(false)
  } 


  return (
    <>
    <Menu />
    <IonPage>
      <IonHeader>
        <IonToolbar className="tool-bar-chart">
          <div className="toolbar-buttons">
            <IonBackButton defaultHref="/lists"></IonBackButton>
            
          </div>
          <IonButtons slot="end"><IonMenuButton></IonMenuButton></IonButtons>
 
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" scrollY={false}>
        <IonGrid fixed>
          <IonRow class="ion-justify-content-center">
            <IonCol
              size="12"
              sizeMd="8"
              sizeLg="6"
              sizeXl="4"
              className="item-list"
            >
              <IonContent scrollY>
                <IonList className="item-lista">
                  {items.map((item) => {
                    return (
                      <div className="list-items" key={item.id}>
                        {" "}
                        <IonItem
                          className={
                            item.isDone === false
                              ? "item-list-text"
                              : "item-list-text done-item"
                          }
                          onClick={() => markAsDone(item.id, item.isDone)}
                          lines="none"
                          key={item.id}
                        >
                          {item.name}
                        </IonItem>
                        <IonButton
                          fill="clear"
                          onClick={() => deleteItem(item.id)}
                        >
                          <IonIcon icon={trashOutline} />
                        </IonButton>
                      </div>
                    );
                  })}
                </IonList>
              </IonContent>
            </IonCol>
          </IonRow>
          <IonRow class="ion-align-items-flex-end">
            <IonCol
              size="12"
              sizeMd="8"
              sizeLg="6"
              sizeXl="4"
              className="add-item-field ion-padding"
            >
             
            </IonCol>
          </IonRow>
        </IonGrid>

        {!isOpen ? (
          <IonButton className="save-button" onClick={openSave} expand="block">
            Save shopping list
          </IonButton>
        ) : (
          <div className="save-list">
            <IonInput
              type="text"              
              label="Give your list a name"
              labelPlacement="floating"
              clearOnEdit={true}
              value={listName}
              onKeyUp={(e: any) => setListName(e.target.value)}
            ></IonInput>
            <div className="save-buttons">
              <IonButton onClick={saveList}><IonIcon icon={checkmarkOutline}/></IonButton>
              <IonButton onClick={cancelSave}><IonIcon icon={closeOutline}/></IonButton>
            </div>
       
          </div>
        )}
         <div className="item-add">
                <IonInput
                  className="item-input-field"
                  type="text"
                  
                  label="Type item name"
                  labelPlacement="floating"
                  clearOnEdit={true}
                  value={newItem}
                  onKeyUp={(e: any) => setNewItem(e.target.value)}
                />
                <IonFabButton className="user-button" onClick={addItem}>
                  <IonIcon icon={addCircleOutline} />
                </IonFabButton>
              </div>
      </IonContent>
    </IonPage>
    </>
  );
};

export default NewList;
