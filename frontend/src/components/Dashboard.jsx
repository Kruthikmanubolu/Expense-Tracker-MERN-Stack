import React, { useEffect, useState } from 'react';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../api/api';
import ExpenseForm from './ExpenseForm';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', amount: '', category: '' });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await getExpenses();
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleAdd = async (expense) => {
    await addExpense(expense);
    fetchExpenses();
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
    console.log('Deleting expense with ID:', id);
    await deleteExpense(id);
    fetchExpenses();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/login';
  };

  
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});
  const totalAmount = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      label: 'Expenses by Category',
      data: Object.values(categoryTotals),
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',  
        'rgba(54, 162, 235, 0.7)',  
        'rgba(255, 206, 86, 0.7)',  
        'rgba(75, 192, 192, 0.7)',  
        'rgba(153, 102, 255, 0.7)', 
        'rgba(255, 159, 64, 0.7)',  
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { size: 14 },
          padding: 20,
          usePointStyle: true,
          generateLabels: (chart) => {
            const data = chart.data;
            const total = data.datasets[0].data.reduce((sum, val) => sum + val, 0);
            return data.labels.map((label, i) => ({
              text: `${label}: ${((data.datasets[0].data[i] / total) * 100).toFixed(1)}%\nTotal: $${data.datasets[0].data[i]}`,
              fillStyle: data.datasets[0].backgroundColor[i],
              hidden: !chart.getDataVisibility(i),
              index: i,
              lineHeight: 1.5,
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = totalAmount > 0 ? ((value / totalAmount) * 100).toFixed(1) : 0;
            return `${label}: $${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand">Expense Tracker</span>
          <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="container mt-4">
        <h2 className="mb-4">Hello, {username}!</h2>
        <ExpenseForm onSubmit={handleAdd} />

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
          <h3>Expense List</h3>
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
          <h3>Expense Chart</h3>
          {expenses.length > 0 ? (
            <Pie data={chartData} options={chartOptions} style={{ maxHeight: '400px' }} />
          ) : (
            <p className="text-muted">No data to display in chart.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;