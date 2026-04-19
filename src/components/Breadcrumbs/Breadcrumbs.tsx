import { Anchor, Breadcrumbs as MantineBreadcrumbs, Text } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

interface BreadcrumbsProps {
  breadcrumbs: { title: string; href: string }[];
}

const Breadcrumbs = ({ breadcrumbs }: BreadcrumbsProps) => {
  const items = breadcrumbs.map((item, index) => {
    if (breadcrumbs && breadcrumbs.length - 1 === index) {
      return (
        <Text c="#FFFFFF8F" fw={500} fz="md" key={`${index + 1}`}>
          {item.title}
        </Text>
      );
    }
    return (
      <Anchor
        component={Link}
        to={item.href}
        key={`${index + 1}`}
        underline="never"
      >
        <Text fw={500} fz="md" c="#FFFFFFCC">
          {item.title}
        </Text>
      </Anchor>
    );
  });
  return (
    <MantineBreadcrumbs
      separator={<IconChevronRight color="#FFFFFFCC" size={16} />}
    >
      {items}
    </MantineBreadcrumbs>
  );
};
export default Breadcrumbs;
