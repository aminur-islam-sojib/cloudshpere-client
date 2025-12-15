/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useAuth } from "@/Context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface EventFormData {
  title: string;
  description: string;
  date: Date;
  location: string;
  fee: number;
  capacity: number;
  clubId: string;
}

const CreateEvent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventFormData>();

  // Fetch manager's clubs
  const { data: clubs = [] } = useQuery({
    queryKey: ["manager-clubs", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const selectedClubId = watch("clubId");

  const onSubmit = async (data: EventFormData) => {
    if (!date) {
      toast.error("Please select an event date");
      return;
    }

    if (!selectedClubId) {
      toast.error("Please select a club for this event");
      return;
    }

    setIsSubmitting(true);

    try {
      const eventData = {
        title: data.title,
        description: data.description,
        date: date.toISOString(),
        location: data.location,
        fee: data.fee || 0,
        capacity: data.capacity || 0,
        clubId: selectedClubId,
      };

      const res = await axiosSecure.post("/api/events", eventData);

      if (res.status === 200) {
        toast.success("Event created successfully!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Create New Event
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Organize an event for your club members
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Event Details
          </CardTitle>
          <CardDescription>
            Fill in the information for your new event
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Event Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title *</Label>
              <Input
                id="title"
                placeholder="Enter event title"
                {...register("title", { required: "Event title is required" })}
                className={cn(errors.title && "border-red-500")}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your event..."
                rows={4}
                {...register("description", {
                  required: "Description is required",
                })}
                className={cn(errors.description && "border-red-500")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Club Selection */}
            <div className="space-y-2">
              <Label>Club *</Label>
              <Select onValueChange={(value) => setValue("clubId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a club for this event" />
                </SelectTrigger>
                <SelectContent>
                  {clubs.map((club: any) => (
                    <SelectItem key={club._id} value={club._id}>
                      {club.clubName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {clubs.length === 0 && (
                <p className="text-sm text-gray-500">
                  You need to create a club first before creating events
                </p>
              )}
            </div>

            {/* Date and Location Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event Date */}
              <div className="space-y-2">
                <Label>Event Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="Event location"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className={cn(errors.location && "border-red-500")}
                />
                {errors.location && (
                  <p className="text-sm text-red-500">
                    {errors.location.message}
                  </p>
                )}
              </div>
            </div>

            {/* Fee and Capacity Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Registration Fee */}
              <div className="space-y-2">
                <Label htmlFor="fee">Registration Fee ($)</Label>
                <Input
                  id="fee"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  {...register("fee", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Fee cannot be negative" },
                  })}
                  className={cn(errors.fee && "border-red-500")}
                />
                {errors.fee && (
                  <p className="text-sm text-red-500">{errors.fee.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Leave empty for free events
                </p>
              </div>

              {/* Capacity */}
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  placeholder="Unlimited"
                  min="1"
                  {...register("capacity", {
                    valueAsNumber: true,
                    min: { value: 1, message: "Capacity must be at least 1" },
                  })}
                  className={cn(errors.capacity && "border-red-500")}
                />
                {errors.capacity && (
                  <p className="text-sm text-red-500">
                    {errors.capacity.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Leave empty for unlimited capacity
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || clubs.length === 0}
              className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:scale-[1.02]"
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </Button>

            {clubs.length === 0 && (
              <p className="text-sm text-center text-gray-500">
                You must have at least one approved club to create events
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateEvent;
