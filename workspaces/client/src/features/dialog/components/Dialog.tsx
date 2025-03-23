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
      <HeadlessUi.Dialog.Panel>
        {() => (
          <div className="w-[480px] shrink-0 grow-0 rounded-[8px] border-[2px] border-solid border-[#FFFFFF1F] bg-[#171717] px-[16px] py-[32px]">
            {children}
          </div>
        )}
      </HeadlessUi.Dialog.Panel>
    </HeadlessUi.Dialog>
  );
};
