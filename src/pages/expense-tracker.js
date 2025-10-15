import React, { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { Trash2, Edit2, Heart, Plus, Coffee, Gift, Wifi, WifiOff } from 'lucide-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { 
  addExpense as addExpenseToFirebase, 
  updateExpense as updateExpenseInFirebase, 
  deleteExpense as deleteExpenseFromFirebase, 
  subscribeToExpenses, 
  clearAllExpenses as clearAllExpensesFromFirebase 
} from '../firebase/expenseService';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf2f8 0%, #fef2f2 50%, #fff1f2 100%);
  padding: 1rem;
`;

const MainContent = styled.div`
  max-width: 64rem;
  margin: 0 auto;
`;

const Card = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid #fce7f3;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  background: linear-gradient(135deg, #db2777 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
`;

const FormContainer = styled.div`
  background: linear-gradient(135deg, #fdf2f8 0%, #fff1f2 100%);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid #fce7f3;
`;

const FormTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const Input = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #fce7f3;
  border-radius: 0.375rem;
  outline: none;
  
  &:focus {
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #fce7f3;
  border-radius: 0.375rem;
  outline: none;
  background: white;
  
  &:focus {
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &.primary {
    background: linear-gradient(135deg, #ec4899 0%, #dc2626 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #db2777 0%, #b91c1c 100%);
    }
  }
  
  &.success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #059669 0%, #047857 100%);
    }
  }
  
  &.secondary {
    background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
    color: white;
    
    &:hover {
      background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SummaryCard = styled.div`
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid;
  
  &.green {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    border-color: #6ee7b7;
  }
  
  &.purple {
    background: linear-gradient(135deg, #f3e8ff 0%, #fce7f3 100%);
    border-color: #c4b5fd;
  }
`;

const SummaryTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &.green {
    color: #065f46;
  }
  
  &.purple {
    color: #581c87;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`;

const SummaryValue = styled.span`
  font-weight: 600;
`;

const SettleButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  &:hover {
    background: linear-gradient(135deg, #e11d48 0%, #db2777 100%);
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 0;
  color: #6b7280;
`;

const EmptyIcon = styled.div`
  font-size: 3.75rem;
  margin-bottom: 1rem;
`;

const ExpenseItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: linear-gradient(135deg, white 0%, #fdf2f8 100%);
  border: 1px solid #fce7f3;
  border-radius: 0.5rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s;
  
  &:hover {
    background: linear-gradient(135deg, #fdf2f8 0%, #fff1f2 100%);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
`;

const ExpenseInfo = styled.div`
  flex: 1;
`;

const ExpenseTitle = styled.h4`
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const ExpenseDate = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const ExpenseMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
`;

const Badge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid;
  
  &.blue {
    background: #dbeafe;
    color: #1e40af;
    border-color: #93c5fd;
  }
  
  &.purple {
    background: #f3e8ff;
    color: #7c3aed;
    border-color: #c4b5fd;
  }
  
  &.green {
    background: #d1fae5;
    color: #065f46;
    border-color: #6ee7b7;
  }
  
  &.orange {
    background: #fed7aa;
    color: #c2410c;
    border-color: #fdba74;
  }
`;

const ExpenseAmount = styled.span`
  font-size: 1.125rem;
  font-weight: bold;
  color: #ec4899;
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem;
  border: 1px solid;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
  
  &.edit {
    color: #2563eb;
    border-color: #93c5fd;
    
    &:hover {
      background: #dbeafe;
      border-color: #3b82f6;
    }
  }
  
  &.delete {
    color: #dc2626;
    border-color: #fca5a5;
    
    &:hover {
      background: #fee2e2;
      border-color: #ef4444;
    }
  }
`;

const ExpenseSplitter = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidBy: 'Akbar',
    splitType: 'equal',
    category: ''
  });
  const [salaries, setSalaries] = useState({ akbar: '', sana: '' });
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const d = new Date();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${d.getFullYear()}-${m}`;
  });

  // Ensure Firebase anonymous auth (required by secured Firestore rules)
  useEffect(() => {
    let unsub = () => {};
    try {
      if (!auth.currentUser) {
        signInAnonymously(auth).catch(() => {});
      }
      unsub = onAuthStateChanged(auth, () => {});
    } catch (_) {}
    return () => {
      try { unsub(); } catch (_) {}
    };
  }, []);



  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Subscribe to real-time updates from Firebase
  useEffect(() => {
    const unsubscribe = subscribeToExpenses((expenses) => {
      setExpenses(expenses);
      setIsLoading(false);
      
      // Show save notification for new/updated expenses
      if (expenses.length > 0) {
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 2000);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load salaries from localStorage
  useEffect(() => {
    try {
      const savedAkbar = localStorage.getItem('salary_akbar') || '';
      const savedSana = localStorage.getItem('salary_sana') || '';
      setSalaries({ akbar: savedAkbar, sana: savedSana });
    } catch (_) {}
  }, []);

  const updateSalary = (person, value) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    const next = { ...salaries, [person]: sanitized };
    setSalaries(next);
    try {
      localStorage.setItem(person === 'akbar' ? 'salary_akbar' : 'salary_sana', sanitized);
    } catch (_) {}
  };

  // Simple keyword-based auto-categorization
  const autoDetectCategory = (desc) => {
    const text = desc.toLowerCase();
    const match = (words) => words.some(w => text.includes(w));
    if (match(['rent', 'lease', 'landlord'])) return 'Rent';
    if (match(['uber', 'ola', 'metro', 'bus', 'train', 'flight', 'air', 'taxi'])) return 'Travel';
    if (match(['grocery', 'groceries', 'vegetable', 'fruit', 'bigbasket', 'blinkit'])) return 'Groceries';
    if (match(['electric', 'electricity', 'wifi', 'broadband', 'internet', 'water', 'utility', 'gas'])) return 'Utilities';
    if (match(['movie', 'netflix', 'spotify', 'prime', 'hotstar', 'song', 'concert'])) return 'Entertainment';
    if (match(['doctor', 'medicine', 'pharmacy', 'hospital', 'clinic', 'health'])) return 'Health';
    if (match(['zomato', 'swiggy', 'restaurant', 'cafe', 'coffee', 'food', 'pizza', 'burger'])) return 'Food';
    if (match(['amazon', 'myntra', 'ajio', 'nykaa', 'shopping', 'clothes', 'shoe', 'dress'])) return 'Shopping';
    return '';
  };

  const addExpense = async () => {
    if (!formData.description || !formData.amount) return;
    
    try {
      const detected = formData.category || autoDetectCategory(formData.description);
      // Map display values to backend-compatible values (legacy rules may expect 'Sana')
      const backendPaidBy = formData.paidBy === 'Noor' ? 'Sana' : formData.paidBy;
      const newExpense = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        paidBy: backendPaidBy,
        splitType: formData.splitType,
        date: new Date().toLocaleDateString()
      };
      if (detected) newExpense.category = detected;
      
      console.log('Submitting expense:', newExpense);
      const result = await addExpenseToFirebase(newExpense);
      console.log('Expense submitted successfully:', result);
      
      setFormData({ description: '', amount: '', paidBy: 'Akbar', splitType: 'equal', category: '' });
      
      // Show success message
      if (result.__local) {
        alert('Expense saved locally (Firebase unavailable). Will sync when connection is restored.');
      } else {
        alert('Expense added successfully!');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      console.error('Error details:', {
        code: error?.code,
        message: error?.message,
        stack: error?.stack
      });
      alert(`Failed to add expense: ${error?.message || 'Unknown error'}`);
    }
  };

  const updateExpense = async () => {
    if (!formData.description || !formData.amount) return;
    
    try {
      const detected = formData.category || autoDetectCategory(formData.description);
      const backendPaidBy = formData.paidBy === 'Noor' ? 'Sana' : formData.paidBy;
      const updatedExpense = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        paidBy: backendPaidBy,
        splitType: formData.splitType,
        date: new Date().toLocaleDateString()
      };
      if (detected) updatedExpense.category = detected;
      
      await updateExpenseInFirebase(editingId, updatedExpense);
      setEditingId(null);
      setFormData({ description: '', amount: '', paidBy: 'Akbar', splitType: 'equal', category: '' });
    } catch (error) {
      console.error('Error updating expense:', error);
      alert(`Failed to update expense: ${error?.message || 'Unknown error'}`);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await deleteExpenseFromFirebase(id);
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert(`Failed to delete expense: ${error?.message || 'Unknown error'}`);
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      paidBy: expense.paidBy === 'Sana' ? 'Noor' : expense.paidBy,
      splitType: expense.splitType || 'equal',
      category: expense.category || ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ description: '', amount: '', paidBy: 'Akbar', splitType: 'equal' });
  };

  const calculateBalance = () => {
    const computeOwes = (list) => {
      let akbarOwes = 0;
      let sanaOwes = 0;
      
      list.forEach(expense => {
        const amount = expense.amount;
        const splitType = expense.splitType || 'equal';
        
        switch (splitType) {
          case 'equal':
            // Split equally - each owes half
            akbarOwes += expense.paidBy === 'Sana' || expense.paidBy === 'Noor' ? amount / 2 : 0;
            sanaOwes += expense.paidBy === 'Akbar' ? amount / 2 : 0;
            break;
          case 'paidBy':
            // Who paid covers all - no one owes anything
            break;
          case 'allAkbar':
            // Akbar owes the full amount (regardless of who paid)
            akbarOwes += amount;
            break;
          case 'allNoor':
            // Noor owes the full amount (regardless of who paid)
            sanaOwes += amount;
            break;
          default:
            // Default to equal split
            akbarOwes += expense.paidBy === 'Sana' || expense.paidBy === 'Noor' ? amount / 2 : 0;
            sanaOwes += expense.paidBy === 'Akbar' ? amount / 2 : 0;
        }
      });
      
      return { akbar: akbarOwes, sana: sanaOwes };
    };

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const akbarPaid = expenses.filter(e => e.paidBy === 'Akbar').reduce((sum, e) => sum + e.amount, 0);
    // Support legacy records where paidBy was 'Sana' while UI now shows 'Noor'
    const sanaPaid = expenses.filter(e => e.paidBy === 'Noor' || e.paidBy === 'Sana').reduce((sum, e) => sum + e.amount, 0);

    const { akbar: akbarOwes, sana: sanaOwes } = computeOwes(expenses);
    // Net balance: positive means Akbar is owed money, negative means Akbar owes money
    const netBalance = sanaOwes - akbarOwes;

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthlyExpenses = expenses.filter(e => {
      const d = e.createdAt instanceof Date ? e.createdAt : null;
      return d && d.getMonth() === month && d.getFullYear() === year;
    });
    const { akbar: akbarOwesMonth, sana: sanaOwesMonth } = computeOwes(monthlyExpenses);

    const akbarSalary = parseFloat(salaries.akbar || '0') || 0;
    const sanaSalary = parseFloat(salaries.sana || '0') || 0;

    return {
      total: totalExpenses,
      akbarPaid,
      sanaPaid,
      akbarOwes,
      sanaOwes,
      netBalance: netBalance,
      akbarBalanceLeft: Math.max(0, akbarSalary - akbarOwesMonth),
      sanaBalanceLeft: Math.max(0, sanaSalary - sanaOwesMonth),
      akbarSalary,
      sanaSalary
    };
  };

  const settleUp = async () => {
    if (window.confirm('Are you sure you want to settle up and clear all expenses? This action cannot be undone.')) {
      try {
        await clearAllExpensesFromFirebase();
      } catch (error) {
        console.error('Error clearing expenses:', error);
        alert('Failed to clear expenses. Please try again.');
      }
    }
  };

  // Export expenses to JSON file
  const exportExpenses = () => {
    const dataStr = JSON.stringify(expenses, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `couple-expenses-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Import expenses from JSON file
  const importExpenses = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedExpenses = JSON.parse(e.target.result);
          if (Array.isArray(importedExpenses)) {
            if (window.confirm(`Import ${importedExpenses.length} expenses? This will replace your current expenses.`)) {
              try {
                // Clear existing expenses first
                await clearAllExpensesFromFirebase();
                
                // Add imported expenses
                for (const expense of importedExpenses) {
                  const { id, createdAt, updatedAt, ...expenseData } = expense;
                  await addExpenseToFirebase(expenseData);
                }
              } catch (error) {
                console.error('Error importing expenses:', error);
                alert('Failed to import expenses. Please try again.');
              }
            }
          } else {
            alert('Invalid file format. Please select a valid expenses JSON file.');
          }
        } catch (error) {
          alert('Error reading file. Please make sure it\'s a valid JSON file.');
        }
      };
      reader.readAsText(file);
    }
    // Reset the file input
    event.target.value = '';
  };

  // Clear all data
  const clearAllData = async () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        await clearAllExpensesFromFirebase();
      } catch (error) {
        console.error('Error clearing expenses:', error);
        alert('Failed to clear expenses. Please try again.');
      }
    }
  };

  const balance = calculateBalance();
  const formatRs = (num) => `₹ ${Number(num || 0).toFixed(2)}`;

  // Helpers for analytics
  const getMonthFromDate = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const monthFilter = (exp, ym) => {
    const d = exp.createdAt instanceof Date ? exp.createdAt : null;
    if (!d) return false;
    return getMonthFromDate(d) === ym;
  };
  const summarizeList = (list) => {
    const total = list.reduce((s, e) => s + e.amount, 0);
    const akbarPaid = list.filter(e => e.paidBy === 'Akbar').reduce((s, e) => s + e.amount, 0);
    const sanaPaid = list.filter(e => e.paidBy === 'Noor' || e.paidBy === 'Sana').reduce((s, e) => s + e.amount, 0);
    return { total, akbarPaid, sanaPaid };
  };
  const selectedMonthSummary = summarizeList(expenses.filter(e => monthFilter(e, selectedMonth)));

  const buildYearSeries = (year) => {
    const series = [];
    for (let m = 1; m <= 12; m++) {
      const ym = `${year}-${String(m).padStart(2, '0')}`;
      const { total } = summarizeList(expenses.filter(e => monthFilter(e, ym)));
      series.push({ ym, total });
    }
    return series;
  };
  const selectedYear = parseInt(selectedMonth.split('-')[0], 10);
  const baseYear = selectedYear || new Date().getFullYear();
  const thisYear = buildYearSeries(baseYear);
  const lastYear = buildYearSeries(baseYear - 1);
  const selectedMonStr = selectedMonth.split('-')[1];
  const selectedMon = parseInt(selectedMonStr, 10);
  const yearOptions = Array.from({ length: 2099 - 2020 + 1 }, (_, i) => 2020 + i);
  const monthOptions = [
    { v: 1, l: 'Jan' }, { v: 2, l: 'Feb' }, { v: 3, l: 'Mar' }, { v: 4, l: 'Apr' },
    { v: 5, l: 'May' }, { v: 6, l: 'Jun' }, { v: 7, l: 'Jul' }, { v: 8, l: 'Aug' },
    { v: 9, l: 'Sep' }, { v: 10, l: 'Oct' }, { v: 11, l: 'Nov' }, { v: 12, l: 'Dec' },
  ];

  return (
    <Container>
      {/* Save Notification */}
      {showSaveNotification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#10b981',
          color: 'white',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span>💾</span>
          Data saved to cloud! ☁️
        </div>
      )}

      {/* Online Status Indicator */}
      <div style={{
        position: 'fixed',
        top: '20px',
        left: '20px',
        background: isOnline ? '#10b981' : '#ef4444',
        color: 'white',
        padding: '0.5rem 0.75rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem'
      }}>
        {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
        {isOnline ? 'Online - Syncing' : 'Offline - Local Only'}
      </div>

      <MainContent>
        <Card>
          <Header>
            <Heart size={32} color="#ec4899" />
            <div>
              <Title>Our Love Budget ☁️</Title>
              <Subtitle>
                <span>💕</span>
                Akbar & Noor
                <span>💕</span>
                {expenses.length > 0 && (
                  <span style={{ fontSize: '0.875rem', color: '#ec4899', marginTop: '0.25rem', display: 'block' }}>
                    📊 {expenses.length} beautiful memories saved to cloud
                  </span>
                )}
              </Subtitle>
            </div>
            <Heart size={32} color="#ec4899" />
          </Header>

          <FormContainer>
            <FormTitle>
              {editingId ? (
                <>
                  <Edit2 size={20} color="#ec4899" />
                  Edit Our Memory
                </>
              ) : (
                <>
                  <Gift size={20} color="#ec4899" />
                  Add New Memory
                </>
              )}
            </FormTitle>
            <FormGrid>
              <Input
                type="number"
                placeholder="Akbar salary (optional)"
                value={salaries.akbar}
                onChange={(e) => updateSalary('akbar', e.target.value)}
              />
              <Input
                type="number"
                placeholder="Noor salary (optional)"
                value={salaries.sana}
                onChange={(e) => updateSalary('sana', e.target.value)}
              />
              <Input
                type="text"
                placeholder="What did we enjoy together? ✨"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <Input
                type="number"
                placeholder="Amount 💝"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
              />
              <Input
                type="text"
                placeholder="Category (optional)"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
              <Select
                value={formData.paidBy}
                onChange={(e) => setFormData({...formData, paidBy: e.target.value})}
              >
                <option value="Akbar">💙 Akbar paid</option>
                <option value="Noor">💖 Noor paid</option>
              </Select>
              <Select
                value={formData.splitType}
                onChange={(e) => setFormData({...formData, splitType: e.target.value})}
              >
                <option value="equal">💕 Share equally (our love is 50/50)</option>
                <option value="paidBy">💝 {formData.paidBy}'s treat</option>
                <option value="allAkbar">🧾 100% owed by Akbar</option>
                <option value="allNoor">🧾 100% owed by Noor</option>
              </Select>
              <ButtonGroup>
                {editingId ? (
                  <>
                    <Button className="success" onClick={updateExpense}>
                      💕 Update
                    </Button>
                    <Button className="secondary" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button className="primary" onClick={addExpense}>
                    <Plus size={18} />
                    Add Our Memory ✨
                  </Button>
                )}
              </ButtonGroup>
            </FormGrid>
          </FormContainer>

          <SummaryGrid>
            <SummaryCard className="green">
              <SummaryTitle className="green">
                <Heart size={20} color="#dc2626" />
                Our Love Fund Summary
              </SummaryTitle>
              <SummaryItem>
                <span>💕 Total Adventures:</span>
                <SummaryValue>{formatRs(balance.total)}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <span>💙 Akbar salary:</span>
                <SummaryValue>{formatRs(balance.akbarSalary)}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <span>💖 Noor salary:</span>
                <SummaryValue>{formatRs(balance.sanaSalary)}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <span>💙 Akbar's Share:</span>
                <SummaryValue>{formatRs(balance.akbarOwes)}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <span>💖 Noor's Share:</span>
                <SummaryValue>{formatRs(balance.sanaOwes)}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <span>💙 Akbar balance left:</span>
                <SummaryValue>{formatRs(balance.akbarBalanceLeft)}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <span>💖 Noor balance left:</span>
                <SummaryValue>{formatRs(balance.sanaBalanceLeft)}</SummaryValue>
              </SummaryItem>
            </SummaryCard>

            <SummaryCard className="purple">
              <SummaryTitle className="purple">💕 Love Balance</SummaryTitle>
              <SummaryItem>
                <span>💙 Akbar contributed:</span>
                <SummaryValue>{formatRs(balance.akbarPaid)}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <span>💖 Noor contributed:</span>
                <SummaryValue>{formatRs(balance.sanaPaid)}</SummaryValue>
              </SummaryItem>
              <div style={{ borderTop: '1px solid #c4b5fd', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                {balance.netBalance > 0 ? (
                  <div style={{ color: '#581c87', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>💝</span>
                    Noor owes Akbar: {formatRs(balance.netBalance)}
                  </div>
                ) : balance.netBalance < 0 ? (
                  <div style={{ color: '#581c87', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>💝</span>
                    Akbar owes Noor: {formatRs(Math.abs(balance.netBalance))}
                  </div>
                ) : (
                  <div style={{ color: '#581c87', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>🥰</span>
                    Perfect balance, just like your love! 💕
                  </div>
                )}
              </div>
            </SummaryCard>
          </SummaryGrid>

          <SummaryCard className="blue">
            <SummaryTitle className="blue">💕 Detailed Breakdown</SummaryTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ color: '#dc2626', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  💙 Akbar's Share
                </div>
                <SummaryItem>
                  <span>Owes:</span>
                  <SummaryValue>{formatRs(balance.akbarOwes)}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <span>Paid:</span>
                  <SummaryValue>{formatRs(balance.akbarPaid)}</SummaryValue>
                </SummaryItem>
                <SummaryItem style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem', marginTop: '0.5rem', fontWeight: 600 }}>
                  <span>Net:</span>
                  <SummaryValue style={{ color: balance.akbarPaid >= balance.akbarOwes ? '#10b981' : '#ef4444' }}>
                    {formatRs(balance.akbarPaid - balance.akbarOwes)}
                  </SummaryValue>
                </SummaryItem>
              </div>
              <div>
                <div style={{ color: '#db2777', fontWeight: 600, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  💖 Noor's Share
                </div>
                <SummaryItem>
                  <span>Owes:</span>
                  <SummaryValue>{formatRs(balance.sanaOwes)}</SummaryValue>
                </SummaryItem>
                <SummaryItem>
                  <span>Paid:</span>
                  <SummaryValue>{formatRs(balance.sanaPaid)}</SummaryValue>
                </SummaryItem>
                <SummaryItem style={{ borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem', marginTop: '0.5rem', fontWeight: 600 }}>
                  <span>Net:</span>
                  <SummaryValue style={{ color: balance.sanaPaid >= balance.sanaOwes ? '#10b981' : '#ef4444' }}>
                    {formatRs(balance.sanaPaid - balance.sanaOwes)}
                  </SummaryValue>
                </SummaryItem>
              </div>
            </div>
          </SummaryCard>

          {/* Analytics: Month-by-Month and YoY */}
          <Card>
            <SectionTitle>
              <Heart size={20} color="#ec4899" /> Insights — Monthly & YoY
            </SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div>
                <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Selected month</div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Select value={selectedYear} onChange={(e) => setSelectedMonth(`${e.target.value}-${String(selectedMon).padStart(2, '0')}`)}>
                    {yearOptions.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </Select>
                  <Select value={selectedMon} onChange={(e) => setSelectedMonth(`${selectedYear}-${String(e.target.value).padStart(2, '0')}`)}>
                    {monthOptions.map(m => (
                      <option key={m.v} value={m.v}>{m.l}</option>
                    ))}
                  </Select>
                  <Badge className="purple">Total: {formatRs(selectedMonthSummary.total)}</Badge>
                  <Badge className="blue">Akbar paid: {formatRs(selectedMonthSummary.akbarPaid)}</Badge>
                  <Badge className="green">Noor paid: {formatRs(selectedMonthSummary.sanaPaid)}</Badge>
                </div>
              </div>
              <div>
                <div style={{ marginBottom: '0.5rem', fontWeight: 600 }}>Yearly overview</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{baseYear}</div>
                    {thisYear.map(({ ym, total }) => (
                      <div key={ym} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '4px 0', borderBottom: '1px dashed #fce7f3' }}>
                        <span>{ym}</span>
                        <span>{formatRs(total)}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{baseYear - 1}</div>
                    {lastYear.map(({ ym, total }) => (
                      <div key={ym} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', padding: '4px 0', borderBottom: '1px dashed #fce7f3' }}>
                        <span>{ym}</span>
                        <span>{formatRs(total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Data Management Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {expenses.length > 0 && (
              <SettleButton onClick={settleUp} style={{ width: 'auto', margin: 0 }}>
                <Heart size={20} />
                💕 Settle Up & Start Fresh 💕
                <Heart size={20} />
              </SettleButton>
            )}
            
            {expenses.length > 0 && (
              <Button 
                className="success" 
                onClick={exportExpenses}
                style={{ padding: '0.75rem 1rem' }}
              >
                📁 Export Our Memories
              </Button>
            )}
            
            <div style={{ position: 'relative' }}>
              <input
                type="file"
                accept=".json"
                onChange={importExpenses}
                style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                id="import-file"
              />
              <Button 
                className="secondary" 
                as="label"
                htmlFor="import-file"
                style={{ padding: '0.75rem 1rem', cursor: 'pointer' }}
              >
                📂 Import Memories
              </Button>
            </div>

            {expenses.length > 0 && (
              <Button 
                className="delete" 
                onClick={clearAllData}
                style={{ padding: '0.75rem 1rem' }}
              >
                🗑️ Clear All Data
              </Button>
            )}
          </div>

          <div>
            <SectionTitle>
              <Coffee size={24} color="#d97706" />
              Our Sweet Memories Together 💕
              {!isOnline && (
                <span style={{ fontSize: '0.875rem', color: '#ef4444', marginLeft: '0.5rem' }}>
                  (Offline Mode)
                </span>
              )}
            </SectionTitle>
            
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '2rem 0', color: '#6b7280' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                <p>Loading your beautiful memories from the cloud... ☁️</p>
              </div>
            ) : expenses.length === 0 ? (
              <EmptyState>
                <EmptyIcon>💑</EmptyIcon>
                <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No memories added yet!</p>
                <p style={{ fontSize: '0.875rem', color: '#ec4899' }}>Start creating beautiful memories together ✨</p>
              </EmptyState>
            ) : (
              <div>
                {expenses.map((expense) => (
                  <ExpenseItem key={expense.id}>
                    <ExpenseInfo>
                      <ExpenseMeta>
                        <ExpenseTitle>
                          <span>✨</span>
                          {expense.description}
                        </ExpenseTitle>
                        <Badge className={expense.paidBy === 'Akbar' ? 'blue' : 'purple'}>
                          {expense.paidBy === 'Akbar' ? '💙 Akbar paid' : '💖 Noor paid'}
                        </Badge>
                        <Badge className={(expense.splitType === 'equal' ? 'green' : 'orange')}>
                          {expense.splitType === 'equal'
                            ? '💕 Shared equally'
                            : expense.splitType === 'paidBy'
                              ? `💝 ${expense.paidBy}'s treat`
                              : expense.splitType === 'allAkbar'
                                ? '🧾 100% owed by Akbar'
                                : '🧾 100% owed by Noor'}
                        </Badge>
                        {expense.category && (
                          <Badge className="blue">#{expense.category}</Badge>
                        )}
                      </ExpenseMeta>
                      <ExpenseDate>📅 {expense.date}</ExpenseDate>
                    </ExpenseInfo>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <ExpenseAmount>
                        💰 {formatRs(expense.amount)}
                      </ExpenseAmount>
                      <ActionButtons>
                        <ActionButton
                          className="edit"
                          onClick={() => startEdit(expense)}
                          title="Edit this sweet memory"
                        >
                          <Edit2 size={16} />
                        </ActionButton>
                        <ActionButton
                          className="delete"
                          onClick={() => deleteExpense(expense.id)}
                          title="Remove this memory"
                        >
                          <Trash2 size={16} />
                        </ActionButton>
                      </ActionButtons>
                    </div>
                  </ExpenseItem>
                ))}
              </div>
            )}
          </div>
        </Card>
      </MainContent>
    </Container>
  );
};

const ExpenseTrackerPage = ({ location }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PASSWORD = 'Sabar@7868';
  const STORAGE_KEY = 'expense_tracker_sana_akbar_auth';

  useEffect(() => {
    const isAuth = sessionStorage.getItem(STORAGE_KEY);
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a192f' }}>
        <div style={{ background: '#112240', padding: '2rem', borderRadius: '8px', border: '1px solid #233554', width: '100%', maxWidth: '420px' }}>
          <h1 style={{ color: '#64ffda', margin: 0, marginBottom: '0.5rem', fontSize: '1.5rem', textAlign: 'center' }}>Enter Password</h1>
          <p style={{ color: '#8892b0', fontSize: '0.95rem', textAlign: 'center', marginTop: 0, marginBottom: '1.5rem' }}>Akbar & Noor — Private Expense Tracker</p>
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #233554', background: '#0b1628', color: '#e6f1ff' }}
              required
            />
            <button type="submit" style={{ marginTop: '1rem', width: '100%', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #64ffda', color: '#0a192f', background: '#64ffda', fontWeight: 600 }}>
              Access
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <ExpenseSplitter />;
};

ExpenseTrackerPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ExpenseTrackerPage; 