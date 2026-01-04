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

  const clubs = data?.clubs || [];
  console.log(clubs);
  return (
    <motion.section
      className=" pt-10"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <motion.h2
            className="text-3xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Featured Clubs
          </motion.h2>
          <motion.p
            className="text-muted-foreground mt-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            Discover the most active and popular clubs
          </motion.p>
        </div>
        <div>
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
              {clubs.map((club, index) => (
                <motion.div
                  key={club._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: index * 0.1,
                  }}
                >
                  <Card className="group shadow-lg hover:shadow-2xl transition rounded-2xl overflow-hidden">
                    {/* IMAGE */}
                    <div className="relative h-44 w-full bg-gray-50">
                      <img
                        src={club.bannerImage || DEFAULT_IMAGE}
                        onError={(e) => {
                          const img = e.currentTarget;
                          if (img.src !== DEFAULT_IMAGE)
                            img.src = DEFAULT_IMAGE;
                        }}
                        alt={club.clubName}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium">
                        {club.category || "General"}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <CardHeader className="pb-0 flex-1">
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
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturedClub;
