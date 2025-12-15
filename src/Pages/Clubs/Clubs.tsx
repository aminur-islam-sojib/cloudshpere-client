import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "@/Hooks/axiosPublic";
import { MapPin, CalendarDays, ArrowRight, Users } from "lucide-react";
import { Link, useNavigate } from "react-router";

type Club = {
  _id: string;
  bannerImage?: string;
  category?: string;
  clubName?: string;
  createdAt?: string;
  description?: string;
  location?: string;
  managerEmail?: string;
  membershipFee?: number;
};

const DEFAULT_IMAGE = "/unsupportedImg.jpeg";

const Clubs: React.FC = () => {
  const { data: clubs = [] } = useQuery({
    queryKey: ["Clubs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/clubs");
      return res.data as Club[];
    },
  });
  const navigate = useNavigate();
  const handleDetailsButton = (id: string) => {
    navigate(`/clubs/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clubs.map((club: Club) => (
        <Card
          key={club._id}
          className="group shadow-lg hover:shadow-2xl transition-transform rounded-2xl overflow-hidden border border-gray-100 bg-white hover:-translate-y-1"
        >
          <div className="relative h-44 w-full bg-gray-50">
            <img
              src={club.bannerImage || DEFAULT_IMAGE}
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                if (target.src !== DEFAULT_IMAGE) target.src = DEFAULT_IMAGE;
              }}
              alt={club.clubName || "Club banner"}
              className="h-full w-full object-cover"
            />
            <div className="absolute left-4 top-4 px-3 py-1 rounded-full bg-white/80 backdrop-blur text-xs font-medium">
              {club.category || "General"}
            </div>
          </div>

          <CardHeader className="pt-4 pb-0">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-semibold leading-tight">
                  {club.clubName}
                </CardTitle>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {club.description}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Since</div>
                <div className="text-sm font-medium">
                  {club.createdAt
                    ? new Date(club.createdAt).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-2 pb-4">
            <div className="flex flex-col gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="truncate">
                  {club.location || "Location not set"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Users size={16} />
                <span className="truncate">
                  Manager: {club.managerEmail || "—"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays size={16} />
                <span>Fee: ${club.membershipFee ?? 0}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Link to={`/clubs/${club._id}`} className="w-1/2">
                <Button
                  variant="outline"
                  className="w-full rounded-xl flex items-center justify-center gap-2"
                >
                  Details <ArrowRight size={16} />
                </Button>
              </Link>

              <Button
                onClick={() => handleDetailsButton(club._id)}
                className="w-1/2 rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 hover:scale-[1.02]"
              >
                Join Club
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Clubs;
