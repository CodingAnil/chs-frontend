import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { ChevronDown, ChevronUp, Image } from "react-feather";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as yup from "yup";
import { LanguagesList } from "../../constants/common";
import { callDeleteApi, callPostApi, callPutApi } from "../../_service";
import { toastMessage } from "../../config/toast";
import { getLocalStorage, setLocalStorage } from "../../helpers/storage";
import { Spinner } from "reactstrap";
import { STORAGE } from "../../constants";
import { useDispatch } from "react-redux";
import { userProfile } from "../../redux/slices/userApi";
import DeleteModal from "../../components/modals/delete-modal";

const schema = yup.object().shape({
  firstName: yup.string().required("First Name is required"),
  lastName: yup.string().required("Last Name is required"),
  // displayName: yup.string().required("Last Name is required"),
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .matches(/^[0-9]+$/, "Phone Number must be numeric"),
  email: yup.string().email("Invalid Email"),
  designation: yup.string().required("Designation is required"),
  languages: yup
    .array()
    .required("Languages is required.")
    .min(1, "Please select at least one languages."),
});

const Profile = ({ getAllData, doctorDetails }) => {
  const dispatch = useDispatch();
  const [listOpen, setListOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState({ is: false, id: null });

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
    setError,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: doctorDetails?.profile || {},
  });

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toastMessage("error", "No file selected.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toastMessage("error", "Please upload a valid image file (JPEG or PNG).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toastMessage("error", "File size exceeds the 4MB limit.");
      return;
    }

    setSelectedFile(file);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await callPostApi("user/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res?.data?.location) {
        throw new Error("Invalid response from server.");
      }

      const updateRes = await callPutApi(`/user/update/${doctorDetails?._id}`, {
        coverImage: res.data.location,
        fileKey: res.data.key,
      });
      console.log(updateRes);
      if (updateRes?.status) {
        getAllData("/user");
        dispatch(userProfile());
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toastMessage("error", "File upload failed. Please try again.");
    }
  };

  const handleProfileRemove = async (e) => {
    try {
      setLoading(true);
      const updateRes = await callDeleteApi(
        `/user/delete-dp/${doctorDetails._id}`
      );
      if (updateRes?.status) {
        setLoading(false);
        setIsOpen({ is: false, id: null });
        setSelectedFile(null);
        getAllData("/user");
        dispatch(userProfile());
      }
    } catch (error) {
      setLoading(false);

      console.error("Upload failed:", error);
      toastMessage("error", "File upload failed. Please try again.");
    }
  };

  const onSubmit = async (value) => {
    try {
      let updatedData = {
        firstName: watch("firstName"),
        lastName: watch("lastName"),
        displayName: watch("displayName"),
        designation: watch("designation"),
        phoneNumber: watch("phoneNumber"),
        email: watch("email"),
        languages: watch("languages"),
      };
      setLoading(true);
      const verifyResponse = await callPutApi(
        `/doctor/${doctorDetails?._id}`,
        updatedData
      );

      if (!verifyResponse.status) throw new Error(verifyResponse.message);
      setLoading(false);
      toastMessage("success", "Profile is updated successfully.");
      await getAllData("/user");
      const userProfile = getLocalStorage(STORAGE.USER_KEY);
      let profile = userProfile.profile;

      let updatedStorage = {
        ...userProfile,
        name: watch("firstName"),
        phoneNumber: watch("phoneNumber"),
        email: watch("email"),
        profile: {
          ...profile,
          ...updatedData,
        },
      };

      setLocalStorage(STORAGE.USER_KEY, updatedStorage);
    } catch (error) {
      setLoading(false);
      toastMessage("error", "Availability update process failed!");
    }
  };

  useEffect(() => {
    if (doctorDetails?.profile) {
      reset(doctorDetails?.profile);
    }
  }, [doctorDetails, reset]);

  const handleSelect = (e) => {
    let selectedLanguage = e.target.value;
    let currentLanguages = watch("languages") || [];

    let updatedLanguages = currentLanguages.includes(selectedLanguage)
      ? currentLanguages.filter((lang) => lang !== selectedLanguage)
      : [...currentLanguages, selectedLanguage];

    setValue("languages", updatedLanguages);
    setError("languages", null);
  };

  const handleRemove = (key) => {
    let currentLanguages = watch("languages") || [];
    let updatedLanguages = currentLanguages.filter((lang) => lang !== key);

    setValue("languages", updatedLanguages);
  };

  return (
    <div>
      {" "}
      <div className="dashboard-header">
        <h3>Profile Settings</h3>
      </div>
      <div className="setting-title">
        <h5>Profile</h5>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="setting-card">
          <div className="change-avatar img-upload">
            <div className="profile-img">
              {doctorDetails?.coverImage ? (
                <img src={doctorDetails?.coverImage} alt="Profile Preview" />
              ) : selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Profile Preview"
                />
              ) : (
                <i className="fa-solid fa-file-image"></i>
              )}
            </div>
            <div className="upload-img">
              <h5>Profile Image</h5>
              <div className="imgs-load d-flex align-items-center">
                <div className="change-photo" style={{ cursor: "pointer" }}>
                  Upload New
                  <input
                    type="file"
                    className="upload cursor-pointer"
                    style={{ cursor: "pointer" }}
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </div>
                <div
                  onClick={() => setIsOpen({ is: true })}
                  className="upload-remove "
                  style={{ cursor: "pointer" }}
                >
                  Remove
                </div>
              </div>
              <p className="form-text">
                Your Image should Below 4 MB, Accepted format jpg,png,svg
              </p>
            </div>
          </div>
        </div>
        <div className="setting-title">
          <h5>Information</h5>
        </div>
        <div className="setting-card">
          <Row>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  First Name <span className="text-danger">*</span>
                </label>
                <Controller
                  name="firstName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="First Name"
                    />
                  )}
                />
                <p className="text-danger">{errors?.firstName?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Last Name <span className="text-danger">*</span>
                </label>
                <Controller
                  name="lastName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Last Name"
                    />
                  )}
                />
                <p className="text-danger">{errors.lastName?.message}</p>{" "}
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Display Name
                  {/* <span className="text-danger">*</span> */}
                </label>
                <Controller
                  name="displayName"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Display Name"
                    />
                  )}
                />
                <p className="text-danger">{errors.displayName?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Designation <span className="text-danger">*</span>
                </label>
                <Controller
                  name="designation"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      placeholder="Designation"
                      className="form-control"
                    />
                  )}
                />
                <p className="text-danger">{errors.designation?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Phone Numbers <span className="text-danger">*</span>
                </label>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      className="form-control"
                      placeholder="Phone number"
                    />
                  )}
                />
                <p className="text-danger">{errors.phoneNumber?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">
                  Email Address
                  {/* <span className="text-danger">*</span> */}
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="email"
                      placeholder="Email address"
                      className="form-control"
                    />
                  )}
                />
                <p className="text-danger">{errors.email?.message}</p>
              </div>
            </Col>
            <Col lg="12" md="12">
              <div className="form-wrap">
                <label className="col-form-label">
                  Known Languages <span className="text-danger">*</span>
                </label>
                <div className="input-block input-block-new mb-0">
                  <div className="bootstrap-tagsinput">
                    {watch("languages")?.length > 0 ? (
                      watch("languages").map((language) => (
                        <span key={language} className="me-2">
                          <Badge pill bg="info">
                            {language}
                            <span
                              className="ms-2 cursor-pointer"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleRemove(language)}
                            >
                              X
                            </span>
                          </Badge>
                        </span>
                      ))
                    ) : (
                      <span className="text-align-start d-flex justify-content-start pt-2">
                        Select languages
                      </span>
                    )}
                    <span className="text-align-end d-flex justify-content-end pt-2">
                      {!listOpen ? (
                        <ChevronDown
                          onClick={() => setListOpen(true)}
                          style={{ cursor: "pointer" }}
                        />
                      ) : (
                        <ChevronUp
                          onClick={() => setListOpen(false)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </span>
                  </div>
                  {listOpen && (
                    <select
                      multiple
                      onChange={handleSelect}
                      className="form-control mt-2"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {LanguagesList?.map((language) => (
                        <option
                          key={language.code}
                          value={language.name}
                          style={{
                            background: watch("languages")?.includes(
                              language.name
                            )
                              ? "skyblue"
                              : "white",
                          }}
                        >
                          {language.name} - {language.localName} (
                          {language.code})
                        </option>
                      ))}
                    </select>
                  )}
                  <p className="text-danger">{errors.languages?.message}</p>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  disabled={loading}
                  className="px-5 save-btn mt-3 btn btn-primary"
                >
                  Save Changes {loading && <Spinner size={"sm"} />}
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </form>
      <DeleteModal
        loading={loading}
        type="profile"
        isOpen={isOpen?.is}
        onClose={() => setIsOpen({ is: false, id: null })}
        title="Are you sure you want to remove this profile picture ?"
        onConfirm={handleProfileRemove}
      />
    </div>
  );
};

export default Profile;
