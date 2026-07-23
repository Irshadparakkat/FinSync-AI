import type { PropsWithChildren, ReactNode } from 'react';
import { Modal } from 'antd';

interface AppModalProps extends PropsWithChildren {
  open: boolean;
  title: ReactNode;
  onClose: () => void;
  /** Forms render their own footer buttons; default is no footer. */
  footer?: ReactNode;
  width?: number;
}

/**
 * Reusable modal wrapper: consistent width, centered, state destroyed on
 * close so re-opened forms always start fresh. Feature modals compose
 * this instead of styling antd Modal repeatedly.
 */
export function AppModal({ open, title, onClose, footer = null, width = 560, children }: AppModalProps) {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      footer={footer}
      width={width}
      centered
      destroyOnHidden
      maskClosable={false}
    >
      {children}
    </Modal>
  );
}
