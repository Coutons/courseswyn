import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Courseswyn",
  description: "Learn how Courseswyn collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <section className="content">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <p>
        At Courseswyn, we value your privacy. This Privacy Policy explains how we collect, use, and
        safeguard your information when you visit our website and interact with our services.
      </p>

      <h2>Information We Collect</h2>
      <p>
        We may collect personal information that you voluntarily provide to us, such as your name and
        email address when you subscribe to our newsletter, submit a contact form, or otherwise communicate
        with us. We also automatically collect certain usage data, including IP address, browser type, and
        pages visited, to help us understand how visitors engage with our site.
      </p>

      <h2>How We Use Your Information</h2>
      <p>
        We use collected information to maintain and improve our services, send you requested updates,
        respond to inquiries, analyze site performance, and comply with legal obligations. We do not sell your
        personal information to third parties.
      </p>

      <h2>Cookies and Tracking Technologies</h2>
      <p>
        We use cookies and similar tracking technologies to personalize your experience, measure campaign
        performance, and understand usage patterns. You can adjust your browser settings to refuse cookies,
        but some parts of the site may not function properly.
      </p>

      <h2>Data Sharing</h2>
      <p>
        We may share information with trusted service providers that support our business operations, such as
        email delivery platforms and analytics providers. These partners are contractually obligated to safeguard
        your data and use it only for the purposes we specify.
      </p>

      <h2>Data Retention</h2>
      <p>
        We retain personal information only as long as necessary to fulfill the purposes outlined in this policy
        or as required by law. When data is no longer needed, we securely delete or anonymize it.
      </p>

      <h2>Your Rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct, or delete your personal information.
        You can exercise these rights by contacting us at <a href="mailto:hello@courseswyn.com">hello@courseswyn.com</a>.
      </p>

      <h2>Third-Party Links</h2>
      <p>
        Our site may contain links to third-party websites. We are not responsible for the privacy practices or
        content of these external sites. We encourage you to review their privacy policies before providing any
        information.
      </p>

      <h2>Children&apos;s Privacy</h2>
      <p>
        Our services are not directed to individuals under the age of 13. We do not knowingly collect personal
        information from children. If you believe a child has provided us with personal information, please
        contact us so we can delete it.
      </p>

      <h2>Updates to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time to reflect changes in our practices or legal
        requirements. We will post the updated policy on this page with a new effective date.
      </p>

      <h2>Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at <a href="mailto:hello@courseswyn.com">hello@courseswyn.com</a>.
      </p>
    </section>
  );
}
