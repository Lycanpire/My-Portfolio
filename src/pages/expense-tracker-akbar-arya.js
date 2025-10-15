import React, { useState, useEffect } from 'react';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { 
  addExpense as addExpenseToFirebase, 
  updateExpense as updateExpenseInFirebase, 
  deleteExpense as deleteExpenseFromFirebase, 
  subscribeToExpenses, 
  clearAllExpenses as clearAllExpensesFromFirebase 
} from '../firebase/expenseServiceAkbarArya';

const Container = styled.div`
  min-height: 100vh;
  background: radial-gradient(80% 80% at 50% 20%, #0b0f1a 0%, #06080f 100%);
  color: #e6e6e6;
  padding: 1rem;
`;

const MainContent = styled.div`
  max-width: 64rem;
  margin: 0 auto;
`;

const Card = styled.div`
  background: linear-gradient(180deg, rgba(20,24,36,0.85) 0%, rgba(10,12,20,0.85) 100%);
  border-radius: 0.75rem;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
  border: 1px solid #1f2937;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffd700 0%, #ff8c00 40%, #ff0000 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #9ca3af;
  text-align: center;
  margin-top: 0.25rem;
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
  border: 1px solid #1f2937;
  border-radius: 0.375rem;
  outline: none;
  background: #0b0f1a;
  color: #e6e6e6;
  &:focus {
    border-color: #ffd700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.12);
  }
`;

const Select = styled.select`
  padding: 0.5rem 0.75rem;
  border: 1px solid #1f2937;
  border-radius: 0.375rem;
  outline: none;
  background: #0b0f1a;
  color: #e6e6e6;
  &:focus {
    border-color: #ff0000;
    box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.12);
  }
`;

const Button = styled.button`
  padding: 0.6rem 1rem;
  border: 1px solid #1f2937;
  border-radius: 0.375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #0b0f1a;
  &.primary {
    background: linear-gradient(135deg, #ffd700 0%, #ff8c00 50%, #ff0000 100%);
  }
  &.secondary {
    background: linear-gradient(135deg, #9ca3af 0%, #6b7280 100%);
    color: #e6e6e6;
  }
`;

const ExpenseTrackerAkbarAryaInner = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    paidBy: 'Akbar',
    splitType: 'equal',
  });

  useEffect(() => {
    // Ensure anonymous auth for Firestore permissions
    let unsubAuth = () => {};
    try {
      if (!auth.currentUser) {
        signInAnonymously(auth).catch(() => {});
      }
      unsubAuth = onAuthStateChanged(auth, () => {});
    } catch (_) {}
    
    const unsubscribe = subscribeToExpenses((data) => setExpenses(data));
    return () => { try { unsubAuth(); } catch (_) {}; unsubscribe(); };
  }, []);

  const addExpense = async () => {
    if (!formData.description || !formData.amount) return;
    const newExpense = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      paidBy: formData.paidBy,
      splitType: formData.splitType,
      date: new Date().toLocaleDateString(),
    };
    await addExpenseToFirebase(newExpense);
    setFormData({ description: '', amount: '', paidBy: 'Akbar', splitType: 'equal' });
  };

  const updateExpense = async () => {
    if (!formData.description || !formData.amount) return;
    const updated = {
      description: formData.description,
      amount: parseFloat(formData.amount),
      paidBy: formData.paidBy,
      splitType: formData.splitType,
      date: new Date().toLocaleDateString(),
    };
    await updateExpenseInFirebase(editingId, updated);
    setEditingId(null);
    setFormData({ description: '', amount: '', paidBy: 'Akbar', splitType: 'equal' });
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      paidBy: expense.paidBy,
      splitType: expense.splitType || 'equal',
    });
  };

  const deleteExpense = async (id) => {
    await deleteExpenseFromFirebase(id);
  };

  const clearAll = async () => {
    if (window.confirm('Clear all expenses?')) {
      await clearAllExpensesFromFirebase();
    }
  };

  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const akbarPaid = expenses.filter(e => e.paidBy === 'Akbar').reduce((s, e) => s + e.amount, 0);
  const aryaPaid = expenses.filter(e => e.paidBy === 'Arya').reduce((s, e) => s + e.amount, 0);
  
  // Calculate what each person owes based on split type
  let akbarOwes = 0;
  let aryaOwes = 0;
  
  expenses.forEach(expense => {
    const amount = expense.amount;
    const splitType = expense.splitType || 'equal';
    
    switch (splitType) {
      case 'equal':
        // Split equally - each owes half
        akbarOwes += expense.paidBy === 'Arya' ? amount / 2 : 0;
        aryaOwes += expense.paidBy === 'Akbar' ? amount / 2 : 0;
        break;
      case 'paidBy':
        // Who paid covers all - no one owes anything
        break;
      case 'akbarOwesAll':
        // Akbar owes the full amount (regardless of who paid)
        akbarOwes += amount;
        break;
      case 'aryaOwesAll':
        // Arya owes the full amount (regardless of who paid)
        aryaOwes += amount;
        break;
      default:
        // Default to equal split
        akbarOwes += expense.paidBy === 'Arya' ? amount / 2 : 0;
        aryaOwes += expense.paidBy === 'Akbar' ? amount / 2 : 0;
    }
  });
  
  // Net balance: positive means Akbar is owed money, negative means Akbar owes money
  const net = aryaOwes - akbarOwes;

  return (
    <Container>
      <MainContent>
        <Card>
          <Title>Akbar & Arya — Bachelor Ledger 🦇🏎️⚔️</Title>
          <Subtitle>Batman vibes, weapons stash, and F1 weekends — split like legends.</Subtitle>

          <FormGrid>
            <Input placeholder="Expense (e.g., Batarang maintenance)" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <Input type="number" step="0.01" placeholder="Amount" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
            <Select value={formData.paidBy} onChange={(e) => setFormData({ ...formData, paidBy: e.target.value })}>
              <option value="Akbar">Akbar paid</option>
              <option value="Arya">Arya paid</option>
            </Select>
            <Select value={formData.splitType} onChange={(e) => setFormData({ ...formData, splitType: e.target.value })}>
              <option value="equal">Split equally</option>
              <option value="paidBy">Who paid covers all</option>
              <option value="akbarOwesAll">Akbar owes all</option>
              <option value="aryaOwesAll">Arya owes all</option>
            </Select>
            {editingId ? (
              <Button className="primary" onClick={updateExpense}>Update</Button>
            ) : (
              <Button className="primary" onClick={addExpense}>Add</Button>
            )}
          </FormGrid>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1.5rem 0' }}>
            <Card>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Garage & Armory Totals</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total</span><span>${total.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Akbar paid</span><span>${akbarPaid.toFixed(2)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Arya paid</span><span>${aryaPaid.toFixed(2)}</span></div>
            </Card>
            <Card>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Balance</div>
              {net > 0 ? (
                <div>Arya owes Akbar: ${net.toFixed(2)}</div>
              ) : net < 0 ? (
                <div>Akbar owes Arya: ${Math.abs(net).toFixed(2)}</div>
              ) : (
                <div>Even — like a perfect pit stop.</div>
              )}
            </Card>
          </div>
          
          <Card>
            <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Detailed Breakdown</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ color: '#ffd700', fontWeight: 600, marginBottom: '0.5rem' }}>Akbar's Share</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Owes:</span><span>${akbarOwes.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Paid:</span><span>${akbarPaid.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #1f2937' }}>
                  <span>Net:</span><span style={{ color: akbarPaid >= akbarOwes ? '#10b981' : '#ef4444' }}>
                    ${(akbarPaid - akbarOwes).toFixed(2)}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ color: '#ff0000', fontWeight: 600, marginBottom: '0.5rem' }}>Arya's Share</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Owes:</span><span>${aryaOwes.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Paid:</span><span>${aryaPaid.toFixed(2)}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #1f2937' }}>
                  <span>Net:</span><span style={{ color: aryaPaid >= aryaOwes ? '#10b981' : '#ef4444' }}>
                    ${(aryaPaid - aryaOwes).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Button className="secondary" onClick={clearAll}>Reset</Button>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {expenses.length === 0 ? (
              <p style={{ color: '#9ca3af', textAlign: 'center' }}>No entries yet — suit up and add some.</p>
            ) : (
              expenses.map((expense) => {
                const splitTypeLabels = {
                  'equal': 'Split equally',
                  'paidBy': 'Who paid covers all',
                  'akbarOwesAll': 'Akbar owes all',
                  'aryaOwesAll': 'Arya owes all'
                };
                
                return (
                  <div key={expense.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', border: '1px solid #1f2937', borderRadius: '8px', marginBottom: '0.75rem', background: '#0b0f1a' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{expense.description}</div>
                      <div style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                        {expense.date} • {expense.paidBy} paid • {splitTypeLabels[expense.splitType] || 'Split equally'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700 }}>${expense.amount.toFixed(2)}</span>
                      <button onClick={() => startEdit(expense)} style={{ background: 'transparent', color: '#ffd700', border: '1px solid #1f2937', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>Edit</button>
                      <button onClick={() => deleteExpense(expense.id)} style={{ background: 'transparent', color: '#ff4d4f', border: '1px solid #1f2937', padding: '0.25rem 0.5rem', borderRadius: '6px' }}>Delete</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </MainContent>
    </Container>
  );
};

const ExpenseTrackerAkbarArya = ({ location }) => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const PASSWORD = 'HMHS2025';
  const STORAGE_KEY = 'expense_tracker_akbar_arya_auth';

  useEffect(() => {
    const isAuth = sessionStorage.getItem(STORAGE_KEY);
    if (isAuth === 'true') setIsAuthenticated(true);
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
          <p style={{ color: '#8892b0', fontSize: '0.95rem', textAlign: 'center', marginTop: 0, marginBottom: '1.5rem' }}>Akbar & Arya — Bachelor Tracker</p>
          <form onSubmit={handleSubmit}>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #233554', background: '#0b1628', color: '#e6f1ff' }} required />
            <button type="submit" style={{ marginTop: '1rem', width: '100%', padding: '0.75rem 1rem', borderRadius: '6px', border: '1px solid #64ffda', color: '#0a192f', background: '#64ffda', fontWeight: 600 }}>Access</button>
          </form>
        </div>
      </div>
    );
  }

  return <ExpenseTrackerAkbarAryaInner />;
};

ExpenseTrackerAkbarArya.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ExpenseTrackerAkbarArya;


