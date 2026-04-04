'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminDeleteButton({ postId }: { postId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await fetch(`/api/posts/${postId}`, { method: 'DELETE' })
      router.refresh()
    } catch {
      alert('Delete failed')
    } finally {
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        <button onClick={handleDelete} disabled={loading} className="btn-danger" style={{ fontSize: 10, padding: '5px 10px' }}>
          {loading ? '…' : 'Confirm'}
        </button>
        <button onClick={() => setConfirming(false)} className="btn-ghost" style={{ fontSize: 10, padding: '5px 10px' }}>
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button onClick={() => setConfirming(true)} className="btn-danger" style={{ fontSize: 10, padding: '5px 12px' }}>
      Delete
    </button>
  )
}
