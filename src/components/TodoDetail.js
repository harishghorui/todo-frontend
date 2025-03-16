import { useState, useEffect } from 'react';
import styles from './TodoDetail.module.css';
import { RiDeleteBin6Line } from "react-icons/ri";

export default function TodoDetail({ todo, onUpdate, onDelete }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savingTimeout, setSavingTimeout] = useState(null);

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
    }
  }, [todo]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    scheduleUpdate(e.target.value, description);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    scheduleUpdate(title, e.target.value);
  };

  const scheduleUpdate = (newTitle, newDescription) => {
    if (savingTimeout) clearTimeout(savingTimeout);

    setIsSaving(true);

    const timeout = setTimeout(() => {
      onUpdate({
        ...todo,
        title: newTitle,
        description: newDescription,
      });
      setIsSaving(false);
    }, 500);

    setSavingTimeout(timeout);
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this todo?");
    if (confirmDelete) {
      onDelete(todo._id);
    }
  };

  if (!todo) return null;

  return (
    <div className={styles.todoDetail}>
      <div className={styles.header}>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className={styles.titleInput}
          placeholder="Todo title"
        />
        <div className={styles.deleteButton} onClick={handleDelete}>
          <RiDeleteBin6Line />
        </div>
      </div>
      
      <textarea
        value={description}
        onChange={handleDescriptionChange}
        className={styles.descriptionInput}
        placeholder="Add a description..."
      />
      
      {isSaving && (
        <div className={styles.savingIndicator}>
          Saving...
        </div>
      )}
    </div>
  );
}