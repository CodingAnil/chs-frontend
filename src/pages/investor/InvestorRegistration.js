import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import '../investor/Investor.css';
import investor_bg from '../../assets/img/investor_bg.png';
import invertor_img from '../../assets/img/investor.png';
import investor_img2 from '../../assets/img/investor_img.jpg';
import chart from '../../assets/img/chart.png';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const InvestorRegistration = () => {
    const [openFAQ, setOpenFAQ] = useState('faqOne'); // Set first FAQ open by default

    const toggleFAQ = (faqId) => {
        setOpenFAQ(openFAQ === faqId ? '' : faqId);
    };

    return (
        <>
            <Header />
            <main>
                <div className="base-page">
                    <div className="base-page-hero">
                        <div className="base-page-hero-bg"><img alt="" src={investor_bg} /></div>
                        <div className="base-page-hero-content section-container">
                            <div className="base-page-hero-content-mask">
                                <div id="block-widgetassetsv2" className="block--nir-assets__widget block--nir-assets__widget--5806 block--header-featured--nir-assets__widget block--header-featured--nir-assets__widget--5806 block--b7d531a9-e918-4dad-bf40-22847185bf35 block--b7d531a9-e918-4dad-bf40-22847185bf35--5806 block block-nir-assets block-nir-assets__widget">
                                </div>
                                <div id="block-gpheaderareatext" className="block-content--nir-global-block block-content--nir-global-block--10311 block--block-content25d5a76b-badd-44ac-8cc3-7373e2ac5e10 block--block-content25d5a76b-badd-44ac-8cc3-7373e2ac5e10--5806 block--header-featured--block-content--25d5a76b-badd-44ac-8cc3-7373e2ac5e10 block--header-featured--block-content--25d5a76b-badd-44ac-8cc3-7373e2ac5e10--5806 block--9de4da35-2a7d-4cb0-b727-9da4a26330a9 block--9de4da35-2a7d-4cb0-b727-9da4a26330a9--5806 block block-block-content block-block-content25d5a76b-badd-44ac-8cc3-7373e2ac5e10">
                                    <div className="field field--name-field-nir-global-block-node field--type-entity-reference field--label-hidden field__item">
                                        <div className="field field--name-field-nir-global-block-body field--type-text-long field--label-hidden field__item">
                                            <h1>The leader and innovator in total talent solutions for healthcare</h1>
                                        </div>
                                    </div>
                                </div>

                                <div id="block-widgetassetsv2-2" className="block--nir-assets__widget block--nir-assets__widget--5806 block--header-featured--nir-assets__widget block--header-featured--nir-assets__widget--5806 block--828f2f97-8842-4f7e-a1f6-04418c533602 block--828f2f97-8842-4f7e-a1f6-04418c533602--5806 block block-nir-assets block-nir-assets__widget">
                                    <div className="nir-widget">
                                        <div className="nir-widget--content">
                                            <div className="nir-widget--list">
                                                <article className="clearfix node node--nir-asset--nir-widget-list node--type-nir-asset node--view-mode-nir-widget-list node--promoted">
                                                    <div className="nir-widget--field nir-widget--asset--list-of-files">
                                                        <div className="field-nir-document">
                                                            <div className="nir-widgets--file-list--hide-filesize field__item"><article className="node node--nir-asset--asset-link node--type-nir-asset node--view-mode-asset-link node--promoted">
                                                                <div className="node__content">
                                                                    <div className="field field--name-field-nir-ext-document field--type-link field--label-hidden field__items">
                                                                        <div className="field field--name-field-nir-ext-document field--type-link field--label-hidden field__item"><a href="#" target="_self" className="cta-primary-medium">2023 Annual Report &amp; 2024 Statement</a></div>
                                                                    </div>
                                                                </div>
                                                            </article>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="block-nir-pid7810-widgetassetsv2" className="block--nir-assets__widget block--nir-assets__widget--5806 block--header-featured--nir-assets__widget block--header-featured--nir-assets__widget--5806 block--00aa4ced-e6f8-4e3b-b47e-20e87e4b800d block--00aa4ced-e6f8-4e3b-b47e-20e87e4b800d--5806 block block-nir-assets block-nir-assets__widget">
                                    <div className="nir-widget">
                                        <div className="nir-widget--content">
                                            <div className="nir-widget--list">
                                                <article className="clearfix node node--nir-asset--nir-widget-list node--type-nir-asset node--view-mode-nir-widget-list">
                                                    <div className="nir-widget--field nir-widgets--asset--title">
                                                        <span className="nir-widget--asset--title--title">
                                                            <div className="field-nir-asset-title">
                                                                <div className="file file--mime-application-pdf file--application-pdf field__item"><a href="#" type="application/pdf" className="cta-primary-medium mt-3">2024 Annual Meeting Rules of Conduct</a></div>
                                                            </div></span>
                                                        <span className="nir-widget--asset--title-file-size"></span>
                                                    </div>
                                                </article>
                                            </div>
                                            <div className="nir-widget--pager">
                                            </div>
                                            <div className="nir-widget--total-results">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="base-page-hero-content-image">
                                <img alt="Female executive" className="object-cover, w-full" data-src={invertor_img} title="Female executive" src={invertor_img} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <div className="region region-content" id="lfg-main-content">
                <div data-drupal-messages-fallback="" className="hidden"></div>
                <div id="block-nir-pid7810-content" className="block--system-main-block block--system-main-block--5806 block--content--system-main-block block--content--system-main-block--5806 block--d12f8046-663a-4fe1-a653-71ac95ea68e2 block--d12f8046-663a-4fe1-a653-71ac95ea68e2--5806 block block-system block-system-main-block">


                    <article className="node node--type-nir_landing_page node--view-mode-full clearfix">
                        <div>
                            <div className="base-page-content corporate-profile">
                                <div className="promo-callout bg-grey-03">
                                    <div className="flex flex-col tablet:grid tablet:gap-4 tablet:grid-cols-12 section-container">
                                        <div className="promo-callout-media w-full overflow-hidden">
                                            <div className="block-region-header">
                                                <div className="block--tw-pdfviewer block--nir-assets__widget block--nir-assets__widget--5806 block--header--nir-assets__widget block--header--nir-assets__widget--5806 block--237fe473-df76-476e-9564-6b4c3dc206e0 block--237fe473-df76-476e-9564-6b4c3dc206e0--5806 block block-nir-assets block-nir-assets__widget">
                                                    <div className="nir-widget">
                                                        <h3 classNameName='text-white'> Investor Relation</h3>
                                                        <div className="nir-widget--content">
                                                            <div className="nir-widget--list mt-4 text-justify text-dark">
                                                                <p>Investor relations (IR) is the strategic management of communication between a company and its investors. It involves sharing key information about the company’s performance, strategy, and market position, fostering transparency and trust. Effective IR helps attract and retain investors, enhances corporate reputation, and supports informed decision-making. By maintaining open lines of communication through reports, presentations, and meetings, IR plays a crucial role in aligning investor expectations with company goals.</p>
                                                                <p>We are committed to providing transparent and timely information to our investors and stakeholders. This section is designed to keep you informed about our company’s performance, strategies, and future outlook.</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="promo-callout-content w-full">
                                            <div className="mb-8">
                                                <div className="block-region-column1">
                                                    <div className="block--nir-stock-chart block--nir-stock-chart--5806 block--column1--nir-stock-chart block--column1--nir-stock-chart--5806 block--b79bc723-4ceb-4174-b982-bb8f37487a65 block--b79bc723-4ceb-4174-b982-bb8f37487a65--5806 block block-nir-stock-chart">
                                                        <img src={chart} alt="Image Chart" />

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            </div>


            <div className="Patients-section-fifteen">
                <Container>
                    <Row>
                        <Col lg='6'>
                            <div className="patients-left-front patients-left-img">
                                <img src={investor_img2} alt="Patients" className="img-fluid" />
                            </div>
                        </Col>
                        <Col lg='6'>
                            <div className="section-header-fifteen section-header-fifteenpatient">
                                <h2>Key Information<span> for Investors</span></h2>
                                <h6>Financial Reports</h6>
                                <ul className='mt-1 mb-1'>
                                    <li>Access our quarterly and annual financial statements, including balance sheets, income statements, and cash flow statements.</li>
                                    <li>Download our latest for detailed insights into our financial performance.</li>
                                </ul>
                                <h6>Press Releases</h6>
                                <ul className='mt-1 mb-1'>
                                    <li>Stay updated with our latest news, announcements, and developments that may impact our business and stock performance.</li>
                                </ul>
                                <h6>Corporate Governance</h6>
                                <ul className='mt-1 mb-1'>
                                    <li>Review our corporate governance policies, including board member profiles, committee structures, and compliance with regulations.</li>
                                </ul>
                                <div className='mt-4'>
                                    <Link to='#' className='btn btn-primary'>View All Results</Link>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <section className="frequently-section-fifteen">
                <Container>
                    <Row>
                        <Col lg='12'>
                            <div className="section-header-fifteen text-center">
                                <h2>Frequently <span>Asked Questions</span></h2>
                                <p>Common questions from our investors and stakeholders</p>
                            </div>
                        </Col>
                    </Row>
                    <div className="faq-main-cards" id="accordionExample">
                        <div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
                            <div className="faq-title">
                                <a 
                                    onClick={() => toggleFAQ('faqOne')} 
                                    style={{ cursor: 'pointer' }}
                                    aria-expanded={openFAQ === 'faqOne'}
                                >
                                    <span>How can I buy shares of CHS Caresmart Health Solution?</span>
                                </a>
                                <div 
                                    id="faqOne" 
                                    className={`card-collapse collapse ${openFAQ === 'faqOne' ? 'show' : ''}`}
                                >
                                    <p>You can purchase CHS shares through several methods:</p>
                                    <ul>
                                        <li><strong>Online Trading Platforms:</strong> Use popular platforms like E*TRADE, TD Ameritrade, or Robinhood</li>
                                        <li><strong>Licensed Brokers:</strong> Contact a certified financial advisor or brokerage firm</li>
                                        <li><strong>Direct Stock Purchase Plans:</strong> Some companies offer direct purchase options</li>
                                        <li><strong>Investment Apps:</strong> Mobile applications that allow stock trading</li>
                                    </ul>
                                    <p>Our stock ticker symbol is [CHS] and we're listed on [Exchange Name]. Always consult with a financial advisor before making investment decisions.</p>
                                </div>
                            </div>
                        </div>
                        <div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
                            <div className="faq-title">
                                <a 
                                    onClick={() => toggleFAQ('faqTwo')} 
                                    style={{ cursor: 'pointer' }}
                                    aria-expanded={openFAQ === 'faqTwo'}
                                >
                                    <span>How can I receive updates about CHS Caresmart Health Solution?</span>
                                </a>
                                <div 
                                    id="faqTwo" 
                                    className={`card-collapse collapse ${openFAQ === 'faqTwo' ? 'show' : ''}`}
                                >
                                    <p>Stay informed about CHS through multiple channels:</p>
                                    <ul>
                                        <li><strong>Investor Newsletter:</strong> Subscribe to receive quarterly reports, earnings announcements, and strategic updates</li>
                                        <li><strong>Email Alerts:</strong> Get immediate notifications for press releases and SEC filings</li>
                                        <li><strong>Investor Relations Portal:</strong> Access our dedicated investor section on the website</li>
                                        <li><strong>Social Media:</strong> Follow our official LinkedIn and Twitter accounts for real-time updates</li>
                                        <li><strong>Annual Meetings:</strong> Participate in shareholder meetings and conference calls</li>
                                    </ul>
                                    <p>Sign up for our investor communications at the bottom of this page or contact our investor relations team directly.</p>
                                </div>
                            </div>
                        </div>
                        <div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
                            <div className="faq-title">
                                <a 
                                    onClick={() => toggleFAQ('faqThree')} 
                                    style={{ cursor: 'pointer' }}
                                    aria-expanded={openFAQ === 'faqThree'}
                                >
                                    <span>Where can I find historical financial data?</span>
                                </a>
                                <div 
                                    id="faqThree" 
                                    className={`card-collapse collapse ${openFAQ === 'faqThree' ? 'show' : ''}`}
                                >
                                    <p>Comprehensive historical financial data is available through:</p>
                                    <ul>
                                        <li><strong>Annual Reports:</strong> 10+ years of detailed financial statements and business analysis</li>
                                        <li><strong>Quarterly Earnings:</strong> SEC 10-Q filings with quarterly performance data</li>
                                        <li><strong>SEC Database:</strong> All official filings are available through EDGAR database</li>
                                        <li><strong>Financial Websites:</strong> Third-party sites like Yahoo Finance, Bloomberg, and MarketWatch</li>
                                        <li><strong>Investor Relations Archive:</strong> Past presentations, transcripts, and supplementary materials</li>
                                    </ul>
                                    <p>Our financial reports section includes data dating back to our IPO, with downloadable PDF formats and interactive charts showing key performance metrics over time.</p>
                                </div>
                            </div>
                        </div>
                        <div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
                            <div className="faq-title">
                                <a 
                                    onClick={() => toggleFAQ('faqFour')} 
                                    style={{ cursor: 'pointer' }}
                                    aria-expanded={openFAQ === 'faqFour'}
                                >
                                    <span>What is CHS's dividend policy?</span>
                                </a>
                                <div 
                                    id="faqFour" 
                                    className={`card-collapse collapse ${openFAQ === 'faqFour' ? 'show' : ''}`}
                                >
                                    <p>CHS maintains a balanced approach to dividend distribution:</p>
                                    <ul>
                                        <li><strong>Quarterly Dividends:</strong> We aim to provide consistent quarterly payments to shareholders</li>
                                        <li><strong>Reinvestment Focus:</strong> A portion of earnings is reinvested for growth and expansion</li>
                                        <li><strong>Dividend History:</strong> Track record of dividend payments and yield over the past 5 years</li>
                                        <li><strong>Future Outlook:</strong> Dividend sustainability based on cash flow and business performance</li>
                                    </ul>
                                    <p>Dividend announcements are made quarterly following our earnings reports. Check our investor calendar for upcoming payment dates.</p>
                                </div>
                            </div>
                        </div>
                        <div className="faq-card aos aos-init aos-animate" data-aos="fade-up">
                            <div className="faq-title">
                                <a 
                                    onClick={() => toggleFAQ('faqFive')} 
                                    style={{ cursor: 'pointer' }}
                                    aria-expanded={openFAQ === 'faqFive'}
                                >
                                    <span>How can I contact the Investor Relations team?</span>
                                </a>
                                <div 
                                    id="faqFive" 
                                    className={`card-collapse collapse ${openFAQ === 'faqFive' ? 'show' : ''}`}
                                >
                                    <p>Our Investor Relations team is available to assist you:</p>
                                    <ul>
                                        <li><strong>Email:</strong> investors@chscaresmart.com</li>
                                        <li><strong>Phone:</strong> +1 (555) 123-4567 (Monday-Friday, 9 AM - 5 PM EST)</li>
                                        <li><strong>Mailing Address:</strong> CHS Investor Relations, 123 Healthcare Blvd, Suite 100, Medical City, MC 12345</li>
                                        <li><strong>Online Form:</strong> Submit inquiries through our investor contact form</li>
                                        <li><strong>Office Hours:</strong> Schedule in-person meetings during regular business hours</li>
                                    </ul>
                                    <p>We typically respond to inquiries within 2 business days. For urgent matters, please call our investor hotline.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
            <Footer />
        </>
    );
};

export default InvestorRegistration;
