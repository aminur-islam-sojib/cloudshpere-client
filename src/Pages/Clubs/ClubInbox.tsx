import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { useAuth } from "@/Context/AuthContext";
import {
  Calendar,
  Users,
  BookOpen,
  MessageSquare,
  Award,
  Clock,
  MapPin,
  Mail,
  Sparkles,
  Video,
  FileText,
  TrendingUp,
  Bell,
  Settings,
  Download,
  Play,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Club {
  _id: string;
  clubName: string;
  category: string;
  description: string;
  location: string;
  managerEmail: string;
  membershipFee: number;
  status: string;
  createdAt: string;
}

interface Membership {
  _id: string;
  userEmail: string;
  clubId: string;
  status: string;
  joinedAt: string;
  expiresAt?: string | null;
  type: string;
}

const ClubInbox = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: clubDetails, isLoading: clubLoading } = useQuery<Club>({
    queryKey: ["club-details", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axiosSecure.get(`/club-details/${id}`);
      return res.data;
    },
  });

  const { data: membership, isLoading: membershipLoading } =
    useQuery<Membership>({
      queryKey: ["verified-user", id, user?.email],
      enabled: !!id && !!user?.email,
      queryFn: async () => {
        const res = await axiosSecure.get(`/payment-user/${id}`);
        return res.data;
      },
    });

  const isLoading = clubLoading || membershipLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!clubDetails) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <Alert variant="destructive">
          <AlertDescription>Club not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const memberSince = membership?.joinedAt
    ? new Date(membership.joinedAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <div>
      {membership && membership?.type === "membership" ? (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          {/* Header Section */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                      {clubDetails.clubName}
                    </h1>
                    <Badge variant="secondary" className="text-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {clubDetails.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {clubDetails.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4" />
                      {clubDetails.category}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Member since {memberSince}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Bell className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Alert */}
            <Alert className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Welcome back! Check out the latest French conversation sessions
                and new learning materials added this week.
              </AlertDescription>
            </Alert>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:inline-grid">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
                <TabsTrigger value="events">Events</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Active Members
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            247
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Learning Hours
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            24.5
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Completed Lessons
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            12/30
                          </p>
                        </div>
                        <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            Achievements
                          </p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            8
                          </p>
                        </div>
                        <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Featured Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="w-5 h-5" />
                        Latest Live Session
                      </CardTitle>
                      <CardDescription>
                        Join our weekly French conversation practice
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 rounded-lg flex items-center justify-center mb-4">
                        <Play className="w-16 h-16 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        French Conversation: Daily Routines
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Practice speaking about your daily routine with native
                        speakers
                      </p>
                      <div className="flex gap-2">
                        <Button className="flex-1">Join Live Session</Button>
                        <Button variant="outline">Watch Replay</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Your Progress
                      </CardTitle>
                      <CardDescription>Keep up the great work!</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Beginner Level
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            40%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: "40%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Vocabulary
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            65%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: "65%" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            Speaking Practice
                          </span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            30%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full"
                            style={{ width: "30%" }}
                          ></div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full">
                        View Detailed Analytics
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          title: "French Movie Night",
                          date: "Dec 18, 2025",
                          time: "7:00 PM",
                          attendees: 45,
                        },
                        {
                          title: "Grammar Workshop: Past Tense",
                          date: "Dec 20, 2025",
                          time: "6:00 PM",
                          attendees: 32,
                        },
                        {
                          title: "Cultural Exchange Meetup",
                          date: "Dec 22, 2025",
                          time: "5:00 PM",
                          attendees: 28,
                        },
                      ].map((event, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg gap-4"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {event.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {event.date} at {event.time} • {event.attendees}{" "}
                              attending
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            RSVP
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Resources Tab */}
              <TabsContent value="resources" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5" />
                        Learning Materials
                      </CardTitle>
                      <CardDescription>
                        Exclusive content for members
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        {
                          title: "French Grammar Guide",
                          type: "PDF",
                          size: "2.4 MB",
                        },
                        {
                          title: "1000 Common French Words",
                          type: "PDF",
                          size: "1.8 MB",
                        },
                        {
                          title: "Pronunciation Audio Pack",
                          type: "ZIP",
                          size: "45 MB",
                        },
                        {
                          title: "French Culture eBook",
                          type: "EPUB",
                          size: "3.2 MB",
                        },
                      ].map((resource, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {resource.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {resource.type} • {resource.size}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Video className="w-5 h-5" />
                        Video Lessons
                      </CardTitle>
                      <CardDescription>
                        On-demand learning content
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        {
                          title: "Introduction to French Basics",
                          duration: "45 min",
                          views: 234,
                        },
                        {
                          title: "French Pronunciation Masterclass",
                          duration: "1h 20min",
                          views: 189,
                        },
                        {
                          title: "Conversational French",
                          duration: "55 min",
                          views: 312,
                        },
                        {
                          title: "Advanced Grammar Techniques",
                          duration: "1h 15min",
                          views: 156,
                        },
                      ].map((video, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-purple-500 rounded flex items-center justify-center">
                              <Play className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {video.title}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {video.duration} • {video.views} views
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            Watch
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Community Tab */}
              <TabsContent value="community" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Recent Discussions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        {
                          author: "Marie Laurent",
                          topic: "Tips for improving listening comprehension?",
                          replies: 23,
                          time: "2 hours ago",
                          avatar: "ML",
                        },
                        {
                          author: "Jean Dupont",
                          topic: "Best French podcasts for beginners",
                          replies: 45,
                          time: "5 hours ago",
                          avatar: "JD",
                        },
                        {
                          author: "Sophie Martin",
                          topic: "Difference between 'tu' and 'vous'",
                          replies: 18,
                          time: "1 day ago",
                          avatar: "SM",
                        },
                      ].map((discussion, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        >
                          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {discussion.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                              {discussion.topic}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              by {discussion.author} • {discussion.replies}{" "}
                              replies • {discussion.time}
                            </p>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        View All Discussions
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Active Members
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        {
                          name: "Emma Wilson",
                          status: "Online",
                          role: "Moderator",
                        },
                        {
                          name: "Lucas Bernard",
                          status: "Online",
                          role: "Member",
                        },
                        {
                          name: "Olivia Chen",
                          status: "Online",
                          role: "Member",
                        },
                        {
                          name: "Pierre Dubois",
                          status: "Away",
                          role: "Member",
                        },
                      ].map((member, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="w-10 h-10 bg-linear-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                {member.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                                  member.status === "Online"
                                    ? "bg-green-500"
                                    : "bg-yellow-500"
                                }`}
                              ></div>
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-900 dark:text-white">
                                {member.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {member.role}
                              </p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            <Mail className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      Club Events Calendar
                    </CardTitle>
                    <CardDescription>
                      All upcoming club activities and sessions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          title: "French Movie Night",
                          date: "Dec 18",
                          time: "7:00 PM",
                          type: "Social",
                          spots: "15/50",
                        },
                        {
                          title: "Grammar Workshop",
                          date: "Dec 20",
                          time: "6:00 PM",
                          type: "Learning",
                          spots: "8/30",
                        },
                        {
                          title: "Cultural Meetup",
                          date: "Dec 22",
                          time: "5:00 PM",
                          type: "Social",
                          spots: "20/40",
                        },
                        {
                          title: "Speaking Challenge",
                          date: "Dec 24",
                          time: "4:00 PM",
                          type: "Practice",
                          spots: "12/25",
                        },
                        {
                          title: "French Cooking Class",
                          date: "Dec 26",
                          time: "3:00 PM",
                          type: "Workshop",
                          spots: "5/20",
                        },
                        {
                          title: "New Year Celebration",
                          date: "Dec 31",
                          time: "8:00 PM",
                          type: "Special",
                          spots: "35/100",
                        },
                      ].map((event, idx) => (
                        <Card
                          key={idx}
                          className="hover:shadow-lg transition-shadow"
                        >
                          <CardContent className="pt-6">
                            <Badge className="mb-3">{event.type}</Badge>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                              {event.title}
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {event.date}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {event.time}
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                {event.spots} registered
                              </div>
                            </div>
                            <Button className="w-full" size="sm">
                              Register Now
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      ) : (
        " You have no access in this course "
      )}
    </div>
  );
};

export default ClubInbox;
