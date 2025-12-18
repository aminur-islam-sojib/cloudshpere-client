/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useAuth } from "@/Context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

interface EventFormData {
  title: string;
  description: string;
  location: string;
  clubId: string;
  isPaid: boolean;
  eventFee?: number;
  maxAttendees?: number;
  bannerImage?: string;
  status: "draft" | "published";
  creatorEmail: string;
}

const CreateEvent = () => {
  const [eventDate, setEventDate] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    defaultValues: {
      isPaid: false,
      status: "published",
      clubId: "",
      title: "",
      description: "",
      location: "",
      bannerImage: "",
    },
  });

  /* ================= Fetch Manager Clubs ================= */
  const { data: clubs = [], isLoading } = useQuery({
    queryKey: ["manager-clubs", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/clubs/${user?.email}`);
      return res.data;
    },
  });
  console.log(clubs);

  const isPaid = watch("isPaid");
  const clubId = watch("clubId");

  /* ================= Submit ================= */
  const onSubmit = async (data: EventFormData) => {
    console.log(data);
    if (!eventDate) {
      toast.error("Please select event date");
      return;
    }

    if (!data.clubId) {
      toast.error("Please select a club");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: data.title,
        description: data.description,
        eventDate: new Date(eventDate).toISOString(),
        location: data.location,
        clubId: data.clubId,
        isPaid: data.isPaid,
        eventFee: data.isPaid ? data.eventFee : 0,
        maxAttendees: data.maxAttendees || null,
        bannerImage: data.bannerImage || "",
        status: data.status,
      };

      await axiosSecure.post("/events", payload);

      toast.success("Event created successfully 🎉");
      navigate("/dashboard/manager/events");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  /* ================= UI ================= */
  return (
    <div className="  mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <p className="text-gray-500">Organize an event for your club</p>
      </div>

      <div className="  rounded-lg shadow-md">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span>✨</span>
            Event Information
          </h2>
          <p className="text-gray-600 dark:text-gray-100 text-sm mt-1">
            Fill out the details below to create an event
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Club */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-100">
                Club *
              </label>
              <select
                value={clubId || ""}
                onChange={(e) => setValue("clubId", e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option
                  className=" bg-white dark:bg-black text-black dark:text-white"
                  value=""
                >
                  {isLoading ? "Loading clubs..." : "Select club"}
                </option>
                {Array.isArray(clubs) && clubs.length > 0
                  ? clubs.map((club: any) => (
                      <option
                        key={club._id}
                        value={club._id}
                        className=" bg-white dark:bg-black text-black dark:text-white"
                      >
                        {club.clubName}
                      </option>
                    ))
                  : !isLoading && (
                      <option disabled>
                        No clubs found. Create a club first.
                      </option>
                    )}
              </select>
              {errors.clubId && (
                <p className="text-sm text-red-500">{errors.clubId.message}</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-100 text-gray-700">
                Event Title *
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                placeholder="Enter event title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-100 text-gray-700">
                Description *
              </label>
              <textarea
                rows={4}
                {...register("description", {
                  required: "Description is required",
                })}
                placeholder="Describe your event"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-100 text-gray-700">
                Event Date *
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={today}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-100 text-gray-700">
                Location *
              </label>
              <input
                type="text"
                {...register("location", {
                  required: "Location is required",
                })}
                placeholder="Enter event location"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.location && (
                <p className="text-sm text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Paid / Free */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-100 text-gray-700">
                Event Type *
              </label>
              <select
                value={isPaid ? "paid" : "free"}
                onChange={(e) => setValue("isPaid", e.target.value === "paid")}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
            </div>

            {/* Event Fee */}
            {isPaid && (
              <div className="space-y-2">
                <label className="block text-sm font-medium dark:text-gray-100 text-gray-700">
                  Event Fee *
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter fee amount"
                  {...register("eventFee", {
                    required: isPaid ? "Event fee is required" : false,
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: "Fee must be at least 1",
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.eventFee && (
                  <p className="text-sm text-red-500">
                    {errors.eventFee.message}
                  </p>
                )}
              </div>
            )}

            {/* Max Attendees */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-100 text-gray-700">
                Max Attendees (Optional)
              </label>
              <input
                type="number"
                min="1"
                placeholder="Leave empty for unlimited"
                {...register("maxAttendees", {
                  valueAsNumber: true,
                  min: {
                    value: 1,
                    message: "Must be at least 1",
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.maxAttendees && (
                <p className="text-sm text-red-500">
                  {errors.maxAttendees.message}
                </p>
              )}
            </div>

            {/* Banner */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-100 text-gray-700">
                Banner Image URL (Optional)
              </label>
              <input
                type="text"
                {...register("bannerImage")}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-medium dark:text-gray-100 text-gray-700">
                Status *
              </label>
              <select
                value={watch("status")}
                onChange={(e) =>
                  setValue("status", e.target.value as "draft" | "published")
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option
                  value="published"
                  className=" bg-white dark:bg-black text-black dark:text-white"
                >
                  Published
                </option>
                <option
                  className=" bg-white dark:bg-black text-black dark:text-white"
                  value="draft"
                >
                  Draft
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || (!isLoading && clubs.length === 0)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Creating..." : "Create Event"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
