"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosPublic from "@/Hooks/axiosPublic";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router";
import AppLoader from "@/components/Shared/Loader/AppLoader";
import { motion } from "framer-motion";

const DEFAULT_IMAGE = "/unsupportedImg.jpeg";

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

const FeaturedClub = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<ClubsResponse>({
    queryKey: ["clubs"],
    queryFn: async () => {
      const res = await axiosPublic.get("/api/clubs");
      return res.data;
    },
  });

  const clubs = data?.clubs ?? [];

  return (
    <motion.section
      className="pt-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-10">
          <motion.h2
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Featured Clubs
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Discover the most active and popular clubs
          </motion.p>
        </div>

        {/* STATES */}
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {clubs.map((club, index) => (
              <motion.div
                key={club._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                className="h-full"
              >
                {/* CARD */}
                <Card className="h-full flex flex-col rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition">
                  {/* IMAGE */}
                  <div className="relative h-44 w-full bg-gray-50 shrink-0">
                    <img
                      src={club.bannerImage || DEFAULT_IMAGE}
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (img.src !== DEFAULT_IMAGE) img.src = DEFAULT_IMAGE;
                      }}
                      alt={club.clubName || "Club"}
                      className="h-full w-full object-cover"
                    />

                    <span className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
                      {club.category || "General"}
                    </span>
                  </div>

                  {/* HEADER */}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {club.clubName || "Unnamed Club"}
                    </CardTitle>

                    <p className="text-sm text-gray-500 line-clamp-2 min-h-10">
                      {club.description || "No description available"}
                    </p>
                  </CardHeader>

                  {/* CONTENT */}
                  <CardContent className="flex flex-col flex-1">
                    {/* INFO ROWS */}
                    <div className="space-y-2 text-sm text-gray-600 min-h-[72px]">
                      <div className="flex gap-2 items-center">
                        <MapPin size={16} />
                        {club.location || "Location not set"}
                      </div>

                      <div className="flex gap-2 items-center">
                        <Users size={16} className="shrink-0" />
                        <span className="truncate max-w-[180px]">
                          {club.managerEmail || "Manager not assigned"}
                        </span>
                      </div>

                      <div className="flex gap-2 items-center">
                        <CalendarDays size={16} className=" shrink-0" />
                        Fee: ${club.membershipFee ?? 0}
                      </div>
                    </div>

                    {/* BUTTONS – HARD SOLUTION */}
                    <div className="mt-auto pt-4 flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => navigate(`/clubs/${club._id}`)}
                      >
                        Details <ArrowRight size={16} />
                      </Button>

                      <Button
                        className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition"
                        onClick={() => navigate(`/clubs/${club._id}`)}
                      >
                        Join Club
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default FeaturedClub;
