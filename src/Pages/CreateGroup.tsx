import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Upload, X, Loader2 } from "lucide-react";
import { axiosSecure } from "@/Hooks/useAxiosSecure";
import { useAuth } from "@/Context/AuthContext";

const categories = [
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
] as const;

type Category = (typeof categories)[number];

interface ClubFormData {
  clubName: string;
  description: string;
  category: Category | "";
  location: string;
  bannerImage: string;
  membershipFee: number;
  managerEmail: string;
}

interface ImageBBResponse {
  success: boolean;
  data?: {
    url: string;
  };
  error?: {
    message: string;
  };
}

export default function ClubForm() {
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    // reset,
    setValue,
    watch,
  } = useForm<ClubFormData>({
    defaultValues: {
      clubName: "",
      description: "",
      category: "",
      location: "",
      bannerImage: "",
      membershipFee: 0,
      managerEmail: "",
    },
  });

  const uploadToImageBB = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadError("");

    try {
      // Get API key from environment variable
      const apiKey = import.meta.env.VITE_IMG_BB as string | undefined;

      if (!apiKey) {
        throw new Error("ImageBB API key not found in environment variables");
      }

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data: ImageBBResponse = await response.json();

      if (data.success && data.data) {
        return data.data.url;
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("ImageBB upload error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setUploadError(errorMessage);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
    };
    reader.readAsDataURL(file);

    // Upload to ImageBB
    const imageUrl = await uploadToImageBB(file);

    if (imageUrl) {
      setValue("bannerImage", imageUrl, { shouldValidate: true });
    } else {
      // If upload fails, clear the preview
      setImagePreview("");
    }
  };

  const removeImage = (): void => {
    setImagePreview("");
    setValue("bannerImage", "");
    setUploadError("");
  };

  const onSubmit: SubmitHandler<ClubFormData> = async (data) => {
    console.log("Form Data:", data);
    // Here you can send data to your backend
    const clubDetails = {
      clubName: data.clubName,
      description: data.description,
      category: data.category,
      location: data.location,
      bannerImage: data.bannerImage,
      membershipFee: data.membershipFee,
      managerEmail: user?.email,
    };
    try {
      const res = await axiosSecure.post("/clubs", clubDetails);
      const user = await res.data;
      console.log(user);
    } catch (error) {
      console.log(error);
    }
    // All fields including bannerImage URL are in the data object
    alert("Club registration submitted successfully!");
    // reset();
    setImagePreview("");
  };

  const bannerImageUrl = watch("bannerImage");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Club Registration
          </h1>
        </div>

        {/* Form Container */}
        <div className="rounded-xl shadow-lg p-6 md:p-8 bg-white dark:bg-gray-800">
          {/* Club Name */}
          <div className="mb-6">
            <label
              htmlFor="clubName"
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200"
            >
              Club Name <span className="text-red-500">*</span>
            </label>
            <input
              id="clubName"
              type="text"
              {...register("clubName", {
                required: "Club name is required",
                minLength: {
                  value: 3,
                  message: "Minimum 3 characters required",
                },
              })}
              className="w-full px-4 py-2 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Enter club name"
            />
            {errors.clubName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.clubName.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200"
            >
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={4}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Minimum 20 characters required",
                },
              })}
              className="w-full px-4 py-2 rounded-lg border transition-colors resize-none bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="Describe your club's mission and activities"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Category and Location */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200"
              >
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                {...register("category", { required: "Category is required" })}
                className="w-full px-4 py-2 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200"
              >
                Location <span className="text-red-500">*</span>
              </label>
              <input
                id="location"
                type="text"
                {...register("location", { required: "Location is required" })}
                className="w-full px-4 py-2 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="e.g., Room 101, Main Building"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Banner Image */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
              Banner Image
            </label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
              {isUploading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Loader2
                    className="animate-spin text-blue-500 mb-2"
                    size={40}
                  />
                  <p className="text-gray-600 dark:text-gray-400">
                    Uploading to ImageBB...
                  </p>
                </div>
              ) : imagePreview && bannerImageUrl ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    ✓ Image uploaded successfully
                  </p>
                </div>
              ) : (
                <div>
                  <Upload
                    className="mx-auto mb-2 text-gray-500 dark:text-gray-400"
                    size={32}
                  />
                  <label
                    htmlFor="bannerImage"
                    className="cursor-pointer text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Click to upload
                  </label>
                  <input
                    id="bannerImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              )}
            </div>
            {uploadError && (
              <p className="text-red-500 text-sm mt-2">⚠ {uploadError}</p>
            )}
            {bannerImageUrl && !isUploading && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 break-all">
                URL: {bannerImageUrl}
              </p>
            )}
          </div>

          {/* Membership Fee and Manager Email */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label
                htmlFor="membershipFee"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200"
              >
                Membership Fee
              </label>
              <input
                id="membershipFee"
                type="number"
                min="0"
                step="0.01"
                {...register("membershipFee", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Fee cannot be negative" },
                })}
                className="w-full px-4 py-2 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="0.00"
              />
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                Set to 0 for free membership
              </p>
              {errors.membershipFee && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.membershipFee.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="managerEmail"
                className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-200"
              >
                Manager Email <span className="text-red-500">*</span>
              </label>
              <input
                id="managerEmail"
                type="email"
                value={user?.email || null || undefined}
                {...register("managerEmail", {
                  required: "Manager email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="w-full px-4 py-2 rounded-lg border transition-colors bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              {errors.managerEmail && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.managerEmail.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isUploading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            {isUploading ? "Uploading Image..." : "Submit Registration"}
          </button>
        </div>
      </div>
    </div>
  );
}
