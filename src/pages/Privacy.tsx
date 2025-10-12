import SiteHeader from "@/components/SiteHeader";
import mapBackgroundImage from "@/assets/map-background.jpg";

const Privacy = () => {
  return (
    <div className="min-h-screen relative" style={{
      backgroundImage: `url(${mapBackgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      {/* SEO Meta Tags */}
      <title>Privacy Policy - SwapRunn Auto Delivery & Swap Management</title>
      <meta name="description" content="SwapRunn's privacy policy - how we protect your personal and business data in our auto delivery platform." />
      <link rel="canonical" href="https://swaprunn.com/privacy" />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
      
      {/* Site Header */}
      <SiteHeader />

        <div className="relative z-10 px-4 py-12">
          <div className="content-container">
            <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none text-white">
              <p className="text-white/70 text-lg mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Information We Collect</h2>
            <p className="mb-4 text-white/90">
              SwapRunn collects information you provide directly to us, such as when you create an account, 
              use our services, or communicate with us. This may include:
            </p>
            <ul className="list-disc pl-6 mb-4 text-white/90">
              <li>Contact information (name, email, phone number)</li>
              <li>Business information (company name, address)</li>
              <li>Job and delivery information</li>
              <li>Payment and billing information</li>
              <li>Location data for tracking purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">How We Use Your Information</h2>
            <p className="mb-4 text-white/90">We use the information we collect to:</p>
            <ul className="list-disc pl-6 mb-4 text-white/90">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and payments</li>
              <li>Send notifications and updates</li>
              <li>Provide customer support</li>
              <li>Ensure platform security and prevent fraud</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Information Sharing</h2>
            <p className="mb-4 text-white/90">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy. We may share information:
            </p>
            <ul className="list-disc pl-6 mb-4 text-white/90">
              <li>With service providers who assist in our operations</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or acquisition</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Data Security</h2>
            <p className="mb-4 text-white/90">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
                <p className="text-white/90">
                  If you have any questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@swaprunn.com" className="text-[#DC2626] hover:underline hover:text-red-400">
                    privacy@swaprunn.com
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Privacy;