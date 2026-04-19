import {
  Box,
  Button,
  Divider,
  Flex,
  Image,
  MantineSize,
  Modal,
  Space,
  Stack,
  Text,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import iconFailed from '@/assets/svgs/icon/fail.svg';
import iconInfoBlue from '@/assets/svgs/icon/icon-info-blue.svg';
import iconInfoOrange from '@/assets/svgs/icon/icon-info-orange.svg';
import IconX from '@/assets/svgs/icon/IconX.svg';
import iconSuccess from '@/assets/svgs/icon/success.svg';
import classes from './popup.module.scss';

interface IPopup {
  opened: boolean;
  close: () => void;
  title?: string;
  description?: ReactNode;
  approve?: () => void;
  reject?: () => void;
  approveTitle?: string;
  rejectTitle?: string;
  withAction?: boolean;
  size?: number | MantineSize | (string & {}) | undefined;
}
interface INotification extends IPopup {
  popupIconSrc?: 'success' | 'failed' | 'infoOne' | 'infoTwo' | undefined;
}
const Popup = ({
  opened,
  close,
  title,
  description,
  approve,
  reject,
  approveTitle,
  rejectTitle,
  size,
}: IPopup) => {
  const { t } = useTranslation();

  const handleReject = () => {
    close();
    if (reject) reject();
  };
  const handleApprove = () => {
    close();
    if (approve) approve();
  };
  return (
    <Modal
      size={size}
      opened={opened}
      onClose={close}
      zIndex={500}
      title={title}
      centered
      radius={16}
      withinPortal={false}
      classNames={{
        header: classes.modalHeader,
        title: classes.modalTitle,
        body: classes.modalBody,
        inner: classes.modalInner,
      }}
    >
      <Box className={classes.modalContent}>{description}</Box>
      <Divider my={20} />
      <Flex
        className={classes.modalButtonGroup}
        justify={reject ? 'space-between' : 'flex-end  '}
      >
        {reject && (
          <UnstyledButton onClick={handleReject}>
            {rejectTitle || t('NO')}
          </UnstyledButton>
        )}
        <Button variant="primary" onClick={handleApprove} size="md">
          {approveTitle || t('AGREE')}
        </Button>
      </Flex>
    </Modal>
  );
};
const Notification = ({
  opened,
  close,
  title = '',
  description,
  approve,
  reject,
  approveTitle,
  rejectTitle,
  popupIconSrc,
  withAction = false,
}: INotification) => {
  const { t } = useTranslation();
  const handleReject = () => {
    close();
    if (reject) reject();
  };
  const handleApprove = () => {
    close();
    if (approve) approve();
  };
  const getIconSrc = () => {
    switch (popupIconSrc) {
      case 'success':
        return iconSuccess;
      case 'failed':
        return iconFailed;
      case 'infoOne':
        return iconInfoOrange;
      case 'infoTwo':
        return iconInfoBlue;
      default:
        return null;
    }
  };
  return (
    <Modal
      opened={opened}
      onClose={close}
      centered
      closeOnClickOutside
      withinPortal={false}
      size={365}
      withCloseButton={false}
      radius={12}
      classNames={{ header: classes.headerPopup }}
      styles={{ inner: { left: 0 } }}
    >
      <Flex justify="flex-end">
        <Box onClick={close}>
          <Image src={IconX} alt="" />
        </Box>
      </Flex>
      <Stack align="center" gap={rem(8)}>
        {withAction && (
          <Image w={rem(96)} src={getIconSrc()} alt="ad" key="popup-icon" />
        )}
        <Text ta="center" fw={700} fz="xl" style={{ whiteSpace: 'pre-line' }}>
          {title || t('NOTIFICATION')}
        </Text>
        {typeof description === 'string' ? (
          <Text ta="center" fz="md" style={{ whiteSpace: 'pre-line' }}>
            {description}
          </Text>
        ) : (
          description
        )}
      </Stack>
      <Space h={rem(24)} />
      <Stack align="center" gap={16}>
        <Button
          bg="#FAAA46"
          c="#443129"
          onClick={handleApprove}
          radius={rem(40)}
          w="100%"
          h={48}
        >
          {approveTitle || t('AGREE')}
        </Button>
        <Button w="100%" onClick={handleReject} bg="transparent" c="#894F34">
          {rejectTitle || t('NO')}
        </Button>
      </Stack>
    </Modal>
  );
};
export { Notification, Popup };
