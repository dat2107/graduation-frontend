import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Alert,
  Anchor,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import {
  IconAlertCircle,
  IconArrowLeft,
  IconCheck,
  IconMail,
} from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'
import useAuth from '@/utils/hooks/useAuth'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const { forgotPassword } = useAuth()
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(t('auth.forgotPassword.validation.emailRequired'))
      .email(t('auth.forgotPassword.validation.emailInvalid')),
  })

  const form = useForm({
    initialValues: { email: '' },
    validate: yupResolver(schema),
    validateInputOnBlur: true,
  })

  const handleSubmit = async (values: typeof form.values) => {
    setSubmitting(true)
    setMessage(null)
    const result = await forgotPassword({ email: values.email })
    setSubmitting(false)

    if (result.code === '0') {
      setMessage({ type: 'success', text: result.message })
      form.reset()
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  return (
    <Paper radius="xl" p="xl" withBorder shadow="xs">
      <Stack gap="xs" mb="xl">
        <Title order={2}>{t('auth.forgotPassword.title')}</Title>
        <Text size="sm" c="dimmed">
          {t('auth.forgotPassword.subtitle')}
        </Text>
      </Stack>

      {message && (
        <Alert
          color={message.type === 'success' ? 'green' : 'red'}
          icon={
            message.type === 'success' ? (
              <IconCheck size={16} />
            ) : (
              <IconAlertCircle size={16} />
            )
          }
          mb="md"
          radius="md"
        >
          {message.text}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <TextInput
            label={t('auth.forgotPassword.email')}
            placeholder={t('auth.forgotPassword.emailPlaceholder')}
            leftSection={<IconMail size={16} />}
            required
            {...form.getInputProps('email')}
          />

          <Button type="submit" fullWidth radius="md" loading={submitting}>
            {t('auth.forgotPassword.submit')}
          </Button>
        </Stack>
      </form>

      <Group justify="center" mt="lg">
        <Anchor component={Link} to="/sign-in" size="sm" c="dimmed">
          <Group gap={4}>
            <IconArrowLeft size={14} />
            {t('auth.forgotPassword.backToSignIn')}
          </Group>
        </Anchor>
      </Group>
    </Paper>
  )
}
