import { useCallback, useEffect, useState } from 'react'
import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Loader,
  Menu,
  Modal,
  Pagination,
  PasswordInput,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import {
  IconAlertCircle,
  IconCheck,
  IconDotsVertical,
  IconPlus,
  IconSearch,
  IconShieldCheck,
  IconUser,
  IconUserCheck,
  IconUserOff,
  IconUsers,
  IconUserShield,
} from '@tabler/icons-react'
import UserService from '@/services/user/user.service'
import type { AdminUserRes, CreateTeacherRequest, UserRole } from '@/@types/user'

// ─── Constants ───────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
  ADMIN: { label: 'Admin', color: 'red' },
  TEACHER: { label: 'Teacher', color: 'violet' },
  STUDENT: { label: 'Student', color: 'blue' },
}

const PROVIDER_CONFIG: Record<string, { label: string; color: string }> = {
  LOCAL: { label: 'Local', color: 'gray' },
  GOOGLE: { label: 'Google', color: 'orange' },
  FACEBOOK: { label: 'Facebook', color: 'indigo' },
}

const ROLE_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả vai trò' },
  { value: 'STUDENT', label: 'Student' },
  { value: 'TEACHER', label: 'Teacher' },
  { value: 'ADMIN', label: 'Admin' },
]

const PAGE_SIZE = 10

// ─── Component ───────────────────────────────────────────────────────────────

const AdminUserManagement = () => {
  const [users, setUsers] = useState<AdminUserRes[]>([])
  const [loading, setLoading] = useState(true)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [debouncedSearch] = useDebouncedValue(search, 400)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // ─── Create Teacher Modal ────────────────────────────────────────────────────
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [teacherForm, setTeacherForm] = useState<CreateTeacherRequest>({
    username: '',
    password: '',
    fullName: '',
    email: '',
  })

  // ─── Stats ─────────────────────────────────────────────────────────────────
  const activeCount = users.filter((u) => u.active).length
  const inactiveCount = users.filter((u) => !u.active).length

  // ─── Fetch ─────────────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await UserService.getAllUsers({
        page: page - 1,
        size: PAGE_SIZE,
        search: debouncedSearch || undefined,
        role: roleFilter || undefined,
      })
      const data = resp.data
      setUsers(data.items)
      setTotalItems(data.totalItems)
      setTotalPages(data.totalPages)
    } catch {
      setAlert({ type: 'error', message: 'Không thể tải danh sách người dùng' })
    } finally {
      setLoading(false)
    }
  }, [page, debouncedSearch, roleFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, roleFilter])

  // ─── Actions ───────────────────────────────────────────────────────────────
  const handleToggleActive = async (user: AdminUserRes) => {
    setActionLoading(user.id)
    try {
      await UserService.updateActiveStatus({
        userId: user.id,
        active: !user.active,
      })
      setAlert({ type: 'success', message: `Đã ${user.active ? 'vô hiệu hóa' : 'kích hoạt'} tài khoản ${user.username}` })
      fetchUsers()
    } catch {
      setAlert({ type: 'error', message: 'Thao tác thất bại' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleChangeRole = async (user: AdminUserRes, newRole: UserRole) => {
    if (user.role === newRole) return
    setActionLoading(user.id)
    try {
      await UserService.updateRole({
        keycloakUserId: user.keycloakUserId,
        newRole,
      })
      setAlert({ type: 'success', message: `Đã đổi vai trò ${user.username} thành ${newRole}` })
      fetchUsers()
    } catch {
      setAlert({ type: 'error', message: 'Không thể đổi vai trò' })
    } finally {
      setActionLoading(null)
    }
  }

  const handleCreateTeacher = async () => {
    if (!teacherForm.username || !teacherForm.password || !teacherForm.fullName || !teacherForm.email) {
      setAlert({ type: 'error', message: 'Vui lòng điền đầy đủ thông tin' })
      return
    }
    setCreateLoading(true)
    try {
      await UserService.createTeacher(teacherForm)
      setAlert({ type: 'success', message: `Đã tạo tài khoản giảng viên ${teacherForm.username}` })
      closeCreate()
      setTeacherForm({ username: '', password: '', fullName: '', email: '' })
      fetchUsers()
    } catch {
      setAlert({ type: 'error', message: 'Không thể tạo tài khoản giảng viên' })
    } finally {
      setCreateLoading(false)
    }
  }

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Box p="lg">
      {/* Header */}
      <Group justify="space-between" align="flex-start" mb="lg">
        <Stack gap="xs">
          <Title order={2}>Quản lý người dùng</Title>
          <Text c="dimmed" size="sm">
            Quản lý tài khoản, phân quyền và trạng thái người dùng trong hệ thống.
          </Text>
        </Stack>
        <Button leftSection={<IconPlus size={16} />} onClick={openCreate}>
          Tạo tài khoản giảng viên
        </Button>
      </Group>

      {/* Alert */}
      {alert && (
        <Alert
          color={alert.type === 'success' ? 'green' : 'red'}
          icon={alert.type === 'success' ? <IconCheck size={16} /> : <IconAlertCircle size={16} />}
          mb="md"
          radius="md"
          withCloseButton
          onClose={() => setAlert(null)}
        >
          {alert.message}
        </Alert>
      )}

      {/* Stats */}
      <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }} mb="lg">
        <Card withBorder radius="md" p="md">
          <Group>
            <IconUsers size={24} color="var(--mantine-color-blue-6)" />
            <div>
              <Text size="xs" c="dimmed">Tổng người dùng</Text>
              <Text fw={700} size="lg">{loading ? <Skeleton width={30} height={20} /> : totalItems}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group>
            <IconUserCheck size={24} color="var(--mantine-color-green-6)" />
            <div>
              <Text size="xs" c="dimmed">Đang hoạt động</Text>
              <Text fw={700} size="lg" c="green">{loading ? <Skeleton width={30} height={20} /> : activeCount}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group>
            <IconUserOff size={24} color="var(--mantine-color-red-6)" />
            <div>
              <Text size="xs" c="dimmed">Bị vô hiệu hóa</Text>
              <Text fw={700} size="lg" c="red">{loading ? <Skeleton width={30} height={20} /> : inactiveCount}</Text>
            </div>
          </Group>
        </Card>
        <Card withBorder radius="md" p="md">
          <Group>
            <IconShieldCheck size={24} color="var(--mantine-color-violet-6)" />
            <div>
              <Text size="xs" c="dimmed">Trang hiện tại</Text>
              <Text fw={700} size="lg">{page} / {totalPages || 1}</Text>
            </div>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Filters */}
      <Card withBorder radius="md" mb="lg" p="md">
        <Group>
          <TextInput
            placeholder="Tìm theo tên, email, username..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            data={ROLE_FILTER_OPTIONS}
            value={roleFilter}
            onChange={(v) => setRoleFilter(v || '')}
            placeholder="Lọc vai trò"
            clearable
            w={180}
          />
        </Group>
      </Card>

      {/* Table */}
      <Card withBorder radius="md" p={0}>
        <Table.ScrollContainer minWidth={800}>
          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Username</Table.Th>
                <Table.Th>Họ tên</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th ta="center">Vai trò</Table.Th>
                <Table.Th ta="center">Trạng thái</Table.Th>
                <Table.Th ta="center">Đăng ký qua</Table.Th>
                <Table.Th>Ngày tạo</Table.Th>
                <Table.Th ta="center">Thao tác</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Table.Tr key={i}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <Table.Td key={j}><Skeleton height={16} /></Table.Td>
                    ))}
                  </Table.Tr>
                ))
              ) : users.length === 0 ? (
                <Table.Tr>
                  <Table.Td colSpan={8}>
                    <Text ta="center" c="dimmed" py="xl">Không tìm thấy người dùng nào.</Text>
                  </Table.Td>
                </Table.Tr>
              ) : (
                users.map((user) => {
                  const roleInfo = ROLE_CONFIG[user.role] || ROLE_CONFIG.STUDENT
                  const providerInfo = PROVIDER_CONFIG[user.provider] || PROVIDER_CONFIG.LOCAL
                  const isCurrentAction = actionLoading === user.id

                  return (
                    <Table.Tr key={user.id} style={!user.active ? { opacity: 0.6 } : undefined}>
                      <Table.Td>
                        <Text size="sm" fw={500}>{user.username}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{user.fullName || '—'}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm">{user.email || '—'}</Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Badge variant="light" color={roleInfo.color} size="sm">
                          {roleInfo.label}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Badge
                          variant="dot"
                          color={user.active ? 'green' : 'red'}
                          size="sm"
                        >
                          {user.active ? 'Hoạt động' : 'Vô hiệu'}
                        </Badge>
                      </Table.Td>
                      <Table.Td ta="center">
                        <Badge variant="outline" color={providerInfo.color} size="xs">
                          {providerInfo.label}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="xs" c="dimmed">{user.createdAt}</Text>
                      </Table.Td>
                      <Table.Td ta="center">
                        {isCurrentAction ? (
                          <Loader size="xs" />
                        ) : user.role === 'ADMIN' ? (
                          <Text size="xs" c="dimmed">—</Text>
                        ) : (
                          <Menu shadow="md" width={200} position="bottom-end">
                            <Menu.Target>
                              <ActionIcon variant="subtle" color="gray" size="sm">
                                <IconDotsVertical size={16} />
                              </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                              <Menu.Label>Trạng thái</Menu.Label>
                              <Menu.Item
                                leftSection={user.active ? <IconUserOff size={14} /> : <IconUserCheck size={14} />}
                                color={user.active ? 'red' : 'green'}
                                onClick={() => handleToggleActive(user)}
                              >
                                {user.active ? 'Vô hiệu hóa' : 'Kích hoạt'}
                              </Menu.Item>

                              <Menu.Divider />
                              <Menu.Label>Đổi vai trò</Menu.Label>
                              {user.role !== 'STUDENT' && (
                                <Menu.Item
                                  leftSection={<IconUser size={14} />}
                                  onClick={() => handleChangeRole(user, 'STUDENT')}
                                >
                                  Student
                                </Menu.Item>
                              )}
                              {user.role !== 'TEACHER' && (
                                <Menu.Item
                                  leftSection={<IconUserShield size={14} />}
                                  onClick={() => handleChangeRole(user, 'TEACHER')}
                                >
                                  Teacher
                                </Menu.Item>
                              )}
                            </Menu.Dropdown>
                          </Menu>
                        )}
                      </Table.Td>
                    </Table.Tr>
                  )
                })
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Group justify="center" mt="lg">
          <Pagination
            value={page}
            onChange={setPage}
            total={totalPages}
            size="sm"
          />
        </Group>
      )}

      {/* Create Teacher Modal */}
      <Modal
        opened={createOpened}
        onClose={closeCreate}
        title="Tạo tài khoản giảng viên"
        centered
      >
        <Stack gap="md">
          <TextInput
            label="Username"
            placeholder="Nhập username"
            required
            value={teacherForm.username}
            onChange={(e) => setTeacherForm((prev) => ({ ...prev, username: e.currentTarget.value }))}
          />
          <PasswordInput
            label="Mật khẩu"
            placeholder="Nhập mật khẩu"
            required
            value={teacherForm.password}
            onChange={(e) => setTeacherForm((prev) => ({ ...prev, password: e.currentTarget.value }))}
          />
          <TextInput
            label="Họ và tên"
            placeholder="Nhập họ và tên"
            required
            value={teacherForm.fullName}
            onChange={(e) => setTeacherForm((prev) => ({ ...prev, fullName: e.currentTarget.value }))}
          />
          <TextInput
            label="Email"
            placeholder="Nhập email"
            required
            type="email"
            value={teacherForm.email}
            onChange={(e) => setTeacherForm((prev) => ({ ...prev, email: e.currentTarget.value }))}
          />
          <Group justify="flex-end" mt="sm">
            <Button variant="default" onClick={closeCreate}>Hủy</Button>
            <Button loading={createLoading} onClick={handleCreateTeacher}>Tạo tài khoản</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  )
}

export default AdminUserManagement
