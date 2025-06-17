
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  volume: {
    label: "Volume (kg)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function StrengthChart({ data }: { data: {day: string, volume: number}[] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Bar dataKey="volume" fill="var(--color-volume)" radius={8} />
      </BarChart>
    </ChartContainer>
  )
}
