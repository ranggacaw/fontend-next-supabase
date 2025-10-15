"use client"

import { Button } from '@/components/ui/button'
import axios from 'axios';
import { clear } from 'console';
import React, { useState } from 'react'

const CreateBlogPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const clearForm = () => {
    setTitle('');
    setDescription('');
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      // alert(`${title}\n\n${description}`);
      const response = await axios.post('http://localhost:3211',
        {
          title: title,
          description: description,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      alert("Blog created successfully");
      clearForm();
    } catch (error) {
      console.log(error);
      alert("Error creating blog");
    }
  }


  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Create Blog</h1>
        <Button onClick={() => window.location.href = '/'}
          className='cursor-pointer me-2'
        >
          Home
        </Button>
      </div>
      <form className="flex flex-col gap-4" method='post' onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <label htmlFor="title" className="text-gray-500">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow"
          />

          <label htmlFor="description" className="text-gray-500">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-lg p-2 shadow-sm hover:shadow-md transition-shadow"
          />
          <Button className="mt-4 cursor-pointer" type='submit'>Create</Button>
        </div>

      </form>
    </div>
  )
}

export default CreateBlogPage