function Modal({ modal, onClose }) {
  if (!modal.show) return null

  return (
    <div className="modal" style={{ display: 'block' }}>
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h3>{modal.title}</h3>
        <div dangerouslySetInnerHTML={{ __html: modal.content }} />
      </div>
    </div>
  )
}

export default Modal