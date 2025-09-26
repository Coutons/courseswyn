import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Coursespeak',
  description: 'Get in touch with the Coursespeak team for any questions or feedback.',
};

export default function ContactPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ color: '#eaf4ff' }}>Contact Us</h1>
      <div style={{ 
        background: '#151a28', 
        borderRadius: '8px', 
        padding: '2rem',
        border: '1px solid #1f2330'
      }}>
        <p style={{ color: '#a9b0c0' }}>
          Have questions or feedback? We'd love to hear from you! Please reach out to us using the information below.
        </p>
        
        <div style={{ margin: '2rem 0' }}>
          <h3 style={{ color: '#eaf4ff', marginTop: '2rem' }}>Email</h3>
          <p>
            <a href="mailto:contact@coursespeak.com" style={{ color: '#3b82f6' }}>contact@coursespeak.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
