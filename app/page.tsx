"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { Clock } from "lucide-react";
import { TimeUnit, convertToSeconds, convertFromSeconds, parseTimeInput } from "@/lib/time-utils";

const timeSchema = z.object({
  firstDay: z.string().regex(/^\d*$/, "Must be a number").optional(),
  firstHour: z.string().regex(/^\d*$/, "Must be a number").optional(),
  firstMinute: z.string().regex(/^\d*$/, "Must be a number").optional(),
  firstSecond: z.string().regex(/^\d*$/, "Must be a number").optional(),
  secondDay: z.string().regex(/^\d*$/, "Must be a number").optional(),
  secondHour: z.string().regex(/^\d*$/, "Must be a number").optional(),
  secondMinute: z.string().regex(/^\d*$/, "Must be a number").optional(),
  secondSecond: z.string().regex(/^\d*$/, "Must be a number").optional(),
  operation: z.enum(["add", "subtract"])
});

export default function Home() {
  const [result, setResult] = useState<TimeUnit>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const form = useForm<z.infer<typeof timeSchema>>({
    resolver: zodResolver(timeSchema),
    defaultValues: {
      operation: "add",
      firstDay: "",
      firstHour: "",
      firstMinute: "",
      firstSecond: "",
      secondDay: "",
      secondHour: "",
      secondMinute: "",
      secondSecond: ""
    },
  });

  function calculateTime(values: z.infer<typeof timeSchema>) {
    const first: TimeUnit = {
      days: parseTimeInput(values.firstDay),
      hours: parseTimeInput(values.firstHour),
      minutes: parseTimeInput(values.firstMinute),
      seconds: parseTimeInput(values.firstSecond)
    };

    const second: TimeUnit = {
      days: parseTimeInput(values.secondDay),
      hours: parseTimeInput(values.secondHour),
      minutes: parseTimeInput(values.secondMinute),
      seconds: parseTimeInput(values.secondSecond)
    };

    const firstSeconds = convertToSeconds(first);
    const secondSeconds = convertToSeconds(second);
    
    const totalSeconds = values.operation === "add" 
      ? firstSeconds + secondSeconds 
      : firstSeconds - secondSeconds;

    setResult(convertFromSeconds(totalSeconds));
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-primary" />
            <CardTitle className="text-2xl font-bold">Time Calculator</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(calculateTime)} className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <Label>Day</Label>
              <Label>Hour</Label>
              <Label>Minute</Label>
              <Label>Second</Label>
              
              <Input {...form.register("firstDay")} placeholder="0" />
              <Input {...form.register("firstHour")} placeholder="0" />
              <Input {...form.register("firstMinute")} placeholder="0" />
              <Input {...form.register("firstSecond")} placeholder="0" />
            </div>

            <div className="flex justify-center">
              <RadioGroup
                defaultValue="add"
                onValueChange={(value) => form.setValue("operation", value as "add" | "subtract")}
                className="flex justify-center gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="add" id="add" />
                  <Label htmlFor="add">Add</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="subtract" id="subtract" />
                  <Label htmlFor="subtract">Subtract</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <Input {...form.register("secondDay")} placeholder="0" />
              <Input {...form.register("secondHour")} placeholder="0" />
              <Input {...form.register("secondMinute")} placeholder="0" />
              <Input {...form.register("secondSecond")} placeholder="0" />
            </div>

            <div className="flex gap-4 justify-center">
              <Button type="submit" size="lg">
                Calculate
              </Button>
              <Button 
                type="button" 
                variant="outline"
                size="lg"
                onClick={() => {
                  form.reset();
                  setResult({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                }}
              >
                Clear
              </Button>
            </div>

            <Card className="bg-primary/5">
              <CardContent className="pt-6">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <Label>Days</Label>
                    <p className="text-2xl font-bold mt-1">{result.days}</p>
                  </div>
                  <div>
                    <Label>Hours</Label>
                    <p className="text-2xl font-bold mt-1">{result.hours}</p>
                  </div>
                  <div>
                    <Label>Minutes</Label>
                    <p className="text-2xl font-bold mt-1">{result.minutes}</p>
                  </div>
                  <div>
                    <Label>Seconds</Label>
                    <p className="text-2xl font-bold mt-1">{result.seconds}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}