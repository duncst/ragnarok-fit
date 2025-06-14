
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { day: "Mon", volume: 5800 },
  { day: "Tue", volume: 7200 },
  { day: "Wed", volume: 6200 },
  { day: "Thu", volume: 0 },
  { day: "Fri", volume: 7800 },
  { day: "Sat", volume: 6500 },
  { day: "Sun", volume: 0 },
]

const chartConfig = {
  volume: {
    label: "Volume",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function StrengthChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
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
