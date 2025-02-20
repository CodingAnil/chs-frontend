import React from "react";
import '../../pages/pharmacy/Pharmacy.css';
import PharmacyTopBar from "./PharmacyTopBar";
import Breadcrumb from "../Breadcrumb";
import PharmacySearchBar from "./PharmacySearchBar";
import { Button, Card, CardBody, Col, Container, Row } from "react-bootstrap";
import PharmacyMenu from "../../pages/pharmacy/PharmacyMenu";
import product_img from '../../assets/img/1.png';
import Footer from "../Footer";
import { Link } from "react-router-dom";

export default function ProductDesc() {
    return (
        <>
            <PharmacyTopBar />
            <PharmacySearchBar />
            {/* <PharmacyMenu/> */}
            <Breadcrumb />
            <div className="content">
                <Container>
                    <Row>
                        <Col md='7' lg='9' xl='9'>
                           <Card>
                                <CardBody className="product-description">
                                    <div className="doctor-widget">
                                        <div className="doc-info-left">
                                            <div className="doctor-img1">
                                                <img src={product_img} style={{height:100}} className="img-fluid" alt="User Image"/>
                                            </div>
                                            <div className="doc-info-cont product-cont">
                                                <h4 className="doc-name mb-2">Benzaxapine Croplex</h4>
                                                <p><span className="text-muted">Manufactured By </span> Hamdard (Wakf) Laboratories</p>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled</p>
                                               
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>


                            <Card>
                                <CardBody className="pt-0">
                                    <h3 className="pt-4">Product Details</h3>
                                    <hr/>
                                        <div className="tab-content pt-3">

                                            <div role="tabpanel" id="doc_overview" className="tab-pane fade show active">
                                                <div className="row">
                                                    <div className="col-md-9">

                                                        <div className="widget about-widget">
                                                            <h4 className="widget-title">Description</h4>
                                                            <p>Safi syrup is best for purifying the blood. As it contains herbal extracts it can cure indigestion, constipation, nose bleeds and acne boils. It helps in the removal of the toxins from the blood. It improves the complexion and gives you a healthy life</p>
                                                        </div>


                                                        <div className="widget awards-widget">
                                                            <h4 className="widget-title">Highlights</h4>
                                                            <div className="experience-box">
                                                                <ul className="experience-list">
                                                                    <li>
                                                                        <div className="experience-user">
                                                                            <div className="before-circle"></div>
                                                                        </div>
                                                                        <div className="experience-content">
                                                                            <div className="timeline-content">
                                                                                <p>Safi syrup is known for its best purifying syrup for blood.</p>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="experience-user">
                                                                            <div className="before-circle"></div>
                                                                        </div>
                                                                        <div className="experience-content">
                                                                            <div className="timeline-content">
                                                                                <p>It helps in eliminating the toxins from the bloodstream.</p>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="experience-user">
                                                                            <div className="before-circle"></div>
                                                                        </div>
                                                                        <div className="experience-content">
                                                                            <div className="timeline-content">
                                                                                <p>It improves digestion.</p>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div className="experience-user">
                                                                            <div className="before-circle"></div>
                                                                        </div>
                                                                        <div className="experience-content">
                                                                            <div className="timeline-content">
                                                                                <p>It also helps in indigestion and constipation.</p>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>


                                                        <div className="widget about-widget">
                                                            <h4 className="widget-title">Directions for use</h4>
                                                            <p>Adults: Take 2 tablespoons once a day in a glass full of water.</p>
                                                        </div>


                                                        <div className="widget about-widget">
                                                            <h4 className="widget-title">Storage</h4>
                                                            <p>Store this syrup at room temperature protected from sunlight, heat, and moisture. Keep away from reaching out of children and pets. Ensure that the unused medicine is disposed of properly.</p>
                                                        </div>


                                                        <div className="widget about-widget">
                                                            <h4 className="widget-title">Administration Instructions</h4>
                                                            <p>Shake the bottle before its use. This syrup can be taken with or without food. The quantity consumed should not be lesser or greater than the prescribed one.</p>
                                                        </div>


                                                        <div className="widget about-widget">
                                                            <h4 className="widget-title">Warning</h4>
                                                            <p>This is not recommended for the pregnant women and lactating mothers.</p>
                                                        </div>


                                                        <div className="widget about-widget mb-3">
                                                            <h4 className="widget-title">Precaution</h4>
                                                            <p className="mb-0">Syrup has to be disposed of properly after 3 years from manufactured date and it is not recommended to use after the date.</p>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                </CardBody>
                            </Card>

                        </Col>
                        <Col md='5' lg='3' xl='3' className="theiaStickySidebar">

                            <Card className="search-filter">
                                <CardBody>
                                    <div className="clini-infos mt-0">
                                        <h2>19 <b className="text-lg strike">45</b> <span className="text-lg text-success"><b>10% off</b></span></h2>
                                    </div>
                                    <span className="badge badge-primary">In stock</span>
                                    <div className="custom-increment pt-4">
                                        <div className="input-group1">
                                            <span className="input-group-btn float-start">
                                                <button type="button" className="quantity-left-minus btn btn-danger btn-number" data-type="minus" data-field>
                                                    <span><i className="fas fa-minus"></i></span>
                                                </button>
                                            </span>
                                            <input type="text" id="quantity" name="quantity" className=" input-number" value="10"/>
                                                <span className="input-group-btn float-end">
                                                    <button type="button" className="quantity-right-plus btn btn-success btn-number" data-type="plus" data-field>
                                                        <span><i className="fas fa-plus"></i></span>
                                                    </button>
                                                </span>
                                        </div>
                                    </div>
                                    <div className="clinic-details mt-4">
                                    <div className="clinic-booking">
                                        <Link to='/Cart' className="btn btn-primary">Add To Cart</Link>
                                    </div>
                                    </div>
                                    <div className="card flex-fill mt-4 mb-0">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item">SKU <span className="float-end">2023-02-0057</span></li>
                                            <li className="list-group-item">Pack Size <span className="float-end">100g</span></li>
                                            <li className="list-group-item">Unit Count <span className="float-end">200ml</span></li>
                                            <li className="list-group-item">Country <span className="float-end">Japan</span></li>
                                        </ul>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="search-filter">
                                <CardBody>
                                    <Card className="flex-fill mt-0 mb-0">
                                        <ul className="list-group list-group-flush benifits-col">
                                            <li className="list-group-item d-flex align-items-center">
                                                <div>
                                                    <i className="fas fa-shipping-fast"></i>
                                                </div>
                                                <div>
                                                    Free Shipping<br/><span className="text-sm">For orders from $50</span>
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex align-items-center">
                                                <div>
                                                    <i className="far fa-question-circle"></i>
                                                </div>
                                                <div>
                                                    Support 24/7<br/><span className="text-sm">Call us anytime</span>
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex align-items-center">
                                                <div>
                                                    <i className="fas fa-hands"></i>
                                                </div>
                                                <div>
                                                    100% Safety<br/><span className="text-sm">Only secure payments</span>
                                                </div>
                                            </li>
                                            <li className="list-group-item d-flex align-items-center">
                                                <div>
                                                    <i className="fas fa-tag"></i>
                                                </div>
                                                <div>
                                                    Hot Offers<br/><span className="text-sm">Discounts up to 90%</span>
                                                </div>
                                            </li>
                                        </ul>
                                    </Card>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
            <Footer/>
        </>
    );
}