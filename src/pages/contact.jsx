import PageBanner from "@/src/components/PageBanner";
import Layouts from "@/src/layouts/Layouts";
import { Formik } from 'formik';
import AppData from "@data/app.json";
import { getSortedServicesData } from "@library/services";
import { useState } from "react";

import ArrowIcon from "@layouts/svg-icons/Arrow";

const Contact = ({ services }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  return (
    <Layouts>
        <PageBanner pageTitle={"Get in touch!"} breadTitle={"Contact"} anchorLabel={"Send message"} anchorLink={"#contact"} paddingBottom={1} align={"center"} />

        {/* map */}
        {/* <div className="mil-map-frame mil-up">
            <div className="mil-map">
                <iframe 
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1396.5769090312324!2d-73.6519672!3d45.5673453!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc91f8abc30e0ff%3A0xfc6d9cbb49022e9c!2sManoir%20Saint-Joseph!5e0!3m2!1sen!2sua!4v1685485811069!5m2!1sen!2sua" 
                style={{"border": "0"}} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade" 
                />
            </div>
        </div> */}
        {/* map end */}

        {/* contact form */}
        <section id="contact">
            <div className="container mil-p-120-90">
                <h3 className="mil-center mil-up mil-mb-60">Let's <span className="mil-thin">Talk</span></h3>

                <Formik
                initialValues = {{ email: '', name: '', message: '', service: '' }}
                validate = { values => {
                    const errors = {};
                    if (!values.email) {
                        errors.email = 'Required';
                    } else if (
                        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                    ) {
                        errors.email = 'Invalid email address';
                    }
                    return errors;
                }}
                onSubmit = {( values, { setSubmitting, resetForm } ) => {
                    const form = document.getElementById("contactForm");
                    const data = new FormData();

                    data.append('name', values.name);
                    data.append('email', values.email);
                    data.append('service', values.service || 'Not specified');
                    data.append('message', values.message);

                    fetch(form.action, {
                        method: 'POST',
                        body: data,
                        headers: {
                            'Accept': 'application/json'
                        }
                    }).then(response => {
                        if (response.ok) {
                            setShowSuccessModal(true);
                            setErrorMessage("");
                            resetForm();
                        } else {
                            response.json().then(data => {
                                if (Object.hasOwn(data, 'errors')) {
                                    setErrorMessage(data["errors"].map(error => error["message"]).join(", "));
                                } else {
                                    setErrorMessage("Oops! There was a problem submitting your form");
                                }
                            })
                        }
                    }).catch(error => {
                        setErrorMessage("Oops! There was a problem submitting your form");
                    });

                    setSubmitting(false);
                }}
                >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    /* and other goodies */
                }) => (
                <form onSubmit={handleSubmit} id="contactForm" action={AppData.settings.formspreeURL} className="row align-items-center">
                    <div className="col-lg-6 mil-up">
                        <input 
                            type="text" 
                            placeholder="What's your name"
                            name="name" 
                            required="required" 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.name} 
                        />
                    </div>
                    <div className="col-lg-6 mil-up">
                        <input 
                            type="email" 
                            placeholder="Your Email"
                            name="email"
                            required="required"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.email} 
                        />
                    </div>
                    <div className="col-lg-12 mil-up">
                        <select
                            name="service"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.service}
                        >
                            <option value="">SELECT A SERVICE (OPTIONAL)</option>
                            {services.map((service, key) => (
                                <option key={key} value={service.title}>
                                    {service.title.replace(/<br\s*\/?>/gi, ' ').replace(/&nbsp;/g, ' ').toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-lg-12 mil-up">
                        <textarea 
                            placeholder="Tell us about our project"
                            name="message" 
                            required="required"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.message} 
                        />
                    </div>
                    <div className="col-lg-8">
                        <p className="mil-up mil-mb-30"><span className="mil-accent">*</span> We promise not to disclose your personal information to third parties.</p>
                    </div>
                    <div className="col-lg-4">
                        <div className="mil-adaptive-right mil-up mil-mb-30">
                            <button type="submit" className="mil-button mil-arrow-place">
                                <span>Send message</span>
                                <ArrowIcon />
                            </button>
                        </div>
                    </div>
                    {errorMessage && (
                        <div className="col-lg-12">
                            <p className="mil-up" style={{color: '#f44336', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '10px'}}>{errorMessage}</p>
                        </div>
                    )}
                </form>
                )}
                </Formik>
            </div>
        </section>
        {/* contact form end */}

        {/* Success Modal */}
        {showSuccessModal && (
            <div className="mil-success-modal-overlay" onClick={() => setShowSuccessModal(false)}>
                <div className="mil-success-modal" onClick={(e) => e.stopPropagation()}>
                    <div className="mil-success-modal-content">
                        <div className="mil-success-icon">
                            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="30" cy="30" r="30" fill="rgba(255, 152, 0, 1)"/>
                                <path d="M20 30L27 37L40 24" stroke="rgba(0, 0, 0, 1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="mil-success-title">Thanks for your submission!</h3>
                        <p className="mil-success-text">We'll get back to you soon.</p>
                        <button className="mil-button mil-arrow-place" onClick={() => setShowSuccessModal(false)}>
                            <span>Close</span>
                            <ArrowIcon />
                        </button>
                    </div>
                </div>
            </div>
        )}
    </Layouts>
  );
};

export async function getStaticProps() {
  const services = getSortedServicesData();

  return {
    props: {
      services: services
    }
  }
}

export default Contact;
