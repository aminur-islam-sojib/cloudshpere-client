import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import CreateEventButton from "./CreateEventButton";
import EventCard from "./EventCard";

export type EventStatus = "approved" | "published" | "cancelled";

export interface EventType {
  _id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  clubId: string;
  isPaid: boolean;
  eventFee: number;
  maxAttendees: number | null;
  bannerImage: string;
  status: EventStatus;
  createdAt: string;
}

const EventsTest = () => {
  const { id } = useParams();

  const { data: clubEvents = [], isLoading } = useQuery<EventType[]>({
    queryKey: ["club-events", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosSecure.get<EventType[]>(`/club-events/${id}`);
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Club Events
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage and view all events created for this club
          </p>
        </div>

        <CreateEventButton />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : clubEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700 py-16 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            No events yet
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create your first event to engage club members.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsTest;
