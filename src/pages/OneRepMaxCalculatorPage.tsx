
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calculator } from "lucide-react";

const formSchema = z.object({
  weight: z.coerce.number().positive({ message: "Weight must be a positive number." }),
  reps: z.coerce.number().int().min(1, { message: "Reps must be at least 1." }).max(12, { message: "Reps should be 12 or less for accurate prediction." }),
});

const OneRepMaxCalculatorPage = () => {
  const [oneRepMax, setOneRepMax] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      weight: undefined,
      reps: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Epley formula: 1RM = weight * (1 + reps / 30)
    const { weight, reps } = values;
    if (reps === 1) {
      setOneRepMax(weight);
      return;
    }
    const calculated1RM = weight * (1 + reps / 30);
    setOneRepMax(calculated1RM);
  };

  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Calculator /> 1 Rep Max Calculator</h1>
        <Card>
            <CardHeader>
            <CardTitle>Estimate your 1RM</CardTitle>
            <CardDescription>
                Enter the weight you lifted and the number of reps to calculate your estimated one-rep max.
            </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                        <Input 
                            type="number" 
                            step="0.01"
                            placeholder="e.g. 80" 
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reps"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Repetitions</FormLabel>
                        <FormControl>
                        <Input 
                            type="number" 
                            placeholder="e.g. 5" 
                            {...field}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <Button type="submit" className="w-full">Calculate</Button>
                </form>
            </Form>

            {oneRepMax !== null && (
                <div className="mt-8 text-center bg-secondary rounded-lg p-6">
                <p className="text-muted-foreground">Estimated 1 Rep Max</p>
                <p className="text-4xl font-bold tracking-tighter">
                    {oneRepMax.toFixed(1)} kg
                </p>
                </div>
            )}
            </CardContent>
        </Card>
    </div>
  );
};

export default OneRepMaxCalculatorPage;
