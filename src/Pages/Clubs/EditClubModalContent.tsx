/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface EditClubModalContentType {
  clubId: string;
  setIsOpen: (open: boolean) => void;
}

interface ClubFormData {
  clubName: string;
  description: string;
  category: string;
  location: string;
  membershipFee: number;
  bannerImage: string;
  status: string;
}

const EditClubModalContent = ({
  clubId,
  setIsOpen,
}: EditClubModalContentType) => {
  //   const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: club, isLoading } = useQuery({
    queryKey: ["clubs-details", clubId],
    enabled: !!clubId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/club-details/${clubId}`);
      return res.data;
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClubFormData>({
    defaultValues: {
      clubName: club?.clubName || "",
      description: club?.description || "",
      category: club?.category || "",
      location: club?.location || "",
      membershipFee: club?.membershipFee || 0,
      bannerImage: club?.bannerImage || "",
      status: club?.status || "pending",
    },
  });

  React.useEffect(() => {
    if (club) {
      setValue("clubName", club.clubName);
      setValue("description", club.description);
      setValue("category", club.category);
      setValue("location", club.location);
      setValue("membershipFee", club.membershipFee);
      setValue("bannerImage", club.bannerImage);
      setValue("status", club.status);
    }
  }, [club, setValue]);

  const updateClubMutation = useMutation({
    mutationFn: async (data: ClubFormData) => {
      const res = await axiosSecure.patch(`/club/${clubId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs-details", clubId] });
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      toast.success("Club updated successfully!");
      queryClient.refetchQueries({ queryKey: ["manager-clubs"] });
      setIsOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update club");
    },
  });

  const onSubmit = (data: ClubFormData) => {
    updateClubMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-600 dark:text-gray-400">
          Loading club details...
        </p>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Club not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Club Name & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="clubName"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Club Name *
          </label>
          <input
            type="text"
            id="clubName"
            {...register("clubName", {
              required: "Club name is required",
              minLength: {
                value: 3,
                message: "Club name must be at least 3 characters",
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Enter club name"
          />
          {errors.clubName && (
            <p className="text-sm text-red-500 mt-1">
              {errors.clubName.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Category *
          </label>
          <select
            id="category"
            {...register("category", {
              required: "Category is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          >
            <option value="">Select a category</option>
            <option value="Tech">Tech</option>
            <option value="Sports">Sports</option>
            <option value="Arts">Arts</option>
            <option value="Music">Music</option>
            <option value="Education">Education</option>
            <option value="Business">Business</option>
            <option value="Social">Social</option>
            <option value="Other">Other</option>
          </select>
          {errors.category && (
            <p className="text-sm text-red-500 mt-1">
              {errors.category.message}
            </p>
          )}
        </div>
      </div>

      {/* Location & Membership Fee */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Location *
          </label>
          <input
            type="text"
            id="location"
            {...register("location", {
              required: "Location is required",
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Enter location"
          />
          {errors.location && (
            <p className="text-sm text-red-500 mt-1">
              {errors.location.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="membershipFee"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Membership Fee *
          </label>
          <input
            type="number"
            id="membershipFee"
            {...register("membershipFee", {
              required: "Membership fee is required",
              min: {
                value: 0,
                message: "Membership fee cannot be negative",
              },
              valueAsNumber: true,
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
            placeholder="Enter membership fee"
          />
          {errors.membershipFee && (
            <p className="text-sm text-red-500 mt-1">
              {errors.membershipFee.message}
            </p>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description *
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100 resize-none"
          placeholder="Please describe the club..."
        />
        {errors.description && (
          <p className="text-sm text-red-500 mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Banner Image URL */}
      <div>
        <label
          htmlFor="bannerImage"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Banner Image URL *
        </label>
        <input
          type="text"
          id="bannerImage"
          {...register("bannerImage", {
            required: "Banner image URL is required",
            pattern: {
              value: /^https?:\/\/.+/,
              message: "Please enter a valid URL",
            },
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
          placeholder="Enter banner image URL"
        />
        {errors.bannerImage && (
          <p className="text-sm text-red-500 mt-1">
            {errors.bannerImage.message}
          </p>
        )}
      </div>

      {/* Status */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Status *
        </label>
        <select
          id="status"
          {...register("status", {
            required: "Status is required",
          })}
          disabled
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
        >
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        {errors.status && (
          <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          onClick={() => setIsOpen(false)}
          variant="secondary"
          disabled={updateClubMutation.isPending}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit(onSubmit)}
          variant="default"
          disabled={updateClubMutation.isPending}
        >
          {updateClubMutation.isPending ? "Updating..." : "Update Club"}
        </Button>
      </div>
    </div>
  );
};

export default EditClubModalContent;
