
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"

const chartData = [
  { day: "Mon", distance: 4.5 },
  { day: "Tue", distance: 0 },
  { day: "Wed", distance: 8 },
  { day: "Thu", distance: 2 },
  { day: "Fri", distance: 0 },
  { day: "Sat", distance: 12.5 },
  { day: "Sun", distance: 6 },
]

const chartConfig = {
  distance: {
    label: "Distance",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function RunChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ top: 20 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <defs>
          <linearGradient id="fillDistance" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-distance)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-distance)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="distance"
          type="natural"
          fill="url(#fillDistance)"
          fillOpacity={0.4}
          stroke="var(--color-distance)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}
