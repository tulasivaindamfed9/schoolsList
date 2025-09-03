// frontend/src/pages/ShowSchools.jsx
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Modal } from "bootstrap"; // Bootstrap modal

import {
  fetchSchools,
  deleteSchool,
  updateSchool,
} from "../ReduxSlices/schoolSlice";
import "../styles/showSchools.css";

export default function ShowSchools() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((s) => s.schools);

  const { register, handleSubmit, reset } = useForm();
  const [editing, setEditing] = useState(null); // school being edited

  // Handle edit submit
  const onEditSubmit = (data) => {
    dispatch(updateSchool({ id: editing._id, data }));
    setEditing(null); // close modal
    // hide bootstrap modal
    const modalEl = document.getElementById("editModal");
    const modalInstance = Modal.getInstance(modalEl);
    modalInstance.hide();
  };

  // simple search by name or city
  const [query, setQuery] = useState("");

  useEffect(() => {
    dispatch(fetchSchools());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q)
    );
  }, [items, query]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="mb-0">Schools</h2>
        <input
          className="form-control w-auto"
          placeholder="Search by name or city"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading && <div className="alert alert-info">Loading schools...</div>}
      {error && <div className="alert alert-danger">Error: {error}</div>}

      <div className="row g-3">
        {filtered.map((school) => (
          <div className="col-12 col-sm-6 col-lg-4" key={school._id}>
            <div className="card school-card h-100">
              {/* school image — fallback if missing */}
              <img
                className="card-img-top school-card-img"
                src={
                  school.image
                    ? `${import.meta.env.VITE_API_BASE_URL}/schoolImages/${
                        school.image
                      }`
                    : "https://via.placeholder.com/600x400?text=No+Image"
                }
                alt={school.name}
              />
              <div className="card-body">
                <h5 className="card-title">{school.name}</h5>
                <p className="card-text mb-1">{school.address || "-"}</p>
                <p className="card-text text-muted">{school.city || "-"}</p>

                {/* New description */}
                {school.description && (
                  <p className="card-text mt-2">{school.description}</p>
                )}

                <div className="d-flex gap-2">
                  {/* Edit button */}
                  <button
                    className="btn btn-sm btn-outline-primary mt-2"
                    onClick={() => {
                      setEditing(school);
                      reset(school); // pre-fill form
                      new Modal(document.getElementById("editModal")).show();
                    }}
                  >
                    Edit
                  </button>

                  {/* Delete button */}
                  <button
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={() => {
                      if (confirm(`Delete ${school.name}?`)) {
                        dispatch(deleteSchool(school._id));
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-muted">No schools found.</div>
        )}
      </div>

      {/* Bootstrap Modal for Edit */}
      {editing && (
        <div
          className="modal fade"
          id="editModal"
          tabIndex="-1"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit(onEditSubmit)}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit School</h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setEditing(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Name */}
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input className="form-control" {...register("name")} />
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input className="form-control" {...register("address")} />
                  </div>

                  {/* City */}
                  <div className="mb-3">
                    <label className="form-label">City</label>
                    <input className="form-control" {...register("city")} />
                  </div>

                  {/* State */}
                  <div className="mb-3">
                    <label className="form-label">State</label>
                    <input className="form-control" {...register("state")} />
                  </div>

                  {/* Description */}
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      {...register("description")}
                    ></textarea>
                  </div>

                  {/* Image (optional replace) */}
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      className="form-control"
                      {...register("image")}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
