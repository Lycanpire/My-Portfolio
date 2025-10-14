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

const COLLECTION_NAME = 'coupleExpenses';
const LOCAL_KEY = 'couple_expenses_local_fallback';

// Local fallback helpers
const getLocalList = () => {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return Array.isArray(JSON.parse(raw)) ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
};

const setLocalList = (list) => {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch (_) {}
};

const genLocalId = () => `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

// Add a new expense
export const addExpense = async (expenseData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...expenseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...expenseData };
  } catch (error) {
    // Permission denied or offline → fallback to local storage
    if (error?.code === 'permission-denied' || error?.message?.includes('Missing or insufficient permissions')) {
      const now = new Date();
      const localItem = {
        id: genLocalId(),
        ...expenseData,
        createdAt: now,
        updatedAt: now,
        __local: true,
      };
      const list = getLocalList();
      setLocalList([localItem, ...list]);
      return localItem;
    }
    console.error('Error adding expense:', error);
    throw error;
  }
};

// Update an existing expense
export const updateExpense = async (id, expenseData) => {
  try {
    const expenseRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(expenseRef, {
      ...expenseData,
      updatedAt: serverTimestamp()
    });
    return { id, ...expenseData };
  } catch (error) {
    if (error?.code === 'permission-denied' || error?.message?.includes('Missing or insufficient permissions')) {
      const list = getLocalList();
      const idx = list.findIndex(x => x.id === id);
      if (idx !== -1) {
        const updated = { ...list[idx], ...expenseData, updatedAt: new Date(), __local: true };
        list[idx] = updated;
        setLocalList(list);
        return updated;
      }
    }
    console.error('Error updating expense:', error);
    throw error;
  }
};

// Delete an expense
export const deleteExpense = async (id) => {
  try {
    const expenseRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(expenseRef);
    return id;
  } catch (error) {
    if (error?.code === 'permission-denied' || error?.message?.includes('Missing or insufficient permissions')) {
      const list = getLocalList().filter(x => x.id !== id);
      setLocalList(list);
      return id;
    }
    console.error('Error deleting expense:', error);
    throw error;
  }
};

// Get all expenses
export const getExpenses = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const expenses = [];
    querySnapshot.forEach((doc) => {
      expenses.push({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date()
      });
    });
    return expenses;
  } catch (error) {
    if (error?.code === 'permission-denied' || error?.message?.includes('Missing or insufficient permissions')) {
      return getLocalList();
    }
    console.error('Error getting expenses:', error);
    throw error;
  }
};

// Listen to real-time updates
export const subscribeToExpenses = (callback) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));

  try {
    return onSnapshot(q, (querySnapshot) => {
      const expenses = [];
      querySnapshot.forEach((docItem) => {
        expenses.push({
          id: docItem.id,
          ...docItem.data(),
          createdAt: docItem.data().createdAt?.toDate() || new Date(),
          updatedAt: docItem.data().updatedAt?.toDate() || new Date()
        });
      });
      callback(expenses);
    }, (error) => {
      // Permission denied → switch to local
      if (error?.code === 'permission-denied' || error?.message?.includes('Missing or insufficient permissions')) {
        callback(getLocalList());
      }
    });
  } catch (error) {
    callback(getLocalList());
    return () => {};
  }
};

// Clear all expenses
export const clearAllExpenses = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    if (error?.code === 'permission-denied' || error?.message?.includes('Missing or insufficient permissions')) {
      setLocalList([]);
      return true;
    }
    console.error('Error clearing expenses:', error);
    throw error;
  }
};
