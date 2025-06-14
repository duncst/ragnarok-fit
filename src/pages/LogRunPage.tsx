
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Save } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const runTypes = [
  "Easy Run", "Tempo Run", "Interval Training", "Long Run",
  "Recovery Run", "Fartlek", "Hill Training", "Race",
];

const logRunFormSchema = z.object({
  distance: z.coerce.number().positive({ message: "Distance must be a positive number." }),
  duration: z.object({
    hours: z.coerce.number().int().min(0).optional(),
    minutes: z.coerce.number().int().min(0).max(59).optional(),
    seconds: z.coerce.number().int().min(0).max(59).optional(),
  }).refine(data => (data.hours || 0) > 0 || (data.minutes || 0) > 0 || (data.seconds || 0) > 0, {
    message: "Total duration must be greater than zero.",
    path: ["hours"],
  }),
  runType: z.string({ required_error: "Please select a run type." }),
  date: z.date({ required_error: "Please select a date." }),
  notes: z.string().optional(),
});

type LogRunFormValues = z.infer<typeof logRunFormSchema>;

const LogRunPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<LogRunFormValues>({
    resolver: zodResolver(logRunFormSchema),
    defaultValues: {
      distance: undefined,
      duration: { hours: undefined, minutes: undefined, seconds: undefined },
      runType: runTypes[0],
      date: new Date(),
      notes: "",
    },
  });

  function onSubmit(data: LogRunFormValues) {
    const totalSeconds = (data.duration.hours || 0) * 3600 + (data.duration.minutes || 0) * 60 + (data.duration.seconds || 0);
    const runData = {
        ...data,
        id: new Date().toISOString(),
        duration: totalSeconds,
    };
    console.log("Logged Run:", runData);
    toast({
      title: "Run Logged!",
      description: `Your ${data.distance}km ${data.runType} has been saved.`,
    });
    navigate("/run");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Log a Past Run</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distance (km)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g. 5.2" {...field} step="0.1" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={() => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="duration.hours"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="Hours" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration.minutes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="Mins" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration.seconds"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input type="number" placeholder="Secs" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <FormMessage>
                  {form.formState.errors.duration?.hours?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Run</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="runType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Run Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a run type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {runTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes (optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="How did it feel? Any PBs?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-4">
            <Button type="submit" size="lg" className="flex-1"><Save /> Save Run</Button>
            <Button type="button" size="lg" variant="outline" onClick={() => navigate(-1)} className="flex-1">Cancel</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LogRunPage;
