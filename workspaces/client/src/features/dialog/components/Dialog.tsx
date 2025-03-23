import * as HeadlessUi from '@headlessui/react';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export const Dialog = ({ children, isOpen, onClose }: Props) => {
  return (
    <HeadlessUi.Dialog
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.47)',
      }}
      open={isOpen}
      onClose={onClose}
    >
      <HeadlessUi.DialogPanel
        style={{
          width: '480px',
          flexShrink: 0,
          flexGrow: 0,
          borderRadius: '8px',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor: 'rgba(255, 255, 255, 0.12)',
          backgroundColor: '#171717',
          padding: '32px 16px',
        }}
      >
        {children}
      </HeadlessUi.DialogPanel>
    </HeadlessUi.Dialog>
  );
};
