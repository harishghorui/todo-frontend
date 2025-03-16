'use client';

import { useState, useEffect } from 'react';
import TodoList from '@/components/TodoList';
import TodoDetail from '@/components/TodoDetail';
import styles from './page.module.css';

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [page, setPage] = useState(1);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    fetchTodos();
  }, [page]);

  const fetchTodos = async () => {
    try {
      const response = await fetch(`/api/todos`);
      const data = await response.json();
      console.log("todos...", data);
      
      if (page === 1) {
        setTodos(data.todos);
      } else {
        setTodos(prev => [...prev, ...data.todos]);
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const createTodo = async () => {
    if (!newTodoTitle.trim()) return;
    
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTodoTitle,
          description: '',
          date: new Date().toISOString(),
        }),
      });
      
      if (response.ok) {
        const newTodo = await response.json();
        setTodos(prev => [newTodo, ...prev]);
        setNewTodoTitle('');
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const updateTodo = async (updatedTodo) => {
    try {
      const response = await fetch(`/api/todos/${updatedTodo._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTodo),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update todo");
      }

      const data = await response.json();

      setTodos(prev => 
        prev.map(todo => 
          todo._id === updatedTodo._id ? data : todo
        )
      );
      setSelectedTodo(data);
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (todoId) => {
    // const confirmDelete = window.confirm("Are you sure you want to delete this todo?");
    // if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/todos/${todoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodos(prev => prev.filter(todo => todo._id !== todoId));

      // If the deleted todo was selected, remove it from the view
      if (selectedTodo?._id === todoId) {
        setSelectedTodo(null);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <div className={styles.newTodoForm}>
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Add a new todo..."
              className={styles.newTodoInput}
            />
            <button onClick={createTodo} className={styles.addButton}>
              Add Todo
            </button>
          </div>
          
          <TodoList 
            todos={todos} 
            onTodoClick={(todo) => setSelectedTodo(todo)}
            selectedTodoId={selectedTodo?._id}
          />
        </div>
        
        <div className={styles.rightPane}>
          {selectedTodo ? (
            <TodoDetail 
              todo={selectedTodo} 
              onUpdate={updateTodo} 
              onDelete={deleteTodo} 
            />
          ) : (
            <div className={styles.noTodoSelected}>
              Select a todo to view details
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
