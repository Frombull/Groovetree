export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <a 
          href="/" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Back to Groovetree
        </a>
      </div>
      <h1 className="text-3xl font-bold mb-6 text-white">Cookie Policy - Groovetree</h1>
      
      <div className="prose prose-gray max-w-none text-white">
        <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>
        
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">What Are Cookies</h2>
          <p className="mb-3">
            Cookies are small text files that are placed on your computer or mobile device when 
            you visit our website. They help us provide you with a better experience by remembering 
            your preferences and settings.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">How We Use Cookies</h2>
          <p className="mb-3">We use cookies for the following purposes:</p>
          <ul className="list-disc pl-6 mb-3">
            <li>Essential cookies: Required for the website to function properly</li>
            <li>Performance cookies: Help us understand how visitors interact with our website</li>
            <li>Functionality cookies: Remember your preferences and settings</li>
            <li>Authentication cookies: Keep you logged in to your account</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Types of Cookies We Use</h2>
          <p className="mb-3">
            <strong>Session Cookies:</strong> These are temporary cookies that expire when you close your browser.
          </p>
          <p className="mb-3">
            <strong>Persistent Cookies:</strong> These remain on your device for a set period or until you delete them.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Managing Cookies</h2>
          <p className="mb-3">
            You can control and manage cookies in various ways. Most browsers allow you to refuse 
            cookies or delete cookies. Please note that if you choose to block cookies, some features 
            of our website may not work properly.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="mb-3">
            If you have any questions about our use of cookies, please contact us through our 
            support channels.
          </p>
        </section>
      </div>
    </div>
  );
}