import styles from './TodoList.module.css';

export default function TodoList({ todos, onTodoClick, selectedTodoId }) {
  return (
    <div className={styles.todoList}>
      {todos.length === 0 ? (
        <div className={styles.emptyList}>No todos yet</div>
      ) : (
        todos.map((todo) => (
          <div 
            key={todo._id} 
            className={`${styles.todoItem} ${selectedTodoId === todo._id ? styles.selected : ''}`}
            onClick={() => onTodoClick(todo)}
          >
            <h3 className={styles.todoTitle}>{todo.title}</h3>

            <div className={styles.body}>
              {todo.description ? (
                <p className={styles.description}>
                  {todo.description}
                </p>
              ):
              (
                <p className={styles.description}>Click to add description</p>
              )}
              <p className={styles.todoDate}>
                {new Date(todo.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
