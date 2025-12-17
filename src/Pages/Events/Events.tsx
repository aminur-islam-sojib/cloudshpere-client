import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "@/Hooks/axiosPublic";
import {
  MapPin,
  CalendarDays,
  ArrowRight,
  Users,
  DollarSign,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import CreateEventButton from "./CreateEventButton";

type Event = {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  fee?: number;
  capacity?: number;
  clubId?: string;
  clubName?: string;
  createdAt: string;
};

const Events: React.FC = () => {
  const { data: eventsData } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/events");
      return res.data;
    },
  });

  const events = eventsData?.events || [];
  const navigate = useNavigate();

  const handleDetailsButton = (id: string) => {
    navigate(`/events/${id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="max-w-6xl mx-auto  ">
      <div className=" text-center flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white ">
          Upcoming Events
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover and join exciting events organized by our clubs
        </p>
        <CreateEventButton />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event: Event) => (
          <Card
            key={event._id}
            className="group shadow-lg hover:shadow-2xl transition-transform rounded-2xl overflow-hidden border border-gray-100 bg-white hover:-translate-y-1"
          >
            <div className="relative h-44 w-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <div className="text-center text-white">
                <CalendarDays size={48} className="mx-auto mb-2 opacity-80" />
                <div className="text-sm font-medium">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            <CardHeader className="pt-4 pb-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-lg font-semibold leading-tight">
                    {event.title}
                  </CardTitle>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {event.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Event Date</div>
                  <div className="text-sm font-medium">
                    {formatDate(event.date)}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-2 pb-4">
              <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span className="truncate">
                    {event.location || "Location not set"}
                  </span>
                </div>

                {event.clubName && (
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span className="truncate">
                      Organized by: {event.clubName}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <DollarSign size={16} />
                  <span>
                    {event.fee && event.fee > 0 ? `$${event.fee}` : "Free"}
                  </span>
                </div>

                {event.capacity && (
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>Capacity: {event.capacity}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Link to={`/events/${event._id}`} className="w-1/2">
                  <Button
                    variant="outline"
                    className="w-full rounded-xl flex items-center justify-center gap-2"
                  >
                    Details <ArrowRight size={16} />
                  </Button>
                </Link>

                <Button
                  onClick={() => handleDetailsButton(event._id)}
                  className="w-1/2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:scale-[1.02]"
                >
                  Register
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-12 flex flex-col gap-2">
          <CalendarDays size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white  ">
            No events found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Check back later for upcoming events
          </p>
        </div>
      )}
    </div>
  );
};

export default Events;
