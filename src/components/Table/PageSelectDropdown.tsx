import {
  Combobox,
  Flex,
  ScrollArea,
  Text,
  UnstyledButton,
  useCombobox,
} from '@mantine/core';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';

function generatePages(totalPage: number) {
  const pages = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= totalPage; i++) {
    pages.push(i);
  }
  return pages;
}
interface PageSelectDropdownProps {
  selectPage: (pageNumber: number) => void;
  currentPage: number;
  totalPage: number;
}
const PageSelectDropdown = ({
  selectPage,
  currentPage,
  totalPage,
}: PageSelectDropdownProps) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const data = generatePages(totalPage);

  const options = data.map((item) => (
    <Combobox.Option value={`${item}`} key={item}>
      <Flex align="center" justify="space-between" gap={16}>
        <Text fw={500} fz="md" lh="md" c="#150904">
          {item}
        </Text>
        {+item === currentPage && <IconCheck width={20} />}
      </Flex>
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      width="fit-content"
      onOptionSubmit={(val) => {
        selectPage(+val);
        combobox.closeDropdown();
      }}
      styles={{
        dropdown: {
          padding: 0,
        },
        option: {
          padding: '12px 16px',
        },
      }}
    >
      <Combobox.Target>
        <UnstyledButton onClick={() => combobox.toggleDropdown()}>
          <Flex align="center">
            <Text fw={500} fz="md" lh="md" px={4} c="#884D30">
              {currentPage}
            </Text>
            <IconChevronDown width={20} />
          </Flex>
        </UnstyledButton>
      </Combobox.Target>

      <Combobox.Dropdown>
        <ScrollArea.Autosize type="scroll" mah={240}>
          {options}
        </ScrollArea.Autosize>
      </Combobox.Dropdown>
    </Combobox>
  );
};
export default PageSelectDropdown;
