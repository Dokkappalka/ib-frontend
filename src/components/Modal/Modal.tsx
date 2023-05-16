import React from 'react'
import styles from './Modal.module.scss'

interface PropsTypes {
  active: boolean
  setActive: (bol: boolean) => void
  children: React.ReactNode
}

const Modal = ({ active, setActive, children }: PropsTypes) => {
  return (
    <div
      className={active ? `${styles.modal} ${styles.active}` : styles.modal}
      onClick={() => {
        setActive(false)
      }}
    >
      <div
        className={
          active
            ? `${styles.modal__content} ${styles.active} dark:bg-[#212160]`
            : `${styles.modal__content} dark:bg-[#212160]`
        }
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
