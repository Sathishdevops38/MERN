import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { supabase } from '../supabaseClient';

export default function CreateTodo() {
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const history = useHistory();

  async function onSubmit(e) {
    e.preventDefault();

    if (!description.trim()) {
      toast.error('Todo description cannot be empty!');
      return;
    }

    const { error } = await supabase
      .from('todos')
      .insert([{ description, due_date: dueDate, priority, completed: false }])
      .select();

    if (error) {
      toast.error('Error creating todo');
      console.error('Error creating todo:', error);
    } else {
      toast.success('Todo created successfully!');
      history.push('/');
    }
  }

  return (
    <div>
      <h3>Create New Todo</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Description: </label>
          <input
            type="text"
            name="description"
            className="form-control"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Enter your todo description..."
          />
        </div>
        <div className="form-group">
          <label>Due Date: </label>
          <input
            type="date"
            name="dueDate"
            className="form-control"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Priority: </label>
          <select
            name="priority"
            className="form-control"
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div className="form-group">
          <input type="submit" value="Create Todo" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}