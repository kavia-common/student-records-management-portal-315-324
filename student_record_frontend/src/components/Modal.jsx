import React, { useEffect, useRef } from "react";
import "./Modal.css";

/**
 * PUBLIC_INTERFACE
 * Modal dialog component for displaying content in an overlay.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - If true, modal is visible; otherwise renders nothing.
 * @param {function} props.onClose - Called when modal is requested to close (backdrop click, Esc, or close button).
 * @param {React.ReactNode} props.header - Content for the modal header (appears at the top).
 * @param {React.ReactNode} props.details - The main body/content of the modal, such as student details.
 * @param {React.ReactNode} props.footer - Content for the modal footer (e.g., actions).
 * 
 * Example usage:
 * 
 * <Modal
 *   isOpen={show}
 *   onClose={() => setShow(false)}
 *   header={<h2>Student Details</h2>}
 *   details={<div>Name: Jane<br/>Class: 10-A</div>}
 *   footer={<button onClick={() => setShow(false)}>Close</button>}
 * />
 */
function Modal({ isOpen, onClose, header, details, footer }) {
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

  return (
    <div className="modal-backdrop" onClick={onClose} data-testid="modal-backdrop">
      <div
        className="modal"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={e => e.stopPropagation()} // Prevent click bubbling to backdrop
        data-testid="modal"
      >
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
      </div>
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
    </>
  );
}

export default ModalDemo;
*/
