import React from "react";
import { BrowserRouter, Route, Routes as Routing } from "react-router-dom";
import PatientDashboard from "../pages/patient";
import DoctorProfile from "../pages/doctorProfile/DoctorProfile";
import NurseProfile from "../pages/NurseProfile/NurseProfile";
import DoctorDashboard from "../pages/doctorDashboard/DoctorDashboard";
import Pharmacy from "../pages/pharmacy/Pharmacy";
import ProductDesc from "../components/pharmacy/ProductDesc";
import Cart from "../components/pharmacy/Cart";
import Checkout from "../components/pharmacy/Checkout";
import OrderSuccess from "../components/pharmacy/OrderSuccess";
import Login from "../pages/auth/Login";
import DoctorRegister from "../pages/auth/DoctorRegister";
import Home from "../pages/home/Home";
import { ROLES, STORAGE } from "../constants";
import ProtectedRoute from "./ProtectedRoute";
import NotFoundPage from "../components/common/notFoundPage";
import ForgotPassword from "../pages/auth/forgot-password";
import ResetPassword from "../pages/auth/reset-password";
import About from "../pages/about/About";
import Contact from "../pages/contact/Contact";
import DoctorList from "../pages/doctorList/DoctorList";
import BookAppointment from "../pages/bookAppointment/BookAppointment";
import BookingSuccess from "../pages/BookingSuccess/BookingSuccess";
import VirtualConsultation from "../pages/services/VirtualConsultation";
import DoctorBooking from "../pages/doctorBooking";
import Career from "../pages/career/Career";
import InvestorRegistration from "../pages/investor/InvestorRegistration";
import Appointments from "../pages/doctorDashboard/appoitments";
import PrescriptionRefills from "../pages/services/PrescriptionRefills";
import LabTest from "../pages/services/LabTest";
import Diagnostics from "../pages/services/Diagnostics";
import PublicRoute from "./PublicRoute";
import VerifyOtp from "../pages/auth/verifyOtp";
import PrivacyPolicy from "../components/static/privacyPolicy";
import TermsAndConditions from "../components/static/TermsAndConditions";
import CancellationRefundPolicy from "../components/static/CancellationRefundPolicy";
import ShippingDeliveryPolicy from "../components/static/ShippingDeliveryPolicy";
import ScrollToTop from "../components/common/scrolltoTop";
import CallHandler from "../components/twillio/CallHandler";
// import VideoCall from "../components/twillio/VideoCall";
import { getLocalStorage } from "../helpers/storage";
import TwillioCall from "../components/twillio/video";
import OrderDetails from "../pages/patient/OrderDetails";
import PathologyDashboard from "../pages/PathologyDashboard/PathologyDashboard";
import SubscriptionPlans from "../pages/subscription/SubscriptionPlans";
import NurseDashboard from "../pages/NurseDashboard/NurseDashboard";
import NurseBooking from "../pages/NurseBooking/NurseBooking";
import PathologyBooking from "../pages/PathologyBooking/PathologyBooking";
import PathologyProfile from "../pages/PathologyProfile/PathologyProfile";
import AmbulanceBooking from "../pages/AmbulanceBooking/AmbulanceBooking";
import BiomedicalBooking from "../pages/BiomedicalBooking/BiomedicalBooking";
import HospitalBooking from "../pages/HospitalBooking/HospitalBooking";
import AmbulanceDashboard from "../pages/AmbulanceDashboard/AmbulanceDashboard";
import BiomedicalDashboard from "../pages/BiomedicalDashboard/BiomedicalDashboard";
import HospitalDashboard from "../pages/HospitalDashboard/HospitalDashboard";
import HospitalProfile from "../pages/HospitalProfile/HospitalProfile";
import AmbulanceProfile from "../pages/ambulanceprofile/ambulanceprofile";

const Routes = () => {
  const userData = getLocalStorage(STORAGE.USER_KEY);

  return (
    <BrowserRouter>
      {userData?.profile && userData?.role != "Doctor" && (
        <CallHandler currentUserId={userData?.profile?._id} />
      )}
      <ScrollToTop />
      <Routing>
        {/* twillio  */}

        <Route path="/video-call" element={<TwillioCall />} />
        <Route path="/audio-call" element={<TwillioCall />} />
        {/* <Route path="/chat-call" element={<ChatRoom />} /> */}

        {/* auth routes */}

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <DoctorRegister />
            </PublicRoute>
          }
        />
        <Route
          path="/verifyOtp"
          element={
            <PublicRoute>
              <VerifyOtp />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        {/* static routes */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsAndConditions />} />
        <Route path="/refund-policy" element={<CancellationRefundPolicy />} />
        <Route path="/shipping-policy" element={<ShippingDeliveryPolicy />} />
        <Route path="/contact" element={<Contact />} />

        {/* </PublicRoute> */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/VirtualConsultation" element={<VirtualConsultation />} />
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/order-details/:orderId" element={<OrderDetails />} />
        <Route path="/subscription-plans" element={<SubscriptionPlans />} />
        
        <Route path="/DoctorList" element={<DoctorList />} />
        <Route path="/bookappointment" element={<BookAppointment />} />
        <Route path="/DoctorProfile" element={<DoctorProfile />} />
        <Route path="/nurseprofile" element={<NurseProfile />} />
        <Route path="/pathologyprofile" element={<PathologyProfile />} />
        <Route path="/hospitalprofile" element={<HospitalProfile />} />
        <Route path="/ambulanceprofile" element={<AmbulanceProfile />} />
        <Route path="/nurse/appointment/:userId" element={<NurseBooking />} />

          <Route
            path="/DoctorDashboard"
            element={
              <ProtectedRoute allowedRoles={[ROLES.DOCTOR]}>
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />
        <Route path="/PathologyDashboard" element={<ProtectedRoute allowedRoles={[ROLES.PATHOLOGY]}><PathologyDashboard /></ProtectedRoute>} />
        <Route
          path="/NurseDashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.NURSING]}>
              <NurseDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AmbulanceDashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.AMBULANCE]}>
              <AmbulanceDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/BiomedicalDashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.BIOCHEMICAL]}>
              <BiomedicalDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/HospitalDashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.HOSPITAL]}>
              <HospitalDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/ProductDesc" element={<ProductDesc />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      

        <Route
          path="/DoctorBooking/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <DoctorBooking type="doctor" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/nursebooking/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <NurseBooking type="nurse" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pathologybooking/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <PathologyBooking type="pathology" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ambulancebooking/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <AmbulanceBooking type="ambulance" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/biomedicalbooking/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <BiomedicalBooking type="biomedical" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hospitalbooking/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <HospitalBooking type="hospital" />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ambulance-booking/:id"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <AmbulanceBooking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/biomedical-booking"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <BiomedicalBooking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hospital-booking"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <HospitalBooking />
            </ProtectedRoute>
          }
        />

        <Route path="/payment-status" element={<OrderSuccess />} />
        <Route
          path="/BookingSuccess"
          element={
            <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
              <BookingSuccess />
            </ProtectedRoute>
          }
        />
        <Route path="/career" element={<Career />} />
        <Route
          path="/InvestorRegistration"
          element={<InvestorRegistration />}
        />

        {/* <Route path="/Appointment" element={<Appointments />} /> */}
        <Route path="/PrescriptionRefills" element={<PrescriptionRefills />} />
        <Route path="/LabTest" element={<LabTest />} />
        <Route path="/Diagnostics" element={<Diagnostics />} />

        <Route path="/*" element={<NotFoundPage />} />
      </Routing>
    </BrowserRouter>
  );
};

export default Routes;
