"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";

export default function Home() {

  const columns = [
    // {field: 'id', headerName: 'ID', width: 90},
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'order', headerName: 'Order', width: 150 },
    {
      field: 'Action', headerName: 'Action', width: 90,
      renderCell: (params) => {
        return (
          <div>
            <button onClick={() => startEditMode(params.row)}>✏️</button>
            <button onClick={() => deleteCategory(params.row)}>🗑️</button>
          </div>
        )
      }
    }
  ]



  const APIBASE = process.env.NEXT_PUBLIC_API_BASE

  const [categoryList, setCategoryList] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  const [editMode, setEditMode] = useState(false);

  async function fetchCategory() {
    const data = await fetch(`${APIBASE}/category`);
    const c = await data.json();
    const c2 = c.map((category) => {
      return {
        ...category,
        id: category._id
      }
    })
    setCategoryList(c2);
  }

  useEffect(() => {
    fetchCategory();
  }, []);

  function handleCategoryFormSubmit(data) {
    if (editMode) {
      //Updating a category
      fetch(`${APIBASE}/category`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        fetchCategory()
        stopEditMode()
      });
      return
    }

    //Creating a new category
    fetch(`${APIBASE}/category`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchCategory());
  }

  function startEditMode(category) {
    reset(category)
    setEditMode(true)
  }

  function stopEditMode() {
    reset({
      name: '',
      order: ''
    })
    setEditMode(false)
  }

  async function deleteCategory(category) {
    if (!confirm(`Deleting [${category.name}]`)) return;

    const id = category._id
    await fetch(`${APIBASE}/category/${id}`, {
      method: "DELETE",
    })
    fetchCategory()
  }

  return (
    <main>
      <form onSubmit={handleSubmit(handleCategoryFormSubmit)}>
        <div className="grid grid-cols-2 gap-4 w-fit m-4 border border-gray-800 p-2">
          <div>Category name:</div>
          <div>
            <input
              name="name"
              type="text"
              {...register("name", { required: true })}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div>Order:</div>
          <div>
            <input
              name="order"
              type="number"
              {...register("order", { required: true })}
              className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div className="col-span-2 text-right">
            {editMode ?
              <>
                <input
                  type="submit"
                  value="Update"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" />

                {'  '}

                <button
                  onClick={() => stopEditMode()}
                  className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full">
                  Cancel
                </button>
              </>
              :
              <input
                type="submit"
                value="Add"
                className="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              />
            }
          </div>
        </div>
      </form>
      
      <div className="w-50 ml-4">
      <DataGrid
        rows={categoryList}
        columns={columns}
      />
      </div>
      {/* <div className="ml-4">
        <h1>Category ({categoryList.length})</h1>
        {categoryList.map((category) => (
          <div key={category._id} className="ml-4">
            ✦
            <button onClick={() => startEditMode(category)} className="ml-2">✏️</button>
            <button onClick={() => deleteCategory(category)} className="ml-2">🗑️</button>
            <Link href={`/product/category/${category._id}`} className="text-red-600">
              {category.name} ➡ {category.order}
            </Link>
          </div>
        ))}
      </div> */}
    </main>
  );
}
