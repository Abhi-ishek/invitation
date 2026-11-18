import React from 'react';
import SEO from '../components/SEO';
import { FileText, ShieldAlert, CheckCircle2, Clock, RefreshCw, Mail, MessageCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream py-12 sm:py-20">
      <SEO
        title="Terms and Conditions"
        description="Review the terms and conditions for ordering luxury 3D AI and bespoke wedding invitation videos from Wedding Wishcraft."
        canonicalUrl="/terms"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-gold-dark flex items-center justify-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Official Agreement
          </span>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-maroon">
            Terms & Conditions
          </h1>
          <p className="text-brandText-muted text-xs sm:text-sm max-w-2xl mx-auto font-body">
            Welcome to Wedding Wishcraft! By placing an order with us, you agree to the following Terms & Conditions.
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-gold/25 shadow-luxury space-y-8 text-brandText font-body text-sm leading-relaxed">
          
          {/* 1. Orders & Booking */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">1</span>
              Orders & Booking
            </h2>
            <ul className="list-disc pl-9 space-y-1 text-brandText-muted">
              <li>Orders are confirmed only after payment is received.</li>
              <li>Customers must provide all required details, including names, wedding dates, venue, and invitation text.</li>
              <li>Please ensure all information provided is accurate.</li>
            </ul>
          </section>

          {/* 2. Payment Policy */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">2</span>
              Payment Policy
            </h2>
            <ul className="list-disc pl-9 space-y-1 text-brandText-muted">
              <li>Full payment is required before starting the video creation process.</li>
              <li>Our prices are subject to change without prior notice.</li>
              <li>Any additional customization may incur extra charges.</li>
            </ul>
          </section>

          {/* 3. Design & Customization */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">3</span>
              Design & Customization
            </h2>
            <ul className="list-disc pl-9 space-y-1 text-brandText-muted">
              <li>Each wedding invitation video is created according to the details and preferences provided by the customer.</li>
              <li>Design, music, fonts, and animation styles may vary depending on the selected package.</li>
              <li>We reserve the right to use creative elements that best suit the design.</li>
            </ul>
          </section>

          {/* 4. Revisions & Changes */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">4</span>
              Revisions & Changes
            </h2>
            <ul className="list-disc pl-9 space-y-1 text-brandText-muted">
              <li>Customers are allowed up to 2 minor revisions, unless otherwise specified in the selected package.</li>
              <li>Major design changes or changes after final approval may incur additional charges.</li>
              <li>Customers are responsible for checking all details before approving the final video.</li>
            </ul>
          </section>

          {/* 5. Delivery Policy */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">5</span>
              Delivery Policy
            </h2>
            <ul className="list-disc pl-9 space-y-1 text-brandText-muted">
              <li>Delivery time will be communicated at the time of booking.</li>
              <li>Delays may occur due to incomplete information or customer-requested changes.</li>
              <li>Final videos will be delivered digitally via WhatsApp, email, or another suitable platform.</li>
            </ul>
          </section>

          {/* 6. Cancellation & Refund Policy */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">6</span>
              Cancellation & Refund Policy
            </h2>
            <ul className="list-disc pl-9 space-y-1 text-brandText-muted">
              <li>Once the design process has started, cancellations and refunds are generally not accepted.</li>
              <li>Refunds may be considered only in cases where Wedding Wishcraft is unable to deliver the ordered service.</li>
              <li>Approved refunds will be processed through the original payment method where possible.</li>
            </ul>
          </section>

          {/* 7. Copyright & Usage */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">7</span>
              Copyright & Usage
            </h2>
            <ul className="list-disc pl-9 space-y-1 text-brandText-muted">
              <li>All designs and videos created by Wedding Wishcraft are intended for personal wedding use.</li>
              <li>Customers may not resell, reproduce, or commercially distribute our designs without written permission.</li>
              <li>Wedding Wishcraft reserves the right to showcase completed designs in its portfolio or social media for promotional purposes, unless the customer requests otherwise in writing.</li>
            </ul>
          </section>

          {/* 8. Customer Responsibility */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">8</span>
              Customer Responsibility
            </h2>
            <ul className="list-disc pl-9 space-y-1 text-brandText-muted">
              <li>Customers must provide accurate information, images, and other required materials.</li>
              <li>Wedding Wishcraft is not responsible for errors in details approved by the customer.</li>
            </ul>
          </section>

          {/* 9. Limitation of Liability */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">9</span>
              Limitation of Liability
            </h2>
            <p className="pl-9 text-brandText-muted">
              Wedding Wishcraft shall not be held responsible for delays caused by technical issues, third-party platforms, or circumstances beyond our control.
            </p>
          </section>

          {/* 10. Contact Us */}
          <section className="space-y-2 border-b border-gold/15 pb-6">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">10</span>
              Contact Us
            </h2>
            <div className="pl-9 space-y-1.5 text-brandText-muted">
              <p>For any questions or concerns regarding these Terms & Conditions, please contact:</p>
              <p className="font-semibold text-maroon">Wedding Wishcraft</p>
              <p className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25d366]" />
                WhatsApp: <a href="https://wa.me/917018353733" className="text-maroon font-medium hover:underline">7018353733</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-dark" />
                Email: <a href="mailto:support@weddingwishcraft.in" className="text-maroon font-medium hover:underline">support@weddingwishcraft.in</a> / <a href="mailto:weddingwishcraft@gmail.com" className="text-maroon font-medium hover:underline">weddingwishcraft@gmail.com</a>
              </p>
            </div>
          </section>

          {/* 11. Updates to Terms */}
          <section className="space-y-2">
            <h2 className="font-heading text-xl font-bold text-maroon flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-maroon text-gold text-xs flex items-center justify-center font-bold">11</span>
              Updates to Terms
            </h2>
            <p className="pl-9 text-brandText-muted">
              Wedding Wishcraft reserves the right to update or modify these Terms & Conditions at any time without prior notice. By placing an order, you acknowledge that you have read and agreed to these Terms & Conditions.
            </p>
            <p className="pl-9 font-script text-xl text-maroon pt-2">
              ✨ Wedding Wishcraft – Crafting Invitations, Creating Memories.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
