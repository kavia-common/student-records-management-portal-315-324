import React, { useEffect, useRef } from "react";
import "./Modal.css";

/**
 * PUBLIC_INTERFACE
 * Modal dialog component for displaying content in an overlay.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - If true, modal is visible; otherwise renders nothing.
 * @param {function} props.onClose - Called when modal is requested to close (backdrop click, ESC, or close button).
 * @param {React.ReactNode} props.header - Content for the modal header (appears at the top).
 * @param {React.ReactNode} props.details - The main body/content of the modal, such as student details.
 * @param {React.ReactNode} props.footer - Content for the modal footer (e.g., actions).
 * @param {function} [props.onSubmit] - Optional. If provided, modal content will be rendered inside a form and onSubmit(event) will be called when submitted. Use event.preventDefault() as needed in your handler. Enables Enter key form submission from input fields.
 *
 * Example usage:
 *
 * // 1. Info Modal (no form - default)
 * <Modal
 *   isOpen={show}
 *   onClose={() => setShow(false)}
 *   header={<h2>Student Details</h2>}
 *   details={<div>Name: Jane<br/>Class: 10-A</div>}
 *   footer={<button onClick={() => setShow(false)}>Close</button>}
 * />
 *
 * // 2. Form Modal (with onSubmit)
 * <Modal
 *   isOpen={showForm}
 *   onClose={() => setShowForm(false)}
 *   header={<h2>Add Student</h2>}
 *   details={
 *     <>
 *       <label>
 *         Name: <input name="name" />
 *       </label>
 *       <br />
 *       <label>
 *         Class: <input name="class" />
 *       </label>
 *     </>
 *   }
 *   footer={
 *     <>
 *        <button
 *          className="modal-footer-btn"
 *          type="submit"
 *        >
 *          Add
 *        </button>
 *        <button
 *          className="modal-footer-btn"
 *          type="button"
 *          onClick={() => setShowForm(false)}
 *        >
 *          Cancel
 *        </button>
 *     </>
 *   }
 *   onSubmit={(e) => {
 *     e.preventDefault();
 *     // handle form submit
 *   }}
 * />
 */
function Modal({ isOpen, onClose, header, details, footer, onSubmit }) {
  const modalRef = useRef(null);

  // Keyboard accessibility: ESC closes modal, focus trap minimal.
  useEffect(() => {
    if (!isOpen) return;

    // Focus modal when opened
    if (modalRef.current) {
      modalRef.current.focus();
    }

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose && onClose();
      } else if (e.key === "Tab") {
        // Trap focus inside modal (very minimal)
        const focusableEls = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        if (focusableEls.length === 0) return; // No focusable elements
        if (e.shiftKey) {
          // Shift+Tab
          if (document.activeElement === firstEl) {
            lastEl.focus();
            e.preventDefault();
          }
        } else {
          // Tab
          if (document.activeElement === lastEl) {
            firstEl.focus();
            e.preventDefault();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Content builder, conditionally wrap in form if onSubmit is present
  const ModalContent = (
    <>
      <div className="modal-header">
        {header}
        <button
          aria-label="Close modal"
          className="modal-close"
          onClick={onClose}
          type="button"
          tabIndex={0}
        >
          ×
        </button>
      </div>
      <div className="modal-details">{details}</div>
      {footer && <div className="modal-footer">{footer}</div>}
    </>
  );

  // Wrapper: if onSubmit, wrap via <form>; else <div>
  const InnerWrapper = onSubmit
    ? (
      <form
        className="modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        onSubmit={onSubmit}
        data-testid="modal"
        // Ensures Enter key on any input triggers submit.
      >
        {ModalContent}
      </form>
    )
    : (
      <div
        className="modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        data-testid="modal"
      >
        {ModalContent}
      </div>
    );

  return (
    <div className="modal-backdrop" onClick={onClose} data-testid="modal-backdrop">
      {InnerWrapper}
    </div>
  );
}

export default Modal;

/*
---- Example usage (for test/demo, place in src/examples/ModalDemo.jsx) ----

import React, { useState } from "react";
import Modal from "../components/Modal";

function ModalDemo() {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Show Student Modal</button>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        header={<h2>Student Details</h2>}
        details={
          <div>
            <p><strong>Name:</strong> Alex Doe</p>
            <p><strong>Class:</strong> 7-B</p>
            <p><strong>Roll Number:</strong> 15</p>
          </div>
        }
        footer={
          <button className="modal-footer-btn" onClick={() => setOpen(false)}>
            Close
          </button>
        }
      />

      <button onClick={() => setOpenForm(true)}>Show Student Form Modal</button>
      <Modal
        isOpen={openForm}
        onClose={() => setOpenForm(false)}
        header={<h2>Add Student</h2>}
        details={
          <div>
            <label>
              Name: <input name="name" />
            </label>
            <br />
            <label>
              Class: <input name="class" />
            </label>
          </div>
        }
        footer={
          <>
            <button className="modal-footer-btn" type="submit">
              Add
            </button>
            <button className="modal-footer-btn" type="button" onClick={() => setOpenForm(false)}>
              Cancel
            </button>
          </>
        }
        onSubmit={e => {
          e.preventDefault();
          // handle form submission
        }}
      />
    </>
  );
}

export default ModalDemo;
*/
