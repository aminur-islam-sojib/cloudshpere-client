export default function TermsAndConditionsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-foreground">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-6">
        <p>
          These Terms & Conditions govern your use of{" "}
          <strong>Club Sphere</strong>. By accessing or using the platform, you
          agree to comply with these terms.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">Eligibility</h2>
          <p>
            You must be at least 18 years old or have legal permission to use
            this platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide accurate and up-to-date information</li>
            <li>Use the platform lawfully and respectfully</li>
            <li>Do not misuse or attempt to disrupt the system</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Manager & User Roles</h2>
          <p>
            Managers are responsible for creating and maintaining mess
            information. Users may join a mess only through valid invitations.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Prohibited Activities</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Unauthorized access to accounts or data</li>
            <li>Spamming, harassment, or abuse</li>
            <li>Security breaches or reverse engineering</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Account Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            these terms without prior notice.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Limitation of Liability
          </h2>
          <p>
            Mess Manager is not responsible for financial disputes, meal costs,
            or agreements between managers and users.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Changes to Terms</h2>
          <p>
            We may update these terms at any time. Continued use of the platform
            indicates acceptance of the revised terms.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
          <p>
            For questions about these Terms & Conditions, contact us at: <br />
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
