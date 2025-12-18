import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Link } from "react-router";
import type { EventStatus } from "./Events_text";

type EventsType = {
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
};

type EventsProps = {
  event: EventsType;
};

const EventCard = ({ event }: EventsProps) => {
  const {
    bannerImage,
    title,
    description,
    eventDate,
    location,
    maxAttendees,
    eventFee,
    isPaid,
    status,
  } = event;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg dark:shadow-gray-800">
      {/* Banner */}
      <div className="h-44 w-full overflow-hidden">
        <img
          src={bannerImage}
          alt={title}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Header */}
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>

          <Badge variant={status === "approved" ? "default" : "secondary"}>
            {status}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          <span>{new Date(eventDate).toDateString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>Max {maxAttendees} attendees</span>
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex items-center justify-between">
        <span className="font-medium">{isPaid ? `৳${eventFee}` : "Free"}</span>

        <Link to={`/dashboard/event-details/${event._id}`}>
          <Button
            className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            size="sm"
          >
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
