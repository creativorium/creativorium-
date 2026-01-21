import Link from "next/link";
import AppData from "@data/app.json";
import ArrowIcon from "@layouts/svg-icons/Arrow";
import { useRouter } from 'next/router';
import { useState } from "react";

const DefaultFooter = ( { extraClass } ) => {
  const { asPath } = useRouter();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleFooterSubmit = async (e) => {
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
    {/* footer */}
    <footer className="mil-dark-bg">
        <div className="mi-invert-fix">
            <div className="container mil-p-120-60">
                <div className="row justify-content-between">
                    <div className="col-md-4 col-lg-4 mil-mb-60">

                        <div className="mil-muted mil-logo mil-up mil-mb-30">{AppData.footer.logo.text}</div>

                        <p className="mil-light-soft mil-up mil-mb-30">Subscribe our newsletter:</p>

                        {AppData.settings.formspreeSubscriptionURL ? (
                            <form onSubmit={handleFooterSubmit} className="mil-subscribe-form mil-up" noValidate>
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
                                    fontSize: '11px', 
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    color: status.includes('Thanks') ? '#4CAF50' : status.includes('Subscribing') ? '#FF9800' : '#f44336'
                                  }}>
                                    {status}
                                  </p>
                                )}
                            </form>
                        ) : (
                            <form action={AppData.settings.mailchimp.url} method="post" target="_blank" className="mil-subscribe-form mil-up">
                                <input type="email" placeholder="Enter your email" name="EMAIL" required />
                                <input type="hidden" name={AppData.settings.mailchimp.key} />
                                <button type="submit" className="mil-button mil-icon-button-sm mil-arrow-place">
                                    <ArrowIcon />
                                </button>
                            </form>
                        )}

                    </div>
                    <div className="col-md-7 col-lg-6">
                        <div className="row justify-content-end">
                            <div className="col-md-6 col-lg-7">

                                <nav className="mil-footer-menu mil-mb-60">
                                    <ul>
                                        {AppData.footer.menu.map((item, key) => (
                                        <li key={`footer-menu-item-${key}`} className={((asPath.indexOf( item.link ) != -1 && item.link != '/' ) || asPath == item.link ) ? "mil-active mil-up" : "mil-up"}>
                                            <Link href={item.link}>{item.label}</Link>
                                        </li>
                                        ))}
                                    </ul>
                                </nav>

                            </div>
                            <div className="col-md-6 col-lg-5">

                                <ul className="mil-menu-list mil-up mil-mb-60">
                                    <li><a href="#." className="mil-light-soft">Privacy Policy</a></li>
                                    <li><a href="#." className="mil-light-soft">Terms and conditions</a></li>
                                    <li><a href="#." className="mil-light-soft">Cookie Policy</a></li>
                                </ul>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-between flex-sm-row-reverse">
                    <div className="col-md-7 col-lg-6">

                        <div className="row justify-content-between">

                            <div className="col-md-6 col-lg-5 mil-mb-60">

                                <h6 className="mil-muted mil-up mil-mb-30">Bali, Indonesia</h6>

                                <p className="mil-light-soft mil-up">Kerobokan, Badung 80361 <span className="mil-no-wrap">+62 877-6018-5018</span></p>

                            </div>
                            <div className="col-md-6 col-lg-5 mil-mb-60">

                                <h6 className="mil-muted mil-up mil-mb-30">Yogyakarta, Indonesia</h6>

                                <p className="mil-light-soft mil-up">Godean, Sleman 55581 <span className="mil-no-wrap">+62 877-6018-5018</span></p>

                            </div>
                        </div>

                    </div>
                    <div className="col-md-4 col-lg-6 mil-mb-60">

                        <div className="mil-vert-between">
                            <div className="mil-mb-30">
                                <ul className="mil-social-icons mil-up">
                                    {AppData.social.map((item, key) => (
                                    <li key={`footer-social-item-${key}`}><a href={item.link} target="_blank" className="social-icon"><i className={item.icon} /></a></li>
                                    ))}
                                </ul>
                            </div>
                            <p className="mil-light-soft mil-up">{AppData.footer.copy}</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </footer>
    {/* footer end */}
    </>
  );
};
export default DefaultFooter;
