import React, { useState, useEffect } from 'react';
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
    splitType: 'equal'
  });



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

  const addExpense = async () => {
    if (!formData.description || !formData.amount) return;
    
    try {
      const newExpense = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        paidBy: formData.paidBy,
        splitType: formData.splitType,
        date: new Date().toLocaleDateString()
      };
      
      await addExpenseToFirebase(newExpense);
      setFormData({ description: '', amount: '', paidBy: 'Akbar', splitType: 'equal' });
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    }
  };

  const updateExpense = async () => {
    if (!formData.description || !formData.amount) return;
    
    try {
      const updatedExpense = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        paidBy: formData.paidBy,
        splitType: formData.splitType,
        date: new Date().toLocaleDateString()
      };
      
      await updateExpenseInFirebase(editingId, updatedExpense);
      setEditingId(null);
      setFormData({ description: '', amount: '', paidBy: 'Akbar', splitType: 'equal' });
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense. Please try again.');
    }
  };

  const deleteExpense = async (id) => {
    try {
      await deleteExpenseFromFirebase(id);
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Failed to delete expense. Please try again.');
    }
  };

  const startEdit = (expense) => {
    setEditingId(expense.id);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      paidBy: expense.paidBy,
      splitType: expense.splitType || 'equal'
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ description: '', amount: '', paidBy: 'Akbar', splitType: 'equal' });
  };

  const calculateBalance = () => {
    let akbarOwes = 0;
    let sanaOwes = 0;
    
    expenses.forEach(expense => {
      if (expense.splitType === 'equal') {
        const halfAmount = expense.amount / 2;
        if (expense.paidBy === 'Akbar') {
          sanaOwes += halfAmount;
        } else {
          akbarOwes += halfAmount;
        }
      }
    });
    
    const netBalance = akbarOwes - sanaOwes;
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const akbarPaid = expenses.filter(e => e.paidBy === 'Akbar').reduce((sum, e) => sum + e.amount, 0);
    const sanaPaid = expenses.filter(e => e.paidBy === 'Sana').reduce((sum, e) => sum + e.amount, 0);
    
    return {
      total: totalExpenses,
      akbarPaid,
      sanaPaid,
      akbarOwes,
      sanaOwes,
      netBalance
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
                Akbar & Sana
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
              <Select
                value={formData.paidBy}
                onChange={(e) => setFormData({...formData, paidBy: e.target.value})}
              >
                <option value="Akbar">💙 Akbar paid</option>
                <option value="Sana">💖 Sana paid</option>
              </Select>
              <Select
                value={formData.splitType}
                onChange={(e) => setFormData({...formData, splitType: e.target.value})}
              >
                <option value="equal">💕 Share equally (our love is 50/50)</option>
                <option value="paidBy">💝 {formData.paidBy}'s treat</option>
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
                <SummaryValue>${balance.total.toFixed(2)}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <span>💙 Akbar's Share:</span>
                <SummaryValue>${balance.akbarOwes.toFixed(2)}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <span>💖 Sana's Share:</span>
                <SummaryValue>${balance.sanaOwes.toFixed(2)}</SummaryValue>
              </SummaryItem>
            </SummaryCard>

            <SummaryCard className="purple">
              <SummaryTitle className="purple">💕 Love Balance</SummaryTitle>
              <SummaryItem>
                <span>💙 Akbar contributed:</span>
                <SummaryValue>${balance.akbarPaid.toFixed(2)}</SummaryValue>
              </SummaryItem>
              <SummaryItem>
                <span>💖 Sana contributed:</span>
                <SummaryValue>${balance.sanaPaid.toFixed(2)}</SummaryValue>
              </SummaryItem>
              <div style={{ borderTop: '1px solid #c4b5fd', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                {balance.netBalance > 0 ? (
                  <div style={{ color: '#581c87', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>💝</span>
                    Sana owes Akbar: ${balance.netBalance.toFixed(2)}
                  </div>
                ) : balance.netBalance < 0 ? (
                  <div style={{ color: '#581c87', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <span>💝</span>
                    Akbar owes Sana: ${Math.abs(balance.netBalance).toFixed(2)}
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
                          {expense.paidBy === 'Akbar' ? '💙 Akbar paid' : '💖 Sana paid'}
                        </Badge>
                        <Badge className={expense.splitType === 'equal' ? 'green' : 'orange'}>
                          {expense.splitType === 'equal' ? '💕 Shared equally' : `💝 ${expense.paidBy}'s treat`}
                        </Badge>
                      </ExpenseMeta>
                      <ExpenseDate>📅 {expense.date}</ExpenseDate>
                    </ExpenseInfo>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <ExpenseAmount>
                        💰 ${expense.amount.toFixed(2)}
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

const ExpenseTrackerPage = ({ location }) => (
  <ExpenseSplitter />
);

ExpenseTrackerPage.propTypes = {
  location: PropTypes.object.isRequired,
};

export default ExpenseTrackerPage; 