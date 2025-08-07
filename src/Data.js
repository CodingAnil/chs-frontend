import cat_1 from "../src/assets/img/doctor-07.jpg";
import cat_2 from "../src/assets/img/img-pharmacy1.jpg";
import cat_3 from "../src/assets/img/hospital.png";
import video_call from "../src/assets/img/video_call.png";
import lab_test from "../src/assets/img/lab_test.jpg";
import doctor_1 from "../src/assets/img/doctor-01.jpg";
import doctor_2 from "../src/assets/img/doctor-02.jpg";
import doctor_3 from "../src/assets/img/doctor-03.jpg";
import doctor_4 from "../src/assets/img/doctor-04.jpg";
import feature_img1 from "../src/assets/img/clinic-7.jpg";
import feature_img2 from "../src/assets/img/clinic-8.jpg";
import feature_img3 from "../src/assets/img/clinic-9.jpg";
import feature_img4 from "../src/assets/img/clinic-10.jpg";
import feature_img5 from "../src/assets/img/clinic-6.jpg";
import browsecat_1 from "../src/assets/img/deals-01.png";
import browsecat_2 from "../src/assets/img/deals-02.png";
import browsecat_3 from "../src/assets/img/deals-03.png";
import browsecat_4 from "../src/assets/img/deals-04.png";
import browsecat_5 from "../src/assets/img/deals-05.png";
import browsecat_6 from "../src/assets/img/deals-06.png";
import browsecat_7 from "../src/assets/img/deals-07.png";
import browsecat_8 from "../src/assets/img/deals-08.png";
import about_img1 from "../src/assets/img/about-img1.jpg";
import about_img2 from "../src/assets/img/about-img2.jpg";
import about_img3 from "../src/assets/img/about-img3.jpg";
import phone_icon from "../src/assets/img/icons/phone-icon.svg";
import work_icon1 from "../src/assets/img/icons/work-01.svg";
import work_icon2 from "../src/assets/img/icons/work-02.svg";
import work_icon3 from "../src/assets/img/icons/work-03.svg";
import work_icon4 from "../src/assets/img/icons/work-04.svg";
import popularcat_img1 from "../src/assets/img/categorie-01.png";
import popularcat_img2 from "../src/assets/img/categorie-02.png";
import popularcat_img3 from "../src/assets/img/categorie-03.png";
import popularcat_img4 from "../src/assets/img/categorie-04.png";
import popularcat_img5 from "../src/assets/img/categorie-05.png";
import popularcat_img6 from "../src/assets/img/categorie-06.png";
import popularcat_img7 from "../src/assets/img/categorie-08.png";
import product_img1 from "../src/assets/img/1.png";
import product_img2 from "../src/assets/img/2.png";
import product_img3 from "../src/assets/img/3.png";
import product_img4 from "../src/assets/img/4.png";
import product_img5 from "../src/assets/img/5.png";
import product_img6 from "../src/assets/img/6.png";
import product_img7 from "../src/assets/img/7.png";
import product_img8 from "../src/assets/img/8.png";
import popularcat_img9 from "../src/assets/img/categorie-11.png";
import popularcat_img10 from "../src/assets/img/categorie-12.png";
import pharmacy_banner1 from "../src/assets/img/product-16.png";
import pharmacy_banner2 from "../src/assets/img/product-17.png";
import pharmacy_banner3 from "../src/assets/img/product-18.png";
import service_desc_img1 from "../src/assets/img/services/virutal_call.png";
import service_desc_img2 from "../src/assets/img/services/appointment.png";
import service_desc_img3 from "../src/assets/img/services/prescription.png";
import service_desc_img4 from "../src/assets/img/services/lab_test.png";
import service_desc_img5 from "../src/assets/img/services/pharmacy_service.png";
import service_desc_img6 from "../src/assets/img/services/diagonsis.png";
import blogimg_1 from "../src/assets/img/blogs/blog-1.jpg";
import blogimg_2 from "../src/assets/img/blogs/blog-2.jpg";
import blogimg_3 from "../src/assets/img/blogs/blog-3.jpg";
import blogimg_4 from "../src/assets/img/blogs/blog-4.jpg";

export const Navbar = [
  {
    id: 1,
    menu_name: "Home",
    path: "/",
  },
  {
    id: 2,
    menu_name: "Doctors",
    path: "/doctorlist", // Update with correct path
  },
  // {
  //   id: 3,
  //   menu_name: 'Patients',
  //   path: '/patient', // Update with correct path
  // },
  {
    id: 4,
    menu_name: "Pharmacy",
    path: "/pharmacy",
    submenu: [
      {
        id: 1,
        menu_name: "Direct Consumer",
        path: "/pharmacy",
      },
      {
        id: 2,
        menu_name: "Wholesale",
        path: "/pharmacy?key=Wholesale",
      },
    ],
  },
  {
    id: 7,
    menu_name: "Services",
    path: "/services", // Update with correct path
    submenu: [
      {
        id: 1,
        menu_name: "Virtual Consultations",
        path: "/VirtualConsultation",
      },
      {
        id: 2,
        menu_name: "Appointment Scheduling",
        path: "/bookappointment",
      },
      {
        id: 3,
        menu_name: "Prescription Refills",
        path: "/PrescriptionRefills",
      },
      {
        id: 4,
        menu_name: "Lab Test Results",
        path: "/LabTest",
      },
      {
        id: 5,
        menu_name: "Pharmacy Services",
        path: "/Pharmacy",
      },
      {
        id: 6,
        menu_name: "Diagnostics Services",
        path: "/Diagnostics",
      },
      {
        id: 7,
        menu_name: "Membership",
        path: "/subscription-plans",
      },
    ],
  },
  {
    id: 6,
    menu_name: "About Us",
    path: "/about", // Update with correct path
  },
  {
    id: 7,
    menu_name: "Contact Us",
    path: "/contact", // Update with correct path
  },
  {
    id: 8,
    menu_name: "Career",
    path: "/career", // Update with correct path
  },
  {
    id: 9,
    menu_name: "Investor",
    path: "/InvestorRegistration", // Update with correct path
  },
];

export const cardData = [
  {
    id: 1,
    imageSrc: cat_1,
    alt: "doctor-image",
    title: "Visit a Doctor",
    link: "/",
    buttonText: "Book Now",
  },
  {
    id: 2,
    imageSrc: cat_2,
    alt: "pharmacy-image",
    title: "Find a Pharmacy",
    link: "/",
    buttonText: "Find Now",
  },
  {
    id: 3,
    imageSrc: video_call,
    alt: "video-call",
    title: "Video Consultation",
    link: "#",
    buttonText: "Call Now",
  },
  {
    id: 4,
    imageSrc: cat_3,
    alt: "lab-image",
    title: "Find a Hospital",
    link: "#",
    buttonText: "Coming Soon",
  },
  {
    id: 5,
    imageSrc: lab_test,
    alt: "lab-image",
    title: "Lab Test",
    link: "#",
    buttonText: "Coming Soon",
  },
];

export const about_details = () => {
  const dynamicData = {
    images: ["path/to/img1.jpg", "path/to/img2.jpg", "path/to/img3.jpg"],
    experience: "Over 25+ Years Experience",
    header: "About Our Company",
    content: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Sed ut perspiciatis unde omnis iste natus sit voluptatem accusantium doloremque eaque ipsa quae architecto beatae vitae dicta sunt explicabo.",
    ],
    emergencyNumber: "+91 1800******",
  };
};

// Sample data for doctors
export const doctorsData = [
  {
    id: 1,
    name: "Dr. Ruby Perrin",
    specialty: "BDS, MDS - Oral & Maxillofacial Surgery",
    location: "Georgia, USA",
    consultations: 450,
    img: doctor_1,
  },
  {
    id: 2,
    name: "Dr. Perrin",
    specialty: "Maxillofacial Surgery",
    location: "India",
    consultations: 450,
    img: doctor_2,
  },
  {
    id: 2,
    name: "Dr. Perrin",
    specialty: "Maxillofacial Surgery",
    location: "India",
    consultations: 450,
    img: doctor_3,
  },
  {
    id: 2,
    name: "Dr. Perrin",
    specialty: "Maxillofacial Surgery",
    location: "India",
    consultations: 450,
    img: doctor_4,
  },
  {
    id: 1,
    name: "Dr. Ruby Perrin",
    specialty: "BDS, MDS - Oral & Maxillofacial Surgery",
    location: "Georgia, USA",
    consultations: 450,
    img: doctor_1,
  },
  // Add more doctor data as needed
];

export const responsiveOptions = {
  0: {
    items: 1,
  },
  600: {
    items: 2,
  },
  1000: {
    items: 4,
  },
};

export const responsiveCategory = {
  0: {
    items: 2,
  },
  600: {
    items: 4,
  },
  1000: {
    items: 7,
  },
};

// Sample data for features carousel

// Sample data for doctors
export const featuresData = [
  {
    id: 1,
    name: "Medical",
    feature_img: feature_img1,
  },
  {
    id: 2,
    name: "Patient Ward",
    feature_img: feature_img2,
  },
  {
    id: 3,
    name: "Test Rom",
    feature_img: feature_img3,
  },
  {
    id: 4,
    name: "ICU",
    feature_img: feature_img4,
  },
  {
    id: 1,
    name: "Operation",
    feature_img: feature_img5,
  },
  {
    id: 6,
    name: "Medical",
    feature_img: feature_img1,
  },
  // Add more doctor data as needed
];

// Browse category data

export const BrowseCategoryData = [
  // {
  //     id: 1,
  //     name: 'Diabetes',
  //     number: 124,
  //     img:browsecat_1,
  // },
  {
    id: 2,
    name: "Personal Care",
    number: 124,
    img: browsecat_2,
  },
  // {
  //   id: 3,
  //   name: 'Stomach Care',
  //   number: 124,
  //   img:browsecat_3,
  // },
  {
    id: 4,
    name: "Ayurvedic Care",
    number: 124,
    type: "Doctor",
    img: browsecat_4,
  },
  {
    id: 5,
    name: "Home Care",
    number: 124,
    type: "Doctor",
    img: browsecat_5,
  },
  {
    id: 6,
    name: "Nutrition and Fitness Supplements",
    number: 124,
    type: "Doctor",
    img: browsecat_6,
  },
  {
    id: 7,
    name: "Mother and Baby Care",
    number: 124,
    type: "Doctor",
    img: browsecat_7,
  },
  {
    id: 8,
    name: "Healthcare Devices",
    number: 124,
    type: "Doctor",
    img: browsecat_8,
  },
  // Add more data as needed
];

// About data

// aboutData.js
export const aboutData = {
  images: {
    about_img1: about_img1,
    about_img2: about_img2,
    about_img3: about_img3,
    phone_icon: phone_icon,
    // ... add more images as needed
  },
  title: "Know About Us",
  experienceHeader: "WHO WE ARE",
  mainHeader: "EMPOWERING HEALTH, TRANSFORMING LIVES",
  content:
    "At CareSmart, we believe that healthcare should be accessible, efficient, and compassionate. Our mission is to revolutionize the way healthcare is delivered, bridging gaps and empowering patients, doctors, and caregivers alike. Welcome to a smarter, healthier world!",
  emergencyNumber: "+91 1800******",
};

// how it works

export const Howitworks = [
  {
    id: 1,
    main_heading: "Identify Your Needs",
    content:
      "Clearly define the healthcare challenges or requirements you are looking to address.",
    icon: work_icon1,
  },
  {
    id: 2,
    main_heading: "Research Available Solutions",
    content:
      "Look for solutions that align with your identified needs and provide the required features.",
    icon: work_icon2,
  },
  {
    id: 3,
    main_heading: "Evaluate Options",
    content:
      "Compare different healthcare solutions based on factors such as functionality, scalability, user-friendliness, and cost.",
    icon: work_icon3,
  },
  {
    id: 4,
    main_heading: "Consult with Experts",
    content:
      "Seek advice from healthcare IT professionals or consultants who specialize in healthcare technology.em",
    icon: work_icon4,
  },
];

export const PopularCategoryData = [
  {
    id: 1,
    number: 20,
    category_name: "Ayush",
    img: popularcat_img1,
  },
  {
    id: 2,
    number: 20,
    category_name: "Covid Essentials",
    img: popularcat_img2,
  },
  {
    id: 3,
    number: 20,
    category_name: "Devices",
    img: popularcat_img3,
  },
  {
    id: 4,
    number: 20,
    category_name: "Glucometers",
    img: popularcat_img4,
  },
  {
    id: 5,
    number: 20,
    category_name: "Eye Glasses",
    img: popularcat_img5,
  },
  {
    id: 6,
    number: 20,
    category_name: "Weight",
    img: popularcat_img6,
  },
  {
    id: 7,
    number: 20,
    category_name: "Baby Care",
    img: popularcat_img7,
  },
  // {
  //   id:8,
  //   number:20,
  //   category_name:'Home & Health',
  //   img:popularcat_img8,
  // },
  {
    id: 9,
    number: 20,
    category_name: "Hands & Feet",
    img: popularcat_img9,
  },
  {
    id: 10,
    number: 20,
    category_name: "Oral Care",
    img: popularcat_img10,
  },
  {
    id: 1,
    number: 20,
    category_name: "Ayush",
    img: popularcat_img1,
  },
  {
    id: 2,
    number: 20,
    category_name: "Devices",
    img: popularcat_img3,
  },
];

//Breadcrumb Data
export const BlogData = [
  {
    id: 1,
    blog_img: blogimg_1,
    user_name: "Admin",
    date: "13 Aug, 2023",
    blog_heading: "Navigating Telehealth: A Guide to Virtual Healthcare Visits",
    blog_desc:
      "Explore the benefits & challenges of virtual healthcare appointments, along with tips for...",
  },
  {
    id: 2,
    blog_img: blogimg_2,
    user_name: "Admin",
    date: "13 Aug, 2024",
    blog_heading: "Work-Life Harmony: Balancing Career and Personal Wellness",
    blog_desc:
      "Uncover strategies to achieve a harmonious balance between professional commitments and ...",
  },
  {
    id: 3,
    blog_img: blogimg_3,
    user_name: "Admin",
    date: "13 Dec, 2023",
    blog_heading: "Sleep Solutions: Unveiling the Secrets to a Restful Night",
    blog_desc:
      "Explore importance of quality sleep & learn tips to improve your sleep, ensuring you wake up ....",
  },
  {
    id: 4,
    blog_img: blogimg_4,
    user_name: "Admin",
    date: "13 Feb, 2023",
    blog_heading:
      "Mental Wellness in a Digital Age: Strategies for a Healthy Mind Online",
    blog_desc:
      "Delve into the impact of digital life on mental health & discover practical strategies to maintain ...",
  },
];

export const PharmacyBanner = [
  {
    id: 1,
    img: pharmacy_banner1,
    heading: "10% Cashback on Dietary Suppliments",
    content: "Code: CARE12",
    button_text: "Shop Now",
    link: "/",
  },
  {
    id: 2,
    img: pharmacy_banner2,
    heading: "Say yes to New Throat Freshner",
    content: "Refresh your day the fruity way",
    button_text: "Shop Now",
    link: "/",
  },
  {
    id: 3,
    img: pharmacy_banner3,
    heading: "Get a Product Worth 1000 in a Pack",
    content: "Code: CARE12",
    button_text: "Shop Now",
    link: "/",
  },
];

export const PharmacyProduct = [
  {
    id: 1,
    img: product_img1,
    product_cat: "Home & Health",
    product_name: "Echinacea",
    quantity: "100ml",
    price: 500,
    discount_price: 600,
  },
  {
    id: 2,
    img: product_img2,
    product_cat: "Home & Health",
    product_name: "Echinacea",
    quantity: "100ml",
    price: 500,
    discount_price: 600,
  },
  {
    id: 3,
    img: product_img3,
    product_cat: "Home & Health",
    product_name: "Echinacea",
    quantity: "100ml",
    price: 500,
    discount_price: 600,
  },
  {
    id: 4,
    img: product_img4,
    product_cat: "Home & Health",
    product_name: "Echinacea",
    quantity: "100ml",
    price: 500,
    discount_price: 600,
  },
  {
    id: 5,
    img: product_img5,
    product_cat: "Home & Health",
    product_name: "Echinacea",
    quantity: "100ml",
    price: 500,
    discount_price: 600,
  },
  {
    id: 6,
    img: product_img6,
    product_cat: "Home & Health",
    product_name: "Echinacea",
    quantity: "100ml",
    price: 500,
    discount_price: 600,
  },
  {
    id: 7,
    img: product_img7,
    product_cat: "Home & Health",
    product_name: "Echinacea",
    quantity: "100ml",
    price: 500,
    discount_price: 600,
  },
  {
    id: 8,
    img: product_img8,
    product_cat: "Home & Health",
    product_name: "Echinacea",
    quantity: "100ml",
    price: 500,
    discount_price: 600,
  },
];

// Service Description Home Page

export const ServiceDescriptionData = [
  {
    id: 1,
    service_desc_img: service_desc_img1,
    service_heading: "Virtual Consultations",
    service_desc:
      "Your Doctor Is In. Lucknow. Skip traffic, waiting rooms & germs. Secure video visits with top specialists – from your couch. Prescriptions & care plans included.",
    path: "/VirtualConsultation",
  },
  {
    id: 2,
    service_desc_img: service_desc_img2,
    service_heading: "Appointment Scheduling",
    service_desc:
      "Booked in 60 Seconds. Seriously. No calls. No hold music. See real-time slots, pick your perfect time & get reminders. Health shouldn't be a hassle.",
    path: "/doctorlist",
  },
  {
    id: 3,
    service_desc_img: service_desc_img5,
    service_heading: "24×7 Pharmacy Services",
    service_desc:
      "Medication Emergencies Don't Wait. Neither Do We. Refill at midnight? Sudden fever? We're open 24/7 with meds delivered or ready for pickup. Sleep easy.",
    path: "/Pharmacy",
  },
  {
    id: 4,
    service_desc_img: service_desc_img4,
    service_heading: "Lab Test & Results",
    service_desc:
      "Test Today. Know Tomorrow. No more nail-biting waits. Get painless blood draws & digital results before lunch. Your health insights, accelerated.",
    path: "/LabTest",
  },
  {
    id: 5,
    service_desc_img: service_desc_img6,
    service_heading: "Diagnostic Services",
    service_desc:
      "See What's Beneath the Surface. Advanced MRI/X-Ray/CT scans with same-day analysis. Clarity without delay – so you can move forward faster.",
    path: "/Diagnostics",
  },
  {
    id: 6,
    service_desc_img: service_desc_img3,
    service_heading: "Other Services",
    service_desc:
      "Stop Treating Symptoms. Start Building Resilience. Personalized nutrition, mental health & prevention plans. Thrive – don't just survive.",
    path: "/services",
  },
];

