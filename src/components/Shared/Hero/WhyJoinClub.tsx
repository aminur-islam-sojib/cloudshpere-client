// src/components/home/WhyJoinClub.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Network, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
  {
    id: 1,
    title: "Build Meaningful Connections",
    description:
      "Meet people who share your interests and build friendships that go beyond online interactions.",
    icon: Users,
  },
  {
    id: 2,
    title: "Grow Your Skills",
    description:
      "Participate in workshops, events, and activities that help you learn and grow personally or professionally.",
    icon: TrendingUp,
  },
  {
    id: 3,
    title: "Expand Your Network",
    description:
      "Connect with professionals, creators, and enthusiasts who can open doors to new opportunities.",
    icon: Network,
  },
  {
    id: 4,
    title: "Be Part of Something Bigger",
    description:
      "Belong to active communities where your voice matters and your contributions are valued.",
    icon: HeartHandshake,
  },
];

const WhyJoinClub = () => {
  return (
    <motion.section
      className="py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            Why Join a Club?
          </motion.h2>
          <motion.p
            className="mt-3 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            Discover the benefits of becoming part of a thriving community.
          </motion.p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
                whileHover={{ y: -5 }}
              >
                <Card className="group bg-white dark:bg-gray-900 border dark:border-gray-800 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    {/* Icon */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition">
                      <Icon size={28} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {benefit.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default WhyJoinClub;
