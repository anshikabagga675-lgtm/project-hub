import { MessageCircle, Send } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/useAuth.js'

function CommentSection({ comments = [], onAddComment }) {
  const { user } = useAuth()
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!message.trim()) return
    onAddComment({
      author: user?.name || 'Alex Morgan',
      initials: user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'AM',
      color: user?.avatarColor || 'lavender',
      text: message.trim(),
    })
    setMessage('')
  }

  return (
    <section className="comments-section">
      <div className="section-title-inline"><MessageCircle size={17} /><h3>Discussion</h3><span>{comments.length}</span></div>
      {comments.length === 0 ? (
        <p className="comments-empty">No comments yet. Start the conversation.</p>
      ) : (
        <div className="comment-list">
          {comments.map((comment) => (
            <article className="comment-item" key={comment.id}>
              <span className={`avatar avatar-small avatar-${comment.color || 'blue'}`}>{comment.initials || comment.author?.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
              <div className="comment-body"><div className="comment-author"><strong>{comment.author}</strong><time>{new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(comment.createdAt))}</time></div><p>{comment.text}</p></div>
            </article>
          ))}
        </div>
      )}
      <form className="comment-form" onSubmit={handleSubmit}>
        <input aria-label="Write a comment" onChange={(event) => setMessage(event.target.value)} placeholder="Write a comment..." value={message} />
        <button aria-label="Send comment" className="comment-send" disabled={!message.trim()} type="submit"><Send size={16} /></button>
      </form>
    </section>
  )
}

export default CommentSection
