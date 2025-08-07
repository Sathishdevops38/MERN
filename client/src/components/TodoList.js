import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

const Todo = props => {
  const priority = props.todo.priority || 'medium';
  const priorityClass = `priority-${priority.toLowerCase()}`;
  const rowClass = `${props.todo.completed ? 'completed' : ''} ${priorityClass}`;

  let formattedDate = '-';
  if (props.todo.due_date) {
    const parts = props.todo.due_date.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      formattedDate = `${month}/${day}/${year}`;
    }
  }

  return (
    <tr className={rowClass}>
      <td>{props.todo.description}</td>
      <td>{formattedDate}</td>
      <td>{priority}</td>
      <td>
        <input type="checkbox" checked={props.todo.completed} onChange={() => props.toggleTodo(props.todo.id)} />
      </td>
      <td>
        <Link to={'/edit/' + props.todo.id}>Edit</Link>
      </td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={() => props.deleteTodo(props.todo.id)}>Remove</button>
      </td>
    </tr>
  );
};

export default function TodoList({ todos, loading }) {
  async function deleteTodo(id) {
    confirmAlert({
      title: 'Confirm to submit',
      message: 'Are you sure you want to delete this todo?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            await supabase.from('todos').delete().eq('id', id);
            toast.success('Todo deleted successfully');
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    });
  }

  async function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    await supabase
      .from('todos')
      .update({ completed: !todo.completed })
      .eq('id', id)
      .select();
    toast.info(`Todo marked as ${!todo.completed ? 'complete' : 'incomplete'}`);
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Todos List</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Completed</th>
            <th colSpan="2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map(currentTodo => (
            <Todo 
              todo={currentTodo} 
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo} 
              key={currentTodo.id} 
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}