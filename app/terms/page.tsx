import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Courseswyn",
  description: "Read the terms and conditions for using Courseswyn and accessing our deals.",
};

export default function TermsPage() {
  return (
    <section className="content">
      <h1>Terms of Use</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>

      <p>
        These Terms of Use (&quot;Terms&quot;) govern your access to and use of the Courseswyn website and services.
        By using our site, you agree to comply with these Terms.
      </p>

      <h2>Use of the Site</h2>
      <p>
        You may use Courseswyn to discover deals, coupons, and educational resources for personal, non-commercial
        purposes. You agree not to misuse the site or interfere with its operation.
      </p>

      <h2>Account and Newsletter</h2>
      <p>
        If you subscribe to our newsletter or contact us, you agree to provide accurate information. You are
        responsible for maintaining the confidentiality of any information associated with your use of the site.
      </p>

      <h2>Content</h2>
      <p>
        All content provided on Courseswyn is for informational purposes only. We make reasonable efforts to
        ensure accuracy but do not guarantee that coupons or deals will always be valid or error-free. We reserve
        the right to modify or remove content at any time.
      </p>

      <h2>Affiliate Links</h2>
      <p>
        Some links on our site may be affiliate links. When you click these links and make a purchase, we may earn
        a commission at no additional cost to you. Affiliate relationships do not influence our content or
        recommendations.
      </p>

      <h2>Third-Party Services</h2>
      <p>
        Courseswyn may link to third-party websites. We are not responsible for the content, privacy practices, or
        services provided by third parties. Use of third-party sites is at your own risk.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        Courseswyn owns or licenses all intellectual property rights in our content, including text, graphics,
        logos, and trademarks. You may not reproduce, distribute, or create derivative works without our written
        consent.
      </p>

      <h2>Disclaimer of Warranties</h2>
      <p>
        Courseswyn is provided &quot;as is&quot; without warranties of any kind, whether express or implied. We do not
        guarantee uninterrupted access or that the site will be secure or error-free.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Courseswyn and its team will not be liable for any indirect,
        incidental, special, consequential, or punitive damages arising from your use of the site.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms periodically. Continued use of the site after changes are posted constitutes your
        acceptance of the revised Terms.
      </p>

      <h2>Contact</h2>
      <p>
        If you have questions about these Terms, please contact us at <a href="mailto:hello@courseswyn.com">hello@courseswyn.com</a>.
      </p>
    </section>
  );
}
