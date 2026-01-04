export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-foreground">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-6">
        <p>
          Your privacy is important to us. This Privacy Policy explains how{" "}
          <strong>Club Sphere</strong> collects, uses, and protects your
          information.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Name and email address (for authentication)</li>
            <li>Usage data (pages visited, actions taken)</li>
            <li>Device and browser information</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            How We Use Your Information
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide and improve our services</li>
            <li>To manage user accounts and mess memberships</li>
            <li>To send important notifications (invitations, updates)</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Data Protection</h2>
          <p>
            We use industry-standard security measures to protect your data.
            Your information is never sold to third parties.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
          <p>
            We may use services like Firebase, Google Authentication, and email
            providers for core functionality.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Your Rights</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access your data</li>
            <li>Request correction or deletion</li>
            <li>Withdraw consent at any time</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p>
            If you have any questions, contact us at: <br />
            📧{" "}
            <a
              href="mailto:sojibah360@gmail.com"
              className="text-primary underline"
            >
              sojibah360@gmail.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
