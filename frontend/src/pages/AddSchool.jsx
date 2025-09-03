// frontend/src/pages/AddSchool.jsx
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import { addSchool } from "../ReduxSlices/schoolSlice";
import { useState } from "react";
import "../styles/addSchool.css";

export default function AddSchool() {
  // use react-hook-form for easy validation and controlled submit
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const dispatch = useDispatch();
  const { adding, addError } = useSelector((s) => s.schools);

  // for image preview
  const [preview, setPreview] = useState(null);
  const imageWatch = watch("image");

  // update preview whenever file changes
  const onFileChange = () => {
    const file = imageWatch?.[0];
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  // submit handler (dispatch thunk to backend)
  const onSubmit = async (data) => {
    // dispatch async thunk; it internally builds FormData
    const result = await dispatch(addSchool(data));
    if (result.meta.requestStatus === "fulfilled") {
      alert("School added successfully!");
      reset(); // clear form
      setPreview(null);
    } else {
      // addError is already set in slice; also show here
      alert("Failed to add school. Please check inputs.");
    }
  };

  return (
    <div className="container py-4 form-container">
      <h2 className="mb-3">Add School</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="school-form">
        {/* Name (required) */}
        <div className="mb-3">
          <label className="form-label">School Name</label>
          <input
            className="form-control"
            {...register("name", { required: "School name is required" })}
            placeholder="Ex: ABC Public School"
          />
          {errors.name && <small className="text-danger">{errors.name.message}</small>}
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input className="form-control" {...register("address")} placeholder="Street, Area" />
        </div>

        {/* City */}
        <div className="mb-3">
          <label className="form-label">City</label>
          <input className="form-control" {...register("city")} placeholder="Hyderabad" />
        </div>

        {/* State */}
        <div className="mb-3">
          <label className="form-label">State</label>
          <input className="form-control" {...register("state")} placeholder="Telangana" />
        </div>

        {/* Contact (10 digits) */}
        <div className="mb-3">
          <label className="form-label">Contact</label>
          <input
            className="form-control"
            {...register("contact", {
              pattern: { value: /^\d{10}$/, message: "Enter 10 digit number" },
            })}
            placeholder="9876543210"
          />
          {errors.contact && <small className="text-danger">{errors.contact.message}</small>}
        </div>

        {/* Email (required + pattern) */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            {...register("email_id", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
            placeholder="school@example.com"
          />
          {errors.email_id && <small className="text-danger">{errors.email_id.message}</small>}
        </div>

        {/* Description */}
<div className="mb-3">
  <label className="form-label">Description</label>
  <textarea
    className="form-control"
    rows="3"
    placeholder="Write something about the school"
    {...register("description")}
  ></textarea>
</div>


        {/* Image (optional) */}
        <div className="mb-3">
          <label className="form-label">School Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            {...register("image")}
            onChange={onFileChange}
          />
          {/* live preview for UX */}
          {preview && (
            <div className="mt-2">
              <img src={preview} alt="preview" className="img-thumbnail" style={{ maxWidth: 220 }} />
            </div>
          )}
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary" disabled={adding}>
          {adding ? "Saving..." : "Add School"}
        </button>

        {/* show redux error if any */}
        {addError && <div className="alert alert-danger mt-3">{addError}</div>}
      </form>
    </div>
  );
}
