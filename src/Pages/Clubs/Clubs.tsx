import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import axiosPublic from "@/Hooks/axiosPublic";
import { MapPin, CalendarDays, ArrowRight, Users, Search } from "lucide-react";
import { useNavigate } from "react-router";
import AppLoader from "@/components/Shared/Loader/AppLoader";

// ---------------- TYPES ----------------
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

type ClubsResponse = {
  clubs: Club[];
  total: number;
};

const DEFAULT_IMAGE = "/unsupportedImg.jpeg";

const CATEGORIES = [
  "All",
  "Photography",
  "Sports",
  "Tech",
  "Art",
  "Music",
  "Dance",
  "Literature",
  "Science",
  "Business",
  "Social Service",
];

// ---------------- COMPONENT ----------------
const Clubs: React.FC = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data, isLoading } = useQuery<ClubsResponse>({
    queryKey: ["clubs", search, category],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/clubs", {
        params: {
          search,
          category: category === "All" ? undefined : category,
        },
      });
      return res.data;
    },
  });

  const clubs = data?.clubs || [];

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* -------- FILTER BAR -------- */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-2/3">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <Input
            placeholder="Search clubs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>

        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full md:w-1/3 rounded-xl">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* -------- STATES -------- */}
      {isLoading && <AppLoader />}

      {!isLoading && clubs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500">
          <p className="text-lg font-medium">No clubs found</p>
          <p className="text-sm mt-1">
            Try changing the category or search keyword
          </p>
        </div>
      )}

      {!isLoading && clubs.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
          {clubs.map((club) => (
            <Card
              key={club._id}
              className="group shadow-lg hover:shadow-2xl transition rounded-2xl overflow-hidden"
            >
              {/* IMAGE */}
              <div className="relative h-44 w-full bg-gray-50">
                <img
                  src={club.bannerImage || DEFAULT_IMAGE}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.src !== DEFAULT_IMAGE) img.src = DEFAULT_IMAGE;
                  }}
                  alt={club.clubName}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
                  {club.category || "General"}
                </span>
              </div>

              {/* CONTENT */}
              <CardHeader className="pb-0">
                <CardTitle className="text-lg">{club.clubName}</CardTitle>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {club.description}
                </p>
              </CardHeader>

              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex gap-2 items-center">
                    <MapPin size={16} />
                    {club.location || "Location not set"}
                  </div>

                  <div className="flex gap-2 items-center">
                    <Users size={16} />
                    {club.managerEmail || "—"}
                  </div>

                  <div className="flex gap-2 items-center">
                    <CalendarDays size={16} />
                    Fee: ${club.membershipFee ?? 0}
                  </div>
                </div>

                <div className="mt-4 flex gap-3">
                  <Button
                    onClick={() => navigate(`/clubs/${club._id}`)}
                    className=" flex-1"
                    variant="outline"
                  >
                    Details <ArrowRight size={16} />
                  </Button>

                  <Button
                    onClick={() => navigate(`/clubs/${club._id}`)}
                    className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Join Club
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clubs;
