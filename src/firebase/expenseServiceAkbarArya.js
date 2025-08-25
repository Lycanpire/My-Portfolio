import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

const COLLECTION_NAME = 'akbarAryaExpenses';

export const addExpense = async (expenseData) => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...expenseData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: docRef.id, ...expenseData };
};

export const updateExpense = async (id, expenseData) => {
  const expenseRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(expenseRef, {
    ...expenseData,
    updatedAt: serverTimestamp(),
  });
  return { id, ...expenseData };
};

export const deleteExpense = async (id) => {
  const expenseRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(expenseRef);
  return id;
};

export const getExpenses = async () => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  const expenses = [];
  querySnapshot.forEach((doc) => {
    expenses.push({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      updatedAt: doc.data().updatedAt?.toDate() || new Date(),
    });
  });
  return expenses;
};

export const subscribeToExpenses = (callback) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const expenses = [];
    querySnapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      });
    });
    callback(expenses);
  });
};

export const clearAllExpenses = async () => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  const deletePromises = querySnapshot.docs.map((docItem) => deleteDoc(docItem.ref));
  await Promise.all(deletePromises);
  return true;
};


