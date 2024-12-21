import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function AddBlog() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="h-full p-6">
      <div className="h-full border border-gray-900 rounded-lg p-8 flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 flex-grow"
        >
          <div className="flex-grow flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold">Blog Title</label>
              <input
                {...register("title", { required: true })}
                type="text"
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter blog title"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold">Description</label>
              <textarea
                {...register("description", { required: true })}
                className="p-2 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter blog description"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold">Blog Image</label>
              <div className="flex gap-8  justify-between items-start">
                <div className="w-1/3">
                  <input
                    {...register("blogImage")}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                  />
                </div>
                {imagePreview && (
                  <div className="w-64 h-64 rounded-lg overflow-hidden border flex-shrink-0">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-300 rounded-lg hover:bg-blue-400 transition-colors cursor-pointer font-semibold"
            >
              Post Blog
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBlog;
