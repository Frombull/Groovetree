export default function TermsOfService() {
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
      <h1 className="text-3xl font-bold mb-6">Terms of Service - Groovetree</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-sm text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
          <p className="mb-3">
            By accessing and using our service, you accept and agree to be bound by the terms
            and provision of this agreement.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Use License</h2>
          <p className="mb-3">
            Permission is granted to temporarily use our service for personal, non-commercial
            transitory viewing only. This is the grant of a license, not a transfer of title.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">User Accounts</h2>
          <p className="mb-3">
            You are responsible for safeguarding the password and for maintaining the confidentiality
            of your account. You agree not to disclose your password to any third party.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Prohibited Uses</h2>
          <p className="mb-3">
            You may not use our service for any unlawful purpose or to solicit others to perform
            unlawful acts. You may not violate any international, federal, provincial, or state
            regulations, rules, or laws.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Termination</h2>
          <p className="mb-3">
            We may terminate or suspend your account and bar access to the service immediately,
            without prior notice or liability, under our sole discretion, for any reason whatsoever.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Contact Information</h2>
          <p className="mb-3">
            If you have any questions about these Terms of Service, please contact us through
            our support channels.
          </p>
        </section>
      </div>
    </div>
  );
}