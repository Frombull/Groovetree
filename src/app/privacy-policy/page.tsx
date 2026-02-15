export default function PrivacyPolicy() {
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
      <h1 className="text-3xl font-bold mb-6 text-white">Privacy Policy - Groovetree</h1>

      <div className="prose prose-gray max-w-none text-white">
        <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Information We Collect</h2>
          <p className="mb-3">
            We collect information you provide directly to us, such as when you create an account,
            update your profile, or contact us for support.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">How We Use Your Information</h2>
          <p className="mb-3">
            We use the information we collect to provide, maintain, and improve our services,
            process transactions, and communicate with you.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Information Sharing</h2>
          <p className="mb-3">
            We do not sell, trade, or otherwise transfer your personal information to third parties
            without your consent, except as described in this policy.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Data Security</h2>
          <p className="mb-3">
            We implement appropriate security measures to protect your personal information
            against unauthorized access, alteration, disclosure, or destruction.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="mb-3">
            If you have any questions about this Privacy Policy, please contact us through our support channels.
          </p>
        </section>
      </div>
    </div>
  );
}