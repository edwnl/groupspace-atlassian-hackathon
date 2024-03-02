import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import ScheduleSelector from "react-schedule-selector";
import { addDays, startOfWeek, isMonday } from "date-fns";
import { useState } from "react";

interface ScheduleState {
  schedule: Date[];
}

interface Schedule {
  [day: string]: string[];
}

function ProfileSetup() {
  const FormComponent = () => {
    const [studentSchedule, setSchedule] = useState<ScheduleState>({ schedule: [] });
    const [showSelector, setSelector] = useState<boolean>(false);

    // Calculate the start date to be the next Monday
    const today = new Date();
    const startDate = isMonday(today) ? today : addDays(startOfWeek(today, { weekStartsOn: 1 }), 0);
    function formatTime(date: Date) {
      return `${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
    }

    function groupByDay(schedule: Date[]) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return schedule.reduce((acc: Schedule, time: Date) => {
        const day = days[time.getDay()];
        const formattedTime = formatTime(time);
        if (!acc[day]) {
          acc[day] = [];
        }
        acc[day].push(formattedTime);
        return acc;
      }, {});
    }

    // Availability changer
    const handleChange = (updatedSchedule: Date[]) => {
      setSchedule({ schedule: updatedSchedule });
      const groupedSchedule = groupByDay(studentSchedule.schedule);
      console.log(groupedSchedule);
    };

    const formSchema = z.object({
      studentName: z.string().min(2, {
        message: "Please enter a valid name.",
      }),
      studentGoal: z.string().min(2, {
        message: "Please enter a valid goal",
      }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        studentName: "",
        studentGoal: "",
      },
    });

    // Submit handler
    function onSubmit(values: z.infer<typeof formSchema>) {
      if (studentSchedule.schedule.length === 0) {
        alert("Please select your availabilties.");
      } else {
        console.log(values);
      }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={`${showSelector ? "invisible" : "visible"}`}>
          <FormField
            control={form.control}
            name="studentName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className="w-5/6 border-none bg-gray-200" placeholder="" {...field} />
                </FormControl>
                <FormMessage className="absolute" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="studentGoal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal (H1, H2...)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-5/6 border-none bg-gray-200">
                      <SelectValue className="text-sm" placeholder="Select a goal." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="z-10 bg-white">
                    <SelectItem className="hover:cursor-pointer" value="H1">H1</SelectItem>
                    <SelectItem className="hover:cursor-pointer" value="H2">H2</SelectItem>
                    <SelectItem className="hover:cursor-pointer" value="H3">H3</SelectItem>
                    <SelectItem className="hover:cursor-pointer" value="Pass">Pass</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="absolute"/>
              </FormItem>
            )}
          />
          {/* Can't use buttons as it interferes with form*/}
          <a
            className="z-0 mt-16 flex w-fit items-center gap-2 rounded bg-black px-4 py-2 text-sm text-white hover:cursor-pointer"
            onClick={() => setSelector(true)}
          >
            Select Availability
            <CalendarIcon />
          </a>
          <Button
            className="mt-24 w-fit rounded bg-indigo-500 text-white hover:bg-indigo-500"
            type="submit"
          >
            Continue
          </Button>
        </form>
        {showSelector ? (
            <div className="max-h-1/4 absolute top-[17%] flex w-2/5 flex-col items-center bg-white">
              <ScheduleSelector
                selection={studentSchedule.schedule}
                numDays={7}
                minTime={8}
                maxTime={25}
                hourlyChunks={1}
                dateFormat={"ddd"}
                startDate={startDate}
                onChange={handleChange}
                hoveredColor={"rgba(165, 180, 252, 1)"}
                selectedColor={"rgba(99, 102, 241, 1)"}
                unselectedColor={"rgba(224, 231, 255,1)"}
              />
              <a
                className="ml-24 mt-5 w-fit rounded bg-black px-4 py-2 text-base text-white hover:cursor-pointer"
                onClick={() => setSelector(false)}
              >
                Save Availability
              </a>
            </div>
          ) : (
            <></>
          )}
      </Form>
    );
  };

  return (
    <div className="mx-auto flex h-screen max-w-screen-lg items-center justify-between">
      <div className="h-4/6 w-2/5 bg-gray-200"></div>
      <div className="flex h-4/6 flex-col justify-center text-6xl font-bold">
        <h2>Set up your profile</h2>
        <FormComponent />
      </div>
    </div>
  );
}

export default ProfileSetup;
