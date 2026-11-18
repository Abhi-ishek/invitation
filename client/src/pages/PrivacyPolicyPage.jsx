import React from 'react';
import SEO from '../components/SEO';
import { ShieldCheck, Lock, Eye, FileText, Mail, MessageCircle, Globe } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cream py-12 sm:py-20">
      <SEO
        title="Privacy Policy"
        description="Learn how Wedding Wishcraft collects, protects, and handles your wedding photos, invitation data, and contact details."
        canonicalUrl="/privacy-policy"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Your Privacy Matters
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-maroon">
            Privacy Policy
          </h1>
          <p className="text-brandText-muted text-xs sm:text-sm font-body">
            <strong>Last Updated: November 16, 2026</strong>
          </p>
          <p className="text-brandText-muted text-xs sm:text-sm max-w-2xl mx-auto font-body">
            At Wedding Wishcraft, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you visit our website or purchase our wedding invitation video services.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gold/25 shadow-luxury space-y-8 text-brandText font-body text-sm leading-relaxed">
          
          {/* 1. Information We Collect */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">1</span>
              Information We Collect
            </h2>
            <p className="text-brandText-muted">When you interact with Wedding Wishcraft, we may collect the following information:</p>
            <ul className="list-disc pl-9 space-y-1 text-brandText-muted">
              <li>Full name of the customer.</li>
              <li>Contact number and WhatsApp details.</li>
              <li>Email address.</li>
              <li>Wedding details, including names, dates, venue, and event information.</li>
              <li>Photos, videos, and other content provided for invitation creation.</li>
              <li>Payment confirmation and transaction-related information.</li>
            </ul>
          </section>

          {/* 2. How We Use Your Information */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">2</span>
              How We Use Your Information
            </h2>
            <p className="text-brandText-muted">We use your information for the following purposes:</p>
            <ul className="list-disc pl-9 space-y-1 text-brandText-muted">
              <li>To create personalized wedding invitation videos.</li>
              <li>To process and manage your orders.</li>
              <li>To communicate regarding your bookings and revisions.</li>
              <li>To deliver the final invitation video.</li>
              <li>To provide customer support.</li>
              <li>To improve our services and customer experience.</li>
            </ul>
          </section>

          {/* 3. Sharing of Information */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">3</span>
              Sharing of Information
            </h2>
            <p className="pl-9 text-brandText-muted">
              Wedding Wishcraft does not sell, rent, or trade your personal information to third parties.
            </p>
            <p className="pl-9 text-brandText-muted">
              Your information may be shared with trusted service providers, such as payment processors or digital delivery platforms, only when necessary to provide our services or comply with applicable laws.
            </p>
          </section>

          {/* 4. Payment Information */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">4</span>
              Payment Information
            </h2>
            <p className="pl-9 text-brandText-muted">
              Payments may be processed through secure third-party payment providers. Wedding Wishcraft does not intentionally store sensitive payment information such as card numbers, CVV codes, or banking passwords.
            </p>
          </section>

          {/* 5. Data Security */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">5</span>
              Data Security
            </h2>
            <p className="pl-9 text-brandText-muted">
              We take reasonable measures to protect your personal information, photos, and wedding details from unauthorized access, misuse, loss, or disclosure. However, no method of electronic storage or internet transmission is completely secure.
            </p>
          </section>

          {/* 6. Data Retention */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">6</span>
              Data Retention
            </h2>
            <p className="pl-9 text-brandText-muted">
              We retain customer information only for as long as reasonably necessary to fulfill orders, provide customer support, maintain business records, or comply with applicable legal requirements. Customers may request the deletion of their personal information, subject to applicable legal obligations.
            </p>
          </section>

          {/* 7. Cookies & Website Usage */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">7</span>
              Cookies & Website Usage
            </h2>
            <p className="pl-9 text-brandText-muted">
              Our website may use cookies or similar technologies to improve user experience, analyze website traffic, and understand visitor behavior. You may manage cookie preferences through your browser settings or our website's cookie controls, where available.
            </p>
          </section>

          {/* 8. Promotional Use of Videos */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">8</span>
              Promotional Use of Videos
            </h2>
            <p className="pl-9 text-brandText-muted">
              Wedding Wishcraft may wish to showcase invitation videos in its portfolio, advertisements, or social media platforms. We will seek appropriate permission before using identifiable customer photos, personal wedding details, or completed invitation videos for promotional purposes. Customers may contact us to withdraw their permission for future promotional use.
            </p>
          </section>

          {/* 9. Your Privacy Rights */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">9</span>
              Your Privacy Rights
            </h2>
            <p className="text-brandText-muted">You may have the right to:</p>
            <ul className="list-disc pl-9 space-y-1 text-brandText-muted">
              <li>Request access to your personal information.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Request deletion of your personal information.</li>
              <li>Withdraw consent for certain uses of your information.</li>
              <li>Contact us regarding privacy-related concerns.</li>
            </ul>
          </section>

          {/* 10. Children's Privacy */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">10</span>
              Children's Privacy
            </h2>
            <p className="pl-9 text-brandText-muted">
              Our services are intended for individuals making wedding-related purchases. We do not knowingly collect personal information directly from children without appropriate consent where required by law.
            </p>
          </section>

          {/* 11. Changes to This Privacy Policy */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">11</span>
              Changes to This Privacy Policy
            </h2>
            <p className="pl-9 text-brandText-muted">
              Wedding Wishcraft may update this Privacy Policy from time to time. Any changes will be published on this page with an updated revision date.
            </p>
          </section>

          {/* 12. Contact Us */}
          <section className="space-y-2">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">12</span>
              Contact Us
            </h2>
            <div className="pl-9 space-y-1.5 text-brandText-muted">
              <p>If you have any questions or concerns regarding this Privacy Policy, please contact us:</p>
              <p className="font-semibold text-maroon">Wedding Wishcraft</p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25d366]" />
                WhatsApp: <a href="https://wa.me/917018353733" className="text-maroon font-medium hover:underline">7018353733</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-dark" />
                Email: <a href="mailto:support@weddingwishcraft.in" className="text-maroon font-medium hover:underline">support@weddingwishcraft.in</a> / <a href="mailto:weddingwishcraft@gmail.com" className="text-maroon font-medium hover:underline">weddingwishcraft@gmail.com</a>
              </p>
              <p className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gold-dark" />
                Website: <a href="https://weddingwishcraft.in" className="text-maroon font-medium hover:underline">https://weddingwishcraft.in</a>
              </p>
              <p className="font-script text-xl text-maroon pt-3">
                ✨ Wedding Wishcraft – Crafting Invitations, Creating Memories.
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
