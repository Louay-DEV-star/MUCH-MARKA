import '../styles/components/Footer.scss';
import { FaWhatsapp, FaFacebookF, FaInstagram } from 'react-icons/fa';
import wetekup from '../assets/icons/wetekup.svg';
import { CiMail } from "react-icons/ci";
import { LuPhone } from "react-icons/lu";
import { PiWhatsappLogoLight } from "react-icons/pi";
import { useLocation } from 'react-router-dom';
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
    const location = useLocation();
    const isHomePage = location.pathname === "/";

    return (
        <footer className={isHomePage ? "" : "with-border"}>
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Contact</h3>
                    <div className="contact-info">
                        <div className="contact-item">
                            <CiMail className="icon" />
                            <span>oabi@gmail.com</span>
                        </div>
                        <div className="contact-item">
                            <LuPhone className="icon" />
                            <span>+216 29630041</span>
                        </div>
                        <div className="contact-item"
                            onClick={() =>
                                window.open('https://wa.me/21629630041', '_blank')
                            }
                            style={{cursor:'pointer'}}
                        >
                            <PiWhatsappLogoLight className="icon" />
                            <span>+216 29630041</span>
                        </div>
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Nous trouver</h3>
                    <div className="social-links">
                        <FaFacebookF className="social-icon" onClick={() => window.open('https://www.facebook.com/share/1B3jWmtwaL/?mibextid=wwXIfr', '_blank')} />
                        <FaInstagram className="social-icon" onClick={() => window.open('https://www.instagram.com/oabi_boutique/', '_blank')} />
                        <FaTiktok className="social-icon" onClick={() => window.open('https://www.tiktok.com/@oumaymaoabi?_t=ZM-8z5MYZAVoIP&_r=1', '_blank')} />
                    </div>
                </div>

                <div className="footer-section">
                    <h3>Langue</h3>
                    <div className="language-selector">
                        <select defaultValue="français">
                            <option value="français">Français</option>
                            <option value="english">English</option>
                            <option value="arabic">العربية</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="copyright">
                    <img src={wetekup} alt="WeTekUp" className="footer-logo" />
                    <span>© {new Date().getFullYear()} OABI. Tous droits réservés. Site conçu par <a href="https://www.instagram.com/we_tekup/" target="_blank" rel="noopener noreferrer">WE TEKUP</a></span>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
