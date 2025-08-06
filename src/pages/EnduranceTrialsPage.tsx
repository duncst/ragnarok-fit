import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Wind, Clock3, Activity, Timer } from "lucide-react";

interface TemplateCfg {
  name: string;
  intervals: number;
  intervalMin: number;
  restMin: number;
  warmupMin: number;
}

const QUICK_TEMPLATES: TemplateCfg[] = [
  { name: "VO2 Max Builder", intervals: 5, intervalMin: 4, restMin: 3, warmupMin: 5 },
  { name: "Short Bursts", intervals: 8, intervalMin: 2.5, restMin: 1.5, warmupMin: 5 },
  { name: "Power Intervals", intervals: 4, intervalMin: 5, restMin: 3, warmupMin: 5 },
  { name: "Endurance Test", intervals: 6, intervalMin: 6, restMin: 2.5, warmupMin: 5 },
];

const toMinSec = (mins: number) => {
  const totalSec = Math.round(mins * 60);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};

const EnduranceTrialsPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [warmup, setWarmup] = useState(5);
  const [interval, setInterval] = useState(4);
  const [rest, setRest] = useState(2);
  const [count, setCount] = useState(5);

  const totalDurationMin = useMemo(() => warmup + count * interval + Math.max(0, (count - 1)) * rest, [warmup, interval, rest, count]);

  const applyTemplate = (t: TemplateCfg) => {
    setName(t.name);
    setWarmup(t.warmupMin);
    setInterval(t.intervalMin);
    setRest(t.restMin);
    setCount(t.intervals);
  };

  const begin = () => {
    navigate("/endure/session", {
      state: {
        session: {
          name: name || "Custom Valhalla Trial",
          warmupMin: warmup,
          intervalMin: interval,
          restMin: rest,
          intervals: count,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ArrowLeft className="opacity-60" onClick={() => navigate(-1)} role="button" />
        <div className="flex items-center gap-2 text-xl font-semibold">
          <Wind className="text-primary" />
          Valhalla Trials
        </div>
      </div>

      <Card>
        <CardContent className="p-5 space-y-3">
          <Label htmlFor="name">Name this Trial</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter session name..." />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="text-sm text-muted-foreground">Quick Templates</div>
          <div className="grid grid-cols-2 gap-3">
            {QUICK_TEMPLATES.map((t) => (
              <button key={t.name} className="rounded-md border bg-background/40 p-3 text-left hover:bg-accent transition" onClick={() => applyTemplate(t)}>
                <div className="font-medium">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.intervals}× {toMinSec(t.intervalMin)} / {toMinSec(t.restMin)} rest</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-5">
          <div className="text-base font-semibold">Custom Configuration</div>
          <div className="space-y-3">
            <Label className="flex items-center gap-2"><Clock3 className="h-4 w-4"/>Warmup Duration</Label>
            <div className="flex items-center gap-3">
              <div className="w-24 text-right tabular-nums">{toMinSec(warmup)}</div>
              <Slider min={0} max={20} step={0.5} value={[warmup]} onValueChange={(v)=>setWarmup(v[0])} />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2"><Activity className="h-4 w-4"/>Interval Duration</Label>
            <div className="flex items-center gap-3">
              <div className="w-24 text-right tabular-nums">{toMinSec(interval)}</div>
              <Slider min={0.5} max={10} step={0.5} value={[interval]} onValueChange={(v)=>setInterval(v[0])} />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="flex items-center gap-2"><Timer className="h-4 w-4"/>Rest Duration</Label>
            <div className="flex items-center gap-3">
              <div className="w-24 text-right tabular-nums">{toMinSec(rest)}</div>
              <Slider min={0.5} max={6} step={0.5} value={[rest]} onValueChange={(v)=>setRest(v[0])} />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Number of Intervals</Label>
            <div className="flex items-center gap-3">
              <div className="w-24 text-right tabular-nums">{count}</div>
              <Slider min={1} max={12} step={1} value={[count]} onValueChange={(v)=>setCount(v[0])} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 space-y-2">
          <div className="text-sm text-muted-foreground">Session Summary</div>
          <div className="flex justify-between text-sm"><span>Warmup</span><span>{toMinSec(warmup)}</span></div>
          <div className="flex justify-between text-sm"><span>Intervals</span><span>{count}× {toMinSec(interval)}</span></div>
          <div className="flex justify-between text-sm"><span>Rest Periods</span><span>{Math.max(0, count-1)}× {toMinSec(rest)}</span></div>
          <Separator className="my-2" />
          <div className="flex justify-between font-semibold"><span>Total Duration</span><span>{Math.round(totalDurationMin)}m</span></div>
        </CardContent>
      </Card>

      <Button className="w-full h-12 text-lg" onClick={begin}>
        Begin Valhalla Trial
      </Button>
    </div>
  );
};

export default EnduranceTrialsPage;
