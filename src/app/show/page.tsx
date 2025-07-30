'use client'

import { useState } from 'react'

export default function CreateAllDataForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    title: '',
    content: '',
    categoryName: '',
  })

  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (res.ok) {
      setMessage('✅ Data created successfully!')
      setForm({
        name: '',
        email: '',
        password: '',
        title: '',
        content: '',
        categoryName: '',
      })
    } else {
      setMessage('❌ Error: ' + (data.error || 'Something went wrong'))
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: '2rem' }}>
      <h2>Create Full Data Entry</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="User Name" onChange={handleChange} value={form.name} required />
        <input name="email" placeholder="Email" onChange={handleChange} value={form.email} required type="email" />
        <input name="password" placeholder="Password" onChange={handleChange} value={form.password} required type="password" />
        <input name="title" placeholder="Post Title" onChange={handleChange} value={form.title} required />
        <textarea name="content" placeholder="Post Content" onChange={handleChange} value={form.content} rows={4} />
        
        <select name="categoryName" value={form.categoryName} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option value="Art">Art</option>
          <option value="Tech">Tech</option>
          <option value="Science">Science</option>
          <option value="Lifestyle">Lifestyle</option>
        </select>

        <button type="submit">Create All</button>
      </form>

      {message && <p style={{ marginTop: '1rem', color: message.startsWith('✅') ? 'green' : 'red' }}>{message}</p>}
    </div>
  )
}
