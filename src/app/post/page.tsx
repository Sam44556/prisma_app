'use client'

import axios from 'axios'
import { useEffect, useState } from 'react'

export default function PostsPage() {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [posts, setPosts] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data) // full objects with id and name
    } catch (err) {
      console.error('Failed to fetch categories:', err)
    }
  }

  const fetchPosts = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setError('🔐 Please login to view posts')
      setPosts([])
      return
    }

    const query = selectedCategory ? `?category=${selectedCategory}` : ''
    const res = await fetch(`/api/posts${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    console.log('Posts response:', data)

    if (!res.ok) {
      setError('❌ Unauthorized. Please login again.')
      setPosts([])
    } else {
      setError(null)
      setPosts(Array.isArray(data) ? data : [])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login first!')
        return
      }

      await axios.post(
        '/api/posts',
        {
          title,
          content,
          categoryId: categoryId ? Number(categoryId) : undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      alert('Post created!')
      setTitle('')
      setContent('')
      setCategoryId('')
      fetchPosts()
    } catch (error: any) {
      console.error('Post creation failed:', error.response?.data)
    }
  }

  return (
    <div>
      <h2>Protected Posts</h2>

      <div>
        <label htmlFor="category">Filter by Category: </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <button onClick={fetchPosts}>Load Posts</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {posts.map((post: any, i: number) => (
          <li key={i}>
            <strong>{post.title}</strong> - <em>{post.category?.name}</em>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 mt-10">
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Post content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  )
}
