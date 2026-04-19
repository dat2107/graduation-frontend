import { Flex, rem, Table, Text, UnstyledButton } from '@mantine/core';
import { usePagination } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import { usePromiseTracker } from 'react-promise-tracker';
import PageSelectDropdown from './PageSelectDropdown';
import classes from './Table.module.scss';

const ITEMS_PER_PAGE = 10;

interface TableProps {
  rows: JSX.Element[];
  header: JSX.Element;
}
interface ControlledTableProps extends TableProps {
  total: number;
  page: number;
  setPage: (pageNumber: number) => void;
}
function chunk<T>(array: T[], size: number): T[][] {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
}

const UncontrolledTable = ({ rows, header }: TableProps): JSX.Element => {
  const { promiseInProgress } = usePromiseTracker();

  const [page, onChange] = useState(1);
  const pagination = usePagination({
    total: Math.ceil(rows.length / ITEMS_PER_PAGE),
    page,
    onChange,
  });
  const data = chunk(rows, ITEMS_PER_PAGE);
  const items = data[page - 1];
  useEffect(() => {
    onChange(1);
  }, [rows]);
  return (
    <>
      <Table
        stickyHeader
        horizontalSpacing={24}
        styles={{
          table: {
            borderLeft: 0,
            borderRight: 0,
          },
          th: {
            height: rem(40),
            background: '#F5F5F5',
          },
          td: {
            height: rem(56),
          },
        }}
        withTableBorder
      >
        <Table.Thead>
          <Table.Tr>{header}</Table.Tr>
        </Table.Thead>
        {!promiseInProgress && <Table.Tbody>{items}</Table.Tbody>}
      </Table>
      {!promiseInProgress && (
        <Flex justify="space-between" align="center">
          <Text pl={28} fz="md" lh="md" c="#594B45">
            <Text component="span" c="#6E361A">
              {(page - 1) * ITEMS_PER_PAGE + 1} -{' '}
              {Math.min(page * ITEMS_PER_PAGE, rows.length)}
            </Text>{' '}
            trên {rows.length} giao dịch
          </Text>
          <Flex align="center" gap={24}>
            <Flex gap={7} align="center">
              <Text fz="md" lh="md" c="#594B45">
                Trang{' '}
              </Text>
              <PageSelectDropdown
                selectPage={pagination.setPage}
                currentPage={page}
                totalPage={data.length}
              />
              <Text fz="md" lh="md" c="#594B45">
                trong {Math.ceil(rows.length / ITEMS_PER_PAGE)}
              </Text>
            </Flex>
            <Flex>
              <UnstyledButton
                onClick={pagination.previous}
                p={24}
                disabled={page === 1}
                className={classes.paginationButton}
              >
                <IconChevronLeft width={24} />
              </UnstyledButton>
              <UnstyledButton
                onClick={pagination.next}
                p={24}
                className={classes.paginationButton}
                disabled={page === data.length}
              >
                <IconChevronRight width={24} />
              </UnstyledButton>
            </Flex>
          </Flex>
        </Flex>
      )}
    </>
  );
};
const ControlledTable = ({
  rows,
  header,
  total,
  page,
  setPage,
}: ControlledTableProps): JSX.Element => (
  <>
    <Table
      stickyHeader
      horizontalSpacing={24}
      styles={{
        table: {
          borderLeft: 0,
          borderRight: 0,
        },
        th: {
          height: rem(40),
          background: '#F5F5F5',
        },
        td: {
          height: rem(56),
        },
      }}
      withTableBorder
    >
      <Table.Thead>
        <Table.Tr>{header}</Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>

    <Flex justify="space-between" align="center">
      <Text pl={28} fz="md" lh="md" c="#594B45">
        <Text component="span" c="#6E361A">
          {(page - 1) * 10 + 1} - {Math.min(page * 10, total)}
        </Text>{' '}
        trên {total} giao dịch
      </Text>
      <Flex align="center" gap={24}>
        <Flex gap={7} align="center">
          <Text fz="md" lh="md" c="#594B45">
            Trang{' '}
          </Text>
          <PageSelectDropdown
            selectPage={setPage}
            currentPage={page}
            totalPage={Math.ceil(total / ITEMS_PER_PAGE)}
          />
          <Text fz="md" lh="md" c="#594B45">
            trong {Math.ceil(total / ITEMS_PER_PAGE)}
          </Text>
        </Flex>
        <Flex>
          <UnstyledButton
            onClick={() => setPage(page - 1)}
            p={24}
            disabled={page === 1}
            className={classes.paginationButton}
          >
            <IconChevronLeft width={24} />
          </UnstyledButton>
          <UnstyledButton
            onClick={() => setPage(page + 1)}
            p={24}
            className={classes.paginationButton}
            disabled={page === total}
          >
            <IconChevronRight width={24} />
          </UnstyledButton>
        </Flex>
      </Flex>
    </Flex>
  </>
);
export { ControlledTable, UncontrolledTable };
