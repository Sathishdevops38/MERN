import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';

import './App.css';

import CreateTodo from './components/CreateTodo';
import EditTodo from './components/EditTodo';
import TodoList from './components/TodoList';
import Clock from './components/Clock';

function App() {
  const [todos, setTodos] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchTodos();
  }, [location]);

  async function fetchTodos() {
    const { data, error } = await supabase.from('todos').select('*');
    if (error) {
      console.error('Error fetching todos:', error);
    } else {
      setTodos(data || []);
    }
  }

  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <Link to="/" className="navbar-brand">MERN-Stack Todo App</Link>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="navbar-item">
              <Link to="/" className="nav-link">Todos</Link>
            </li>
            <li className="navbar-item">
              <Link to="/create" className="nav-link">Create Todo</Link>
            </li>
          </ul>
        </div>
        <Clock />
      </nav>
      <br />
      <Route path="/" exact render={(props) => <TodoList {...props} todos={todos} fetchTodos={fetchTodos} />} />
      <Route path="/edit/:id" component={EditTodo} />
      <Route path="/create" component={CreateTodo} />
    </div>
  );
}

// Wrap App in Router to use useLocation hook
const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
