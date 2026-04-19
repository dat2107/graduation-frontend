import IconAccount from '@/assets/images/icon/icon-account.png';
import IconLoan from '@/assets/images/icon/icon-loan.png';
import IconSaving from '@/assets/images/icon/icon-saving.png';

const SLIDES = [
  {
    value: 50000,
    image: IconAccount,
    label: 'Tổng số dư khả dụng',
    isShowEye: true,
    count: '6',
    currency: 'VND',
  },
  {
    value: 50000,
    image: IconAccount,
    label: 'Tổng số dư khả dụng',
    isShowEye: true,
    count: '6',
    currency: 'VND',
  },
];
const SLIDES_LOAN = [
  {
    value: 50000,
    image: IconLoan,
    label: 'Tổng dư nợ',
    isShowEye: false,
    count: '6',
    currency: 'VND',
  },
  {
    value: 50000,
    image: IconLoan,
    label: 'Tổng dư nợ',
    isShowEye: false,
    count: '6',
    currency: 'VND',
  },
];

const SLIDES_SAVING = [
  {
    value: 50000,
    image: IconSaving,
    label: 'Tổng số tiền gửi VND',
    isShowEye: false,
    count: '6',
    currency: 'VND',
  },
  {
    value: 50000,
    image: IconSaving,
    label: 'Tổng số tiền gửi VND',
    isShowEye: false,
    count: '6',
    currency: 'VND',
  },
];

export { SLIDES, SLIDES_LOAN, SLIDES_SAVING };
