import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { Badge, Col, Row } from "react-bootstrap";
import { ChevronDown, ChevronUp } from "react-feather";
import { Controller, useForm } from "react-hook-form";
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
  phoneNumber: yup
    .string()
    .required("Phone Number is required")
    .matches(/^[0-9]+$/, "Phone Number must be numeric"),
  email: yup.string().email("Invalid Email"),
  designation: yup.string().required("Designation is required"),
  languages: yup
    .array()
    .required("Languages is required.")
    .min(1, "Please select at least one language."),
  qualifications: yup.object().shape({
    qualification: yup.string().nullable(),
    licenseNumber: yup.string().nullable(),
    experience: yup.string().nullable(),
    description: yup.string().nullable(),
    hospitalsWorked: yup.array().of(
      yup.object().shape({
        name: yup.string().nullable(),
        designation: yup.string().nullable(),
        duration: yup.string().nullable(),
      })
    ).nullable(),
  }),
  skills: yup.array().of(yup.string()).nullable(),
  documents: yup.object().shape({
    idProof: yup.string().nullable(),
    educationCertificates: yup.string().nullable(),
    nursingLicense: yup.string().nullable(),
    policeVerification: yup.string().nullable(),
  }),
});

const Profile = ({ getAllData, nurseDetails }) => {
  const dispatch = useDispatch();
  const [listOpen, setListOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState({ is: false, id: null });
  const [skillsInput, setSkillsInput] = useState("");

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
    defaultValues: {
      firstName: nurseDetails?.profile?.firstName || '',
      lastName: nurseDetails?.profile?.lastName || '',
      displayName: nurseDetails?.profile?.displayName || '',
      designation: nurseDetails?.profile?.designation || '',
      phoneNumber: nurseDetails?.profile?.phoneNumber || '',
      email: nurseDetails?.profile?.email || '',
      languages: nurseDetails?.profile?.languages || [],
      qualifications: {
        description: nurseDetails?.profile?.qualifications?.description || '',
        licenseNumber: nurseDetails?.profile?.qualifications?.licenseNumber || '',
        experience: nurseDetails?.profile?.qualifications?.experience || '',
        hospitalsWorked: nurseDetails?.profile?.qualifications?.hospitalsWorked || []
      },
      skills: nurseDetails?.profile?.skills || [],
      documents: {
        idProof: nurseDetails?.profile?.documents?.idProof || '',
        educationCertificates: nurseDetails?.profile?.documents?.educationCertificates || '',
        nursingLicense: nurseDetails?.profile?.documents?.nursingLicense || '',
        policeVerification: nurseDetails?.profile?.documents?.policeVerification || ''
      }
    }
  });

  const formatDocumentLabel = (docType) => {
    const labels = {
      idProof: "ID Proof (Aadhaar, Passport)",
      educationCertificates: "Education Certificates",
      nursingLicense: "Nursing License / Registration",
      policeVerification: "Police Verification"
    };
    return labels[docType] || docType;
  };

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

      const updateRes = await callPutApi(`/user/update/${nurseDetails?._id}`, {
        coverImage: res.data.location,
        fileKey: res.data.key,
      });

      if (updateRes?.status) {
        getAllData("/user");
        dispatch(userProfile());
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toastMessage("error", "File upload failed. Please try again.");
    }
  };

  const handleDocumentUpload = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) {
      toastMessage("error", "No file selected.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toastMessage("error", "Please upload a valid file (JPEG, PNG, JPG, or PDF).");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toastMessage("error", "File size exceeds the 4MB limit.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await callPostApi("user/upload-file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res?.data?.location) {
        throw new Error("Invalid response from server.");
      }

      setValue(`documents.${docType}`, res.data.location);
      toastMessage("success", `${formatDocumentLabel(docType)} uploaded successfully!`);

    } catch (error) {
      console.error("Upload failed:", error);
      toastMessage("error", `${formatDocumentLabel(docType)} upload failed. Please try again.`);
    }
  };

  const handleDocumentRemove = async (docType) => {
    try {
      setLoading(true);
      setValue(`documents.${docType}`, "");
      setLoading(false);
      toastMessage("success", `${formatDocumentLabel(docType)} removed successfully.`);
    } catch (error) {
      setLoading(false);
      console.error("Remove failed:", error);
      toastMessage("error", `Failed to remove ${formatDocumentLabel(docType)}.`);
    }
  };

  const handleProfileRemove = async (e) => {
    try {
      setLoading(true);
      const updateRes = await callDeleteApi(
        `/user/delete-dp/${nurseDetails._id}`
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
        qualifications: {
          qualification: watch("qualifications.qualification"),
          licenseNumber: watch("qualifications.licenseNumber"),
          experience: watch("qualifications.experience"),
          description: watch("qualifications.description"),
          hospitalsWorked: [
            {
              name: watch("qualifications.hospitalsWorked[0].name") || "",
              designation: watch("qualifications.hospitalsWorked[0].designation") || "",
              duration: watch("qualifications.hospitalsWorked[0].duration") || "",
            },
          ],
        },
        skills: watch("skills") || [],
        documents: watch("documents"),
      };
  
      console.log("Submitting data:", JSON.stringify(updatedData, null, 2)); // Debug log
  
      setLoading(true);
      const verifyResponse = await callPutApi(
        `/nurse/${nurseDetails?._id}`,
        updatedData
      );
  
      if (!verifyResponse.status) throw new Error(verifyResponse.message);
      setLoading(false);
      toastMessage("success", "Profile updated successfully.");
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
      console.error("Profile update error:", error);
      toastMessage("error", "Profile update failed!");
    }
  };

  useEffect(() => {
    if (nurseDetails?.profile) {
      reset({
        firstName: nurseDetails.profile.firstName || "",
        lastName: nurseDetails.profile.lastName || "",
        displayName: nurseDetails.profile.displayName || "",
        designation: nurseDetails.profile.designation || "",
        phoneNumber: nurseDetails.profile.phoneNumber || "",
        email: nurseDetails.profile.email || "",
        languages: nurseDetails.profile.languages || [],
        qualifications: {
          qualification: nurseDetails.profile.qualifications?.qualification || "",
          licenseNumber: nurseDetails.profile.qualifications?.licenseNumber || "",
          experience: nurseDetails.profile.qualifications?.experience || "",
          description: nurseDetails.profile.qualifications?.description || "",
          hospitalsWorked: nurseDetails.profile.qualifications?.hospitalsWorked?.length > 0
            ? nurseDetails.profile.qualifications.hospitalsWorked
            : [{ name: "", designation: "", duration: "" }],
        },
        skills: nurseDetails.profile.skills || [],
        documents: {
          idProof: nurseDetails.profile.documents?.idProof || "",
          educationCertificates: nurseDetails.profile.documents?.educationCertificates || "",
          nursingLicense: nurseDetails.profile.documents?.nursingLicense || "",
          policeVerification: nurseDetails.profile.documents?.policeVerification || "",
        },
      });
      // Set skillsInput to display as comma-separated string
      setSkillsInput(nurseDetails.profile.skills?.join(", ") || "");
    }
  }, [nurseDetails, reset]);

  useEffect(() => {
    const skills = watch("skills");
    if (skills && skills.length > 0) {
      setSkillsInput(skills.join(", "));
    } else {
      setSkillsInput("");
    }
  }, [watch("skills")]);

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setSkillsInput(value); // Update the textarea display value
  
    // Split by commas, trim whitespace, and filter out empty strings
    const skillsArray = value
      .split(",")
      .map(skill => skill.trim())
      .filter(skill => skill !== "");
  
    setValue("skills", skillsArray); // Update form state with array
  };

  const addSkill = (skill) => {
    if (skill && skill.trim() !== "") {
      const currentSkills = watch("skills") || [];
      if (!currentSkills.includes(skill.trim())) {
        setValue("skills", [...currentSkills, skill.trim()]);
      }
    }
  };
  
  const removeSkill = (skillToRemove) => {
    const currentSkills = watch("skills") || [];
    const updatedSkills = currentSkills.filter(skill => skill !== skillToRemove);
    setValue("skills", updatedSkills);
  };

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
              {nurseDetails?.coverImage ? (
                <img src={nurseDetails?.coverImage} alt="Profile Preview" style={{  width: '120px', height: '120px', objectFit: 'cover' }} />
              ) : selectedFile ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Profile Preview"
                  style={{ borderRadius: '50%', width: '120px', height: '120px', objectFit: 'cover' }}
                />
              ) : (
                <i className="fa-solid fa-file-image"></i>
              )}
            </div>
            <div className="upload-img">
              <h5>Profile Image</h5>
              <div className="imgs-load d-flex align-items-center">
                <label className="change-photo" style={{ cursor: "pointer" }}>
                  Upload New
                  <input
                    type="file"
                    className="upload cursor-pointer"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handlePhotoChange}
                  />
                </label>
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
                <p className="text-danger">{errors.lastName?.message}</p>
              </div>
            </Col>
            <Col lg="4" md="6">
              <div className="form-wrap">
                <label className="col-form-label">Display Name</label>
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
                <label className="col-form-label">Email Address</label>
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
            </Col>
          </Row>
        </div>

        {/* Professional Details Section */}
        <div className="setting-title mt-4">
  <h5>Professional Details</h5>
</div>
<div className="setting-card">
  <Row>
    <Col lg="4" md="6">
      <div className="form-wrap">
        <label className="col-form-label">Qualification</label>
        <Controller
          name="qualifications.qualification"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="form-control"
              placeholder="e.g. B.Sc Nursing"
            />
          )}
        />
      </div>
    </Col>

    <Col lg="4" md="6">
      <div className="form-wrap">
        <label className="col-form-label">License Number</label>
        <Controller
          name="qualifications.licenseNumber"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="form-control"
              placeholder="If have"
            />
          )}
        />
      </div>
    </Col>

    <Col lg="4" md="6">
      <div className="form-wrap">
        <label className="col-form-label">Experience</label>
        <Controller
          name="qualifications.experience"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="form-control"
              placeholder="e.g. 5+ years"
            />
          )}
        />
      </div>
    </Col>

    <Col lg="4" md="6">
      <div className="form-wrap">
        <label className="col-form-label">Hospital Name</label>
        <Controller
          name="qualifications.hospitalsWorked[0].name"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="form-control"
              placeholder="Hospital Name"
            />
          )}
        />
      </div>
    </Col>

    <Col lg="4" md="6">
      <div className="form-wrap">
        <label className="col-form-label">Designation at Hospital</label>
        <Controller
          name="qualifications.hospitalsWorked[0].designation"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="form-control"
              placeholder="e.g. Staff Nurse"
            />
          )}
        />
      </div>
    </Col>

    <Col lg="4" md="6">
      <div className="form-wrap">
        <label className="col-form-label">Duration at Hospital</label>
        <Controller
          name="qualifications.hospitalsWorked[0].duration"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="form-control"
              placeholder="e.g. 2 years"
            />
          )}
        />
      </div>
    </Col>

    <Col lg="6" md="6">
      <div className="form-wrap">
        <label className="col-form-label">Specializations</label>
        <Controller
          name="qualifications.description"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              className="form-control"
              placeholder="e.g. Critical care, patient monitoring"
            />
          )}
        />
      </div>
    </Col>

    <Col lg="12" md="12">
  <div className="form-wrap">
    <label className="col-form-label">Skills & Services Offered</label>
    <Controller
      name="skills"
      control={control}
      render={({ field }) => (
        <textarea
          value={skillsInput}
          onChange={handleSkillsChange}
          className="form-control"
          placeholder="Monitoring vitals, Elderly support, Feeding, Bathing, Toileting etc."
          rows="3"
        />
      )}
    />
  </div>
</Col>
  </Row>
</div>


        {/* Documents Upload Section */}
        <div className="setting-title mt-4">
  <h5>Documents Upload</h5>
</div>
<div className="setting-card">
  <Row>
    {['idProof', 'educationCertificates', 'nursingLicense', 'policeVerification'].map((docType, index) => (
      <Col lg="6" md="6" key={docType} className="mb-4">
        <div className="change-avatar img-upload">
          <div className="profile-img document-icon">
            {watch(`documents.${docType}`) ? (
              <a href={watch(`documents.${docType}`)} target="_blank" rel="noopener noreferrer">
                <i className="fa-solid fa-file-lines"></i>
              </a>
            ) : (
              <i className="fa-solid fa-file-upload"></i>
            )}
          </div>
          <div className="upload-img">
            <h5>{formatDocumentLabel(docType)}</h5>
            <div className="imgs-load d-flex align-items-center">
              {watch(`documents.${docType}`) ? (
                <button
                  type="button"
                  onClick={() => handleDocumentRemove(docType)}
                  className="upload-remove btn btn-sm btn-outline-danger"
                  disabled={loading}
                >
                  Remove
                </button>
              ) : (
                <label className="change-photo" style={{ cursor: "pointer" }}>
                  Upload New
                  <input
                    type="file"
                    className="upload cursor-pointer"
                    style={{ cursor: "pointer" }}
                    accept="image/*,.pdf"
                    onChange={(e) => handleDocumentUpload(e, docType)}
                    disabled={loading}
                  />
                </label>
              )}
            </div>
            <p className="form-text">
              Max size 4MB. Accepted formats: jpg, png, pdf.
            </p>
          </div>
        </div>
      </Col>
    ))}
  </Row>
</div>



        <div className="d-flex justify-content-end">
          <button
            disabled={loading}
            className="px-5 save-btn mt-3 btn btn-primary"
          >
            Save Changes {loading && <Spinner size={"sm"} />}
          </button>
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