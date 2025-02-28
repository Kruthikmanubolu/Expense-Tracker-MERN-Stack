import React, { useEffect, useState } from 'react';
import { getExpenses, addExpense, updateExpense, deleteExpense, getIncomes, addIncome } from '../api/api';
import ExpenseForm from './ExpenseForm';
import IncomeForm from './IncomeForm';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import Particle from './Particle';
import '../index.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [username] = useState(localStorage.getItem('username') || '');
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', amount: '', category: '' });
  const [finance, setFinance] = useState(false);

  useEffect(() => {
    fetchExpenses();
    fetchIncomes();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const toggleChart = () => {
    setFinance(!finance)
  }

  const fetchIncomes = async () => {
    try {
      const { data } = await getIncomes();
      setIncomes(data);
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  };

  const handleAddExpense = async (expense) => {
    await addExpense(expense);
    fetchExpenses();
  };

  const handleAddIncome = async (income) => {
    await addIncome(income);
    fetchIncomes();
  };

  const handleEditClick = (expense) => {
    setEditingExpense(expense);
    setEditForm({
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingExpense) return;

    try {
      await updateExpense(editingExpense._id, {
        description: editForm.description,
        amount: Number(editForm.amount),
        category: editForm.category,
      });
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  const handleDelete = async (id) => {
    await deleteExpense(id);
    fetchExpenses();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  const expenseTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  const incomeTotals = incomes.reduce((acc, inc) => {
    acc[inc.category] = (acc[inc.category] || 0) + inc.amount;
    return acc;
  }, {});

  const totalIncome = Object.values(incomeTotals).reduce((sum, val) => sum + val, 0);
  const totalExpenses = Object.values(expenseTotals).reduce((sum, val) => sum + val, 0);
  const remainingIncome = totalIncome - totalExpenses;
  const redShades = [
    'rgba(255, 0, 0, 0.9)',  // Deep Red
    'rgba(220, 20, 60, 0.8)', // Crimson
    'rgba(255, 69, 0, 0.7)',  // Red-Orange
    'rgba(178, 34, 34, 0.7)', // Firebrick
    'rgba(255, 99, 71, 0.7)', // Tomato
    'rgba(205, 92, 92, 0.7)', // Indian Red
    'rgba(240, 128, 128, 0.7)', // Light Coral
  ];

  const chartData = {
    labels: [...Object.keys(expenseTotals), 'Remaining Income'],
    datasets: [{
      label: 'Financial Overview',
      data: [...Object.values(expenseTotals), remainingIncome > 0 ? remainingIncome : 0],
      backgroundColor: [
        ...Object.keys(expenseTotals).map((_,i) => redShades[i%redShades.length]), 
        'rgba(0, 255, 1, 0.7)', 
      ],
      borderColor: [
        ...Object.keys(expenseTotals).map(() => 'rgba(0, 0, 0, 1)'),
        'rgba(0, 0, 0, 1)',
      ],
      borderWidth: 2,
      offset: Object.keys(expenseTotals).map(() => 10).concat(0), 
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#ffffff',
          font: { size: 14 },
          padding: 20,
          usePointStyle: true,
          generateLabels: (chart) => {
            const data = chart.data;
            const total = totalIncome;
            return data.labels.map((label, i) => ({
              text: `${label}: ${((data.datasets[0].data[i] / total) * 100).toFixed(1)}%\nTotal: $${data.datasets[0].data[i]}`,
              fillStyle: data.datasets[0].backgroundColor[i],
              hidden: !chart.getDataVisibility(i),
              index: i,
              lineHeight: 1.5,
              fontColor : '#ffffff'
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          color: '#fff',
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = totalIncome > 0 ? ((value / totalIncome) * 100).toFixed(1) : 0;
            return `${label}: $${value} (${percentage}%)`;
          },
        },
      },
      datalabels: {
        color: '#fff', 
        font: {
          size: 14,
          weight: 'bold',
        },
        formatter: (value, context) => {
          const total = totalIncome;
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${context.chart.data.labels[context.dataIndex]} ${percentage}%`;
        },
        anchor: 'center', 
        align: 'center',
      },
    },
  };

  return (
    <div className="page-container dashboard-container">
      <div className="particle-bg">
        <Particle />
      </div>
      <div className="overlay" />
      <div className="glass-card dashboard-glass" style={{ maxWidth: 'none', width: '100%', margin: '0' }}>
        <div className="container mt-4">
          <div className="dashboard-header">
            <h1 className="form-title dashboard-brand">Spend Smart</h1>
            <button className="fancy-button logout-button" onClick={handleLogout}>Logout</button>
          </div>
          <h2 className="form-title mb-4">Hello, <span className="highlight-text">{username}</span>!</h2>
          
          <div className="mb-4">
            <IncomeForm onSubmit={handleAddIncome} />
            <ExpenseForm onSubmit={handleAddExpense} />
          </div>

          {editingExpense && (
          <div className="card p-3 mb-4">
            <h3 className="card-title">Edit Expense</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="row g-3">
                <div className="col-md-4">
                  <input
                    type="text"
                    name="description"
                    className="form-control"
                    value={editForm.description}
                    onChange={handleEditChange}
                    placeholder="Description"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    name="amount"
                    className="form-control"
                    value={editForm.amount}
                    onChange={handleEditChange}
                    placeholder="Amount"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    name="category"
                    className="form-control"
                    value={editForm.category}
                    onChange={handleEditChange}
                    placeholder="Category"
                    required
                  />
                </div>
                <div className="col-md-2 d-flex gap-2">
                  <button type="submit" className="btn btn-success btn-sm w-100">Save</button>
                  <button type="button" className="btn btn-secondary btn-sm w-100" onClick={handleCancelEdit}>Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}

<div className="mt-4">
          <h3 className='form-title'>Expense List</h3>
          {expenses.length === 0 ? (
            <p className="text-muted">No expenses yet.</p>
          ) : (
            <table className="table table-striped table-bordered">
              <thead className="thead-dark">
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp._id}>
                    <td>{exp.description}</td>
                    <td>${exp.amount}</td>
                    <td>{exp.category}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => handleEditClick(exp)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(exp._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

          <div className="mt-4">
            <h3 className="form-title">Financial Overview</h3>
            <button 
    className="btn btn-primary mb-3" 
    onClick={toggleChart}
  >
    {finance ? 'Hide Pie Chart' : 'Show Pie Chart'}
  </button>
            {finance && totalIncome > 0 ? (
              <div className="glass-card-dash">
                <Pie data={chartData} options={chartOptions} style={{ maxHeight: '400px' }} />
              </div>
            ) : (
              <p className="footer-text"></p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;