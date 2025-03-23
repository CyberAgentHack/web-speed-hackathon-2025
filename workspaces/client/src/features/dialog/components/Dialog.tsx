import { ReactNode, useEffect, useRef } from 'react';

interface Props {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Dialog = ({ children, isOpen, onClose }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
      // スクロール防止
      document.body.style.overflow = 'hidden';
    } else {
      dialog.close();
      // スクロール復帰
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-[480px] rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F] bg-[#171717] px-[16px] py-[32px] text-[#ffffff]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </dialog>
  );
};
