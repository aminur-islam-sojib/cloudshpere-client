import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Swal from "sweetalert2";

type User = {
  _id: string;
  email: string;
  name: string;
  password: string;
  role: string;
  createdAt: string;
  photoURL?: string;
};

const UsersPage = () => {
  const queryClient = useQueryClient();
  const [imageErrorId, setImageErrorId] = useState<string | null>(null);

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // Mutation for updating roles
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const res = await axiosSecure.patch(`/users/update-role/${id}`, { role });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Role updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Failed to update role.");
    },
  });
  const updateDeleteUser = useMutation({
    mutationFn: async (id: string) => {
      const res = await axiosSecure.delete(`/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("User Deleted Successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      toast.error("Failed to delete User");
    },
  });

  const handleRoleChange = (id: string, newRole: string) => {
    updateRoleMutation.mutate({ id, role: newRole });
  };

  const handleDeleteUser = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this account!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        updateDeleteUser.mutate(id);
      }
    });
  };

  const getInitials = (name: string) => {
    const words = name.split(" ");
    const initials =
      words[0]?.charAt(0).toUpperCase() +
      (words[1]?.charAt(0).toUpperCase() || "");
    return initials || "U";
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Users Management
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage and view all users in your system.
        </p>
      </div>

      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            All Users
          </CardTitle>
          <CardDescription>Total users: {users.length}</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold">Photo</th>
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user: User) => (
                  <tr
                    key={user._id}
                    className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {/* Avatar Column */}
                    <td className="py-3 px-4">
                      {user.photoURL && imageErrorId !== user._id ? (
                        <img
                          src={user.photoURL}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                          onError={() => setImageErrorId(user._id)}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                          {getInitials(user.name)}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-slate-900 dark:text-white">
                      {user.name}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                      {user.email}
                    </td>

                    {/* Role Dropdown */}
                    <td className="py-3 px-4">
                      <Select
                        onValueChange={(value) =>
                          handleRoleChange(user._id, value)
                        }
                        defaultValue={user.role}
                      >
                        <SelectTrigger className="w-32">
                          {user.role}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="manager">Manager</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
