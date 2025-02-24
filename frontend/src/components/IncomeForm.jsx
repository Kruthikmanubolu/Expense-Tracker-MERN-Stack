import React, { useState } from 'react';

const IncomeForm = ({ onSubmit }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ description, amount: Number(amount), category });
    setDescription('');
    setAmount('');
    setCategory('');
  };

  return (
    <div className="card p-3 mb-4">
      <h3 className="card-title">Add Income</h3>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              required
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              required
            />
          </div>
          <div className="col-md-2">
            <button type="submit" className="btn btn-success w-100">Add</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default IncomeForm;