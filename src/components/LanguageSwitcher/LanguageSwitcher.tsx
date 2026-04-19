import { SegmentedControl } from '@mantine/core'
import { setLang, useAppDispatch, useAppSelector } from '@/store'

const FlagImg = ({ code }: { code: string }) => (
  <img
    src={`https://flagcdn.com/20x15/${code}.png`}
    width={20}
    height={15}
    alt={code}
    style={{ display: 'block', borderRadius: 2 }}
  />
)

export default function LanguageSwitcher() {
  const dispatch = useAppDispatch()
  const currentLang = useAppSelector((state) => state.locale.currentLang)

  return (
    <SegmentedControl
      size="xs"
      value={currentLang}
      onChange={(val) => dispatch(setLang(val))}
      data={[
        { label: <FlagImg code="vn" />, value: 'vi' },
        { label: <FlagImg code="gb" />, value: 'en' },
      ]}
    />
  )
}
