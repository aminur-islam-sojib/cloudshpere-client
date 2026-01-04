export default function CookiePolicyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 text-foreground">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>

      <p className="text-sm text-muted-foreground mb-8">
        Last updated: {new Date().toLocaleDateString()}
      </p>

      <section className="space-y-6">
        <p>
          This Cookie Policy explains how <strong>Club Sphere</strong> uses
          cookies and similar technologies to recognize you when you visit our
          platform.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your device that help
            websites function properly and improve user experience.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Types of Cookies We Use
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Essential Cookies:</strong> Required for login, security,
              and core functionality.
            </li>
            <li>
              <strong>Analytics Cookies:</strong> Help us understand usage
              patterns and improve performance.
            </li>
            <li>
              <strong>Preference Cookies:</strong> Store your theme and display
              preferences.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">How We Use Cookies</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Maintain secure sessions</li>
            <li>Remember user preferences</li>
            <li>Analyze platform performance</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Managing Cookies</h2>
          <p>
            You can control or delete cookies through your browser settings.
            Disabling cookies may affect some features of the platform.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time. Continued use of
            the platform indicates acceptance of the updated policy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p>
            If you have questions about our Cookie Policy, contact us at: <br />
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
