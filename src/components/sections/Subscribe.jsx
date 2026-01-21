import Data from "@data/sections/subscribe.json";
import AppData from "@data/app.json";
import ArrowIcon from "@layouts/svg-icons/Arrow";
import { useState } from "react";

const SubscribeSection = () => {
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!email) {
      setStatus("Please enter your email address.");
      return;
    }

    setStatus("Subscribing...");

    // Use Formspree if available, otherwise fall back to Mailchimp
    if (AppData.settings.formspreeSubscriptionURL) {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('_subject', 'New Newsletter Subscription');
      formData.append('_next', window.location.href); // Prevent redirect

      try {
        const response = await fetch(AppData.settings.formspreeSubscriptionURL, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          },
          mode: 'cors'
        });

        if (response.ok) {
          setStatus("Thanks for subscribing!");
          setEmail("");
        } else {
          const data = await response.json().catch(() => ({}));
          if (data.errors) {
            setStatus(data.errors.map(err => err.message).join(", "));
          } else {
            setStatus("Oops! There was a problem. Please try again.");
          }
        }
      } catch (error) {
        console.error('Subscription error:', error);
        setStatus("Oops! There was a problem. Please try again.");
      }
    } else if (AppData.settings.mailchimp.url) {
      // Fallback to Mailchimp if Formspree not configured
      e.target.submit();
    } else {
      setStatus("Subscription not configured. Please contact the site administrator.");
    }
  };

  return (
    <>
        {/* call to action */}
        <section className="mil-soft-bg">
            <div className="container mil-p-120-120">
                <div className="row">
                    <div className="col-lg-10">
                        <span className="mil-suptitle mil-suptitle-right mil-suptitle-dark mil-up" dangerouslySetInnerHTML={{__html : Data.subtitle}} />
                    </div>
                </div>
                <div className="mil-center">
                    <h2 className="mil-up mil-mb-60" dangerouslySetInnerHTML={{__html : Data.title}} /> 
                    <div className="row justify-content-center mil-up">
                        <div className="col-lg-4">
                            {AppData.settings.formspreeSubscriptionURL ? (
                                <form onSubmit={handleSubmit} className="mil-subscribe-form mil-subscribe-form-2 mil-up" noValidate>
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        name="email" 
                                        value={email}
                                        onChange={(e) => {
                                          setEmail(e.target.value);
                                          if (status) setStatus(""); // Clear status when typing
                                        }}
                                        required 
                                    />
                                    <button type="submit" className="mil-button mil-icon-button-sm mil-arrow-place">
                                        <ArrowIcon />
                                    </button>
                                    {status && (
                                      <p style={{
                                        marginTop: '10px', 
                                        fontSize: '12px', 
                                        textTransform: 'uppercase',
                                        letterSpacing: '2px',
                                        color: status.includes('Thanks') ? '#4CAF50' : status.includes('Subscribing') ? '#FF9800' : '#f44336'
                                      }}>
                                        {status}
                                      </p>
                                    )}
                                </form>
                            ) : (
                                <form action={AppData.settings.mailchimp.url} method="post" target="_blank" className="mil-subscribe-form mil-subscribe-form-2 mil-up">
                                    <input type="email" placeholder="Enter your email" name="EMAIL" required />
                                    <input type="hidden" name={AppData.settings.mailchimp.key} />
                                    <button type="submit" className="mil-button mil-icon-button-sm mil-arrow-place">
                                        <ArrowIcon />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        {/* call to action end */}
    </>
  );
};

export default SubscribeSection;