// src/components/home/HowItWorks.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserPlus, CalendarCheck, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Discover Clubs",
    description:
      "Browse clubs by category, location, or popularity and find the perfect community for you.",
    icon: Search,
  },
  {
    id: 2,
    title: "Join a Club",
    description:
      "Join free clubs instantly or securely pay membership fees using Stripe for premium clubs.",
    icon: UserPlus,
  },
  {
    id: 3,
    title: "Attend Events",
    description:
      "Register for upcoming events, track your registrations, and never miss an activity.",
    icon: CalendarCheck,
  },
  {
    id: 4,
    title: "Manage & Grow",
    description:
      "Club managers create clubs and events, while admins ensure a safe and organized platform.",
    icon: ShieldCheck,
  },
];

const HowItWorks = () => {
  return (
    <motion.section
      className="pt-15"
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
            How ClubSphere Works
          </motion.h2>
          <motion.p
            className="mt-3 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            Join clubs, participate in events, and build communities — all in
            one platform.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  ease: "easeOut",
                  delay: index * 0.1,
                }}
              >
                <Card className="group bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    {/* Icon */}
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition">
                      <Icon size={28} />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
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

export default HowItWorks;
