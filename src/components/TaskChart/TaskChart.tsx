import type { ReactNode } from 'react'
import { BarChart, LineChart, PieChart } from '@mantine/charts'
import { Box, Group, Paper, SimpleGrid, Stack, Table, Text } from '@mantine/core'

/**
 * TaskChart — renders the structured data embedded in an IELTS Writing Task 1
 * `promptText` as a real chart (line / bar / pie / table).
 *
 * It is a best-effort parser: when the text does not match a known pattern it
 * returns `null`, so the caller can simply fall back to showing the raw text.
 * The chart is meant to sit ABOVE the original prompt text, not replace it.
 */

const PALETTE = [
  'blue.6',
  'teal.6',
  'grape.6',
  'orange.6',
  'red.6',
  'cyan.6',
  'lime.6',
  'pink.6',
]

type ChartKind = 'line' | 'bar' | 'pie' | 'table' | null

interface DataPoint {
  label: string
  value: number
}

interface DataRow {
  key: string
  points: DataPoint[]
}

// Matches a single `label (12.3%)` / `label (1,076,000)` token.
const POINT_RE = /([^(,]+?)\s*\(\s*([\d.,]+)\s*%?\s*\)/g

/** Decide which chart type to draw based on the prose in the prompt. */
const detectKind = (text: string): ChartKind => {
  const t = text.toLowerCase()
  if (t.includes('pie chart')) return 'pie'
  if (t.includes('bar chart') || t.includes('bar graph')) return 'bar'
  if (t.includes('line graph') || t.includes('line chart') || /\bgraph\b/.test(t)) return 'line'
  if (t.includes('table')) return 'table'
  return null
}

/**
 * Remove the raw data lines from a prompt once they are shown as a chart,
 * keeping only the prose (intro + instruction). Returns the original text
 * untouched when no chart can be drawn from it.
 */
export const stripChartData = (text: string): string => {
  const kind = detectKind(text)
  if (!kind) return text
  const kept = text.split('\n').filter((raw) => {
    const line = raw.trim()
    if (!line) return true
    if (kind === 'table') {
      // Drop whitespace-aligned table rows (>= 2 columns); keep prose sentences.
      return line.split(/\s{2,}/).map((c) => c.trim()).filter(Boolean).length < 2
    }
    // Drop `Key: label (number)` data lines; keep everything else.
    const colon = line.indexOf(':')
    if (colon >= 0) {
      POINT_RE.lastIndex = 0
      if (POINT_RE.test(line.slice(colon + 1))) return false
    }
    return true
  })
  return kept.join('\n').replace(/\n{3,}/g, '\n\n').trim()
}

/** Parse `Key: a (1%), b (2%)` data lines into structured rows. */
const parseRows = (text: string): DataRow[] => {
  const rows: DataRow[] = []
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    const colon = line.indexOf(':')
    if (colon < 0) continue
    const key = line.slice(0, colon).trim()
    const rest = line.slice(colon + 1)
    const points: DataPoint[] = []
    POINT_RE.lastIndex = 0
    let m: RegExpExecArray | null
    // eslint-disable-next-line no-cond-assign
    while ((m = POINT_RE.exec(rest)) !== null) {
      const value = parseFloat(m[2].replace(/,/g, ''))
      if (!Number.isNaN(value)) points.push({ label: m[1].trim(), value })
    }
    if (key && points.length > 0) rows.push({ key, points })
  }
  return rows
}

/** Build BarChart/LineChart `data` + `series` from rows (each row = one series). */
const buildSeries = (rows: DataRow[]) => {
  const axisLabels: string[] = []
  rows.forEach((r) =>
    r.points.forEach((p) => {
      if (!axisLabels.includes(p.label)) axisLabels.push(p.label)
    }),
  )
  const data = axisLabels.map((label) => {
    const obj: Record<string, string | number> = { axis: label }
    rows.forEach((r) => {
      const pt = r.points.find((p) => p.label === label)
      if (pt) obj[r.key] = pt.value
    })
    return obj
  })
  const series = rows.map((r, i) => ({ name: r.key, color: PALETTE[i % PALETTE.length] }))
  return { data, series }
}

/** Parse a whitespace-aligned table block into header + body cells. */
const parseTable = (text: string): string[][] | null => {
  const rows = text
    .split('\n')
    .map((l) => l.replace(/\s+$/, ''))
    .filter((l) => l.trim())
    .map((l) => l.split(/\s{2,}/).map((c) => c.trim()).filter(Boolean))
    // A tabular row has at least 2 columns; prose sentences collapse to 1.
    .filter((cells) => cells.length >= 2)
  if (rows.length < 2) return null
  const maxCols = Math.max(...rows.map((r) => r.length))
  // Left-pad short rows (typically the header, which omits the row-label column).
  return rows.map((r) => [...Array(maxCols - r.length).fill(''), ...r])
}

interface TaskChartProps {
  promptText: string
}

const ChartFrame = ({ children }: { children: ReactNode }) => (
  <Paper withBorder p="lg" radius="md">
    <Text size="sm" fw={600} mb="md" c="dimmed">
      Biểu đồ minh họa
    </Text>
    {children}
  </Paper>
)

const TaskChart = ({ promptText }: TaskChartProps) => {
  const kind = detectKind(promptText)
  if (!kind) return null

  const hasPercent = promptText.includes('%')
  const unit = hasPercent ? '%' : undefined

  // ── Table ──────────────────────────────────────────────────────────────────
  if (kind === 'table') {
    const cells = parseTable(promptText)
    if (!cells) return null
    const [head, ...body] = cells
    return (
      <ChartFrame>
        <Table.ScrollContainer minWidth={320}>
          <Table striped withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                {head.map((h, i) => (
                  <Table.Th key={i} ta={i === 0 ? 'left' : 'right'}>
                    {h}
                  </Table.Th>
                ))}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {body.map((row, ri) => (
                <Table.Tr key={ri}>
                  {row.map((c, ci) => (
                    <Table.Td key={ci} ta={ci === 0 ? 'left' : 'right'} fw={ci === 0 ? 500 : undefined}>
                      {c}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </ChartFrame>
    )
  }

  const rows = parseRows(promptText)
  if (rows.length === 0) return null

  // ── Pie ────────────────────────────────────────────────────────────────────
  if (kind === 'pie') {
    // Each row is a separate pie (e.g. one for 2000, one for 2020).
    // Categories are shared across rows → build a single shared legend.
    const legend = rows[0].points.map((p, i) => ({
      label: p.label,
      color: PALETTE[i % PALETTE.length],
    }))
    return (
      <ChartFrame>
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, xs: Math.min(rows.length, 2) }} spacing="lg">
            {rows.map((r) => (
              <Stack key={r.key} align="center" gap="xs">
                <Text fw={600} size="sm">
                  {r.key}
                </Text>
                <PieChart
                  size={170}
                  withTooltip
                  tooltipDataSource="segment"
                  data={r.points.map((p, i) => ({
                    name: p.label,
                    value: p.value,
                    color: PALETTE[i % PALETTE.length],
                  }))}
                />
              </Stack>
            ))}
          </SimpleGrid>
          <Group justify="center" gap="md">
            {legend.map((l) => (
              <Group key={l.label} gap={6} wrap="nowrap">
                <Box w={12} h={12} style={{ borderRadius: 3, background: `var(--mantine-color-${l.color.replace('.', '-')})` }} />
                <Text size="xs">{l.label}</Text>
              </Group>
            ))}
          </Group>
        </Stack>
      </ChartFrame>
    )
  }

  // ── Line / Bar ─────────────────────────────────────────────────────────────
  const { data, series } = buildSeries(rows)
  if (data.length === 0) return null
  return (
    <ChartFrame>
      {kind === 'bar' ? (
        <BarChart h={300} data={data} dataKey="axis" series={series} unit={unit} withLegend tickLine="y" />
      ) : (
        <LineChart h={300} data={data} dataKey="axis" series={series} unit={unit} withLegend curveType="linear" />
      )}
    </ChartFrame>
  )
}

export default TaskChart
