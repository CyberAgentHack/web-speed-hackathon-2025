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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000077]"
      open={isOpen}
      onClose={onClose}
    >
      <HeadlessUi.DialogPanel className="border-0.5 rounded-2 w-[480px] shrink-0 grow-0 border-solid border-[#FFFFFF1F] bg-[#171717] px-4 py-8">
        {children}
      </HeadlessUi.DialogPanel>
    </HeadlessUi.Dialog>
  );
};
