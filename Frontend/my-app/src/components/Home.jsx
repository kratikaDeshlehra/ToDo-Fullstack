import React, { useEffect, useState ,} from "react";
import { useNavigate } from "react-router-dom";
function Home() {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  const navigateTo=useNavigate();
useEffect(() => {
  const fetchtodos = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:4001/todo/fetch", {
        method: "GET",
        credentials: "include", // send cookies
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch");
      }

      const data = await response.json();
      console.log(data.todos);

      setTodos(data.todos);
      setError(null);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  };

  fetchtodos();
}, []);


const logout=async ()=>{
 const res= await fetch("http://localhost:4001/user/logout", {
    method: "POST",
    credentials: "include", // send cookies
  });

  if(!res.ok){
    console.log("Logout failed");


  }
 
    navigateTo("/login");
  
  
}

 const todoCreate = async () => {
  if (!newTodo) return;

  try {
    const response = await fetch("http://localhost:4001/todo/create", {
      method: "POST",
      credentials: "include",  
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: newTodo,
        completed: false,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create todo");
    }

    const data = await response.json();

    console.log(data.newTodo);
    setTodos([...todos, data.newTodo]);
    setNewTodo("");

  } catch (error) {
    setError("Failed to create todo");
    console.error(error);
  }
};


 const todoStatus = async (id) => {
  const todo = todos.find((t) => t._id === id);

  try {
    const response = await fetch(`http://localhost:4001/todo/update/${id}`, {
      method: "PUT",
      credentials: "include", // send cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...todo,
        completed: !todo.completed,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update todo");
    }

    const data = await response.json();

    console.log(data.todo);

    setTodos(todos.map((t) => (t._id === id ? data.todo : t)));

  } catch (error) {
    setError("Failed to find todo status");
    console.error(error);
  }
};


  const todoDelete = async (id) => {
  try {
    const response = await fetch(`http://localhost:4001/todo/delete/${id}`, {
      method: "DELETE",
      credentials: "include", // send cookies
    });

    if (!response.ok) {
      throw new Error("Failed to delete");
    }

    setTodos(todos.filter((t) => t._id !== id));
  } catch (error) {
    setError("Failed to Delete Todo");
    console.error(error);
  }
};


  const remainingTodos = todos.filter((todo) => !todo.completed).length;

  return (
    <div className=" my-10 bg-gray-100 max-w-lg lg:max-w-xl rounded-lg shadow-lg mx-8 sm:mx-auto p-6">
      <h1 className="text-2xl font-semibold text-center">Todo App</h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && todoCreate()}
          className="flex-grow p-2 border rounded-l-md focus:outline-none"
        />
        <button
          onClick={todoCreate}
          className="bg-blue-600 border rounded-r-md text-white px-4 py-2 hover:bg-blue-900 duration-300"
        >
          Add
        </button>
      </div>
      {loading ? (
        <div className="text-center justify-center">
          <span className="textgray-500">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 font-semibold">{error}</div>
      ) : (
        <ul className="space-y-2">
          {todos.map((todo, index) => (
            <li
              key={todo._id || index}
              className="flex items-center justify-between p-3 bg-gray-100 rounded-md"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => todoStatus(todo._id)}
                  className="mr-2"
                />
                <span
                  className={`${
                    todo.completed
                      ? "line-through text-gray-800 font-semibold"
                      : ""
                  } `}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => todoDelete(todo._id)}
                className="text-red-500 hover:text-red-800 duration-300"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-4 text-center text-sm text-gray-700">
        {remainingTodos} remaining todos
      </p>
      <button
        onClick={() => logout()}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-800 duration-500 mx-auto block"
      >
        Logout
      </button>
    </div>
  );
}

export default Home;