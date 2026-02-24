import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/NavBar";

export const Route = createFileRoute("/terms")({
	component: TermsPage,
	head: () => ({
		meta: [{ title: "Terms of Service — InspoSnaps" }],
	}),
});

function TermsPage() {
	return (
		<div className="min-h-svh bg-background text-foreground">
			<LandingNav />

			<main className="mx-auto max-w-3xl px-4 pt-28 pb-16 md:px-6">
				<header>
					<h1 className="font-bold text-3xl tracking-tight">
						Terms of Service
					</h1>
					<p className="mt-2 text-muted-foreground text-sm">
						Last updated — February 24, 2026
					</p>
				</header>

				<div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/90">
					<p>
						By using InspoSnaps you confirm your acceptance of, and agree to be
						bound by, these terms and conditions.
					</p>

					<section>
						<h2 className="font-semibold text-lg">1. Using InspoSnaps</h2>
						<p className="mt-3">
							You must be at least 13 years old to use InspoSnaps. By creating
							an account you confirm that you meet this requirement. You're
							responsible for keeping your account credentials secure and for
							all activity that occurs under your account.
						</p>
					</section>

					<section>
						<h2 className="font-semibold text-lg">2. Your Content</h2>
						<p className="mt-3">
							You retain full ownership of the images and content you upload to
							InspoSnaps. By uploading content, you grant us a limited license
							to store, display, and serve that content as necessary to operate
							the service — for example, serving images to people you've shared
							a folder with.
						</p>
						<p className="mt-3">
							You are responsible for the content you upload. Don't upload
							anything you don't have the right to use, or content that is
							illegal, harmful, or violates the rights of others.
						</p>
					</section>

					<section>
						<h2 className="font-semibold text-lg">
							3. Sharing & Collaboration
						</h2>
						<p className="mt-3">
							When you share a folder via a link or invite another user, you
							control what content is visible. InspoSnaps is not responsible
							for how recipients use or redistribute content you choose to
							share.
						</p>
					</section>

					<section>
						<h2 className="font-semibold text-lg">4. Disclaimer</h2>
						<p className="mt-3">
							InspoSnaps is provided <strong>"as is"</strong> and{" "}
							<strong>"as available"</strong> without warranties of any kind,
							whether express or implied. We don't guarantee that the service
							will be uninterrupted, error-free, or meet your specific
							requirements.
						</p>
					</section>

					<section>
						<h2 className="font-semibold text-lg">
							5. Warranties & Limitation of Liability
						</h2>
						<p className="mt-3">
							InspoSnaps makes no guarantees as to the quality or fitness of
							the service. To the maximum extent permitted by law, InspoSnaps
							and its operators shall not be liable for any indirect,
							incidental, special, consequential, or punitive damages, or any
							loss of data, profits, or goodwill arising from your use of the
							service.
						</p>
					</section>

					<section>
						<h2 className="font-semibold text-lg">6. Termination</h2>
						<p className="mt-3">
							You may stop using InspoSnaps at any time. We reserve the right
							to suspend or terminate your account if you violate these terms
							or engage in activity that harms the service or other users. Upon
							termination, your right to use the service ceases immediately. We
							may delete your data in accordance with our{" "}
							<Link
								to="/privacy"
								className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
							>
								Privacy Policy
							</Link>
							.
						</p>
					</section>

					<section>
						<h2 className="font-semibold text-lg">
							7. Changes to These Terms
						</h2>
						<p className="mt-3">
							We may update these terms from time to time. Continued use of
							InspoSnaps after changes are posted constitutes acceptance of the
							revised terms.
						</p>
					</section>

					<p>
						If you have any questions about these terms, feel free to contact us
						at{" "}
						<a
							href="mailto:deckardgerritsen@gmail.com"
							className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
						>
							deckardgerritsen@gmail.com
						</a>
						.
					</p>

					<hr className="border-border/50" />

					<p className="text-muted-foreground text-sm">
						See also our{" "}
						<Link
							to="/privacy"
							className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
						>
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</main>

			<LandingFooter />
		</div>
	);
}
