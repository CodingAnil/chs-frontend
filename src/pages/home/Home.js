import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Team from "../../components/Team";
import FeatureCarousel from "../../components/FeatureCarousel";
import BrowseCategory from "../../components/BrowseCategory";
import PopularCategory from "../../components/PopularCategory";
import ServiceBanner from "../../components/ServiceBanner";
import About_Short from "../../components/About_Short";
import BookAppointment from "../../components/BookAppointment";
import Facilities from "../../components/Facilities";
import FeedbackBanner from "../../components/FeedbackBanner";
import services_img from "../../assets/img/service-img.png";
import { Container, Row, Col } from "react-bootstrap";
import CommunicationApp from "../patient/twillio/twiliocall";

export default function Home() {
  return (
    <>
      <Header />

      <ServiceBanner />
      <CommunicationApp />

      <About_Short />

      <BookAppointment />
      <Facilities />

      <section className="finent-veterinary-sec mb-4">
        <div className="floating-bg"></div>
        <Container>
          <Row>
            <Col lg="12">
              <div className="section-header-fourteen service-inner-fourteen text-center">
                <h2 className="text-center">PATIENT SERVICES</h2>
              </div>
            </Col>
            <Col lg="7">
              <div className="veterinary-care-info">
                <ul className="care-list aos" data-aos="fade-up">
                  <li>
                    <span>1</span>
                    <div className="care-list-info">
                      <h5>PATIENT REGISTRATION AND MANAGEMENT</h5>
                      <p>
                        Seamlessly onboard patients through our user-friendly
                        registration process
                      </p>
                      <p>
                        Maintain accurate records and histories for better care
                        coordination
                      </p>
                    </div>
                  </li>
                  <li>
                    <span className="active">2</span>
                    <div className="care-list-info">
                      <h5>NOTIFICATIONS AND REMINDERS</h5>
                      <p>
                        Keep patients informed about appointments, medication
                        schedules, and follow-ups
                      </p>
                      <p>Reduce no-shows and enhance patient engagement.</p>
                    </div>
                  </li>
                  <li>
                    <span>3</span>
                    <div className="care-list-info">
                      <h5>BOOKING MADE EASY</h5>
                      <p>Book appointments with just a few clicks.</p>
                      <p>
                        Choose your preferred doctor, time, and clinic—all from
                        your smartphone
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>4</span>
                    <div className="care-list-info">
                      <h5>SYMPTOM CHECKER</h5>
                      <p>
                        Worried about that persistent cough? Our AI-powered
                        symptom checker provides initial guidance.
                      </p>
                      <p>
                        Always consult a doctor, but let us help you understand
                        your symptoms better
                      </p>
                    </div>
                  </li>
                  <li>
                    <span>5</span>
                    <div className="care-list-info">
                      <h5>CHAT SUPPORT</h5>
                      <p>Have questions? Our chatbot is here to assist 24/7.</p>
                      <p>Get quick answers and guidance.</p>
                    </div>
                  </li>
                  <li>
                    <span>6</span>
                    <div className="care-list-info">
                      <h5>HOSPITALIZATION ASSISTANCE</h5>
                      <p>Need to be admitted? We streamline the process.</p>
                      <p>
                        Coordinate with hospitals and manage paperwork
                        efficiently
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </Col>
            <Col lg="5">
              <div class="sec-col-img">
                <img src={services_img} class="img-fluid" alt="Img" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* <Category/> */}
      <FeedbackBanner />

      <BrowseCategory />

      <PopularCategory />
      <FeatureCarousel />
      <Team />
      {/* <HowItWorks/> */}

      <Footer />
    </>
  );
}
