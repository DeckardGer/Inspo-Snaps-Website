import { createFileRoute, Link } from "@tanstack/react-router";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNav } from "@/components/landing/NavBar";

export const Route = createFileRoute("/privacy")({
	component: PrivacyPage,
	head: () => ({
		meta: [
			{ title: "Privacy Policy — InspoSnaps" },
			{
				name: "description",
				content:
					"Learn how InspoSnaps collects, uses, and protects your personal information. We never sell your data or use it for advertising.",
			},
		],
	}),
});

function PrivacyPage() {
	return (
		<div className="min-h-svh bg-background text-foreground">
			<LandingNav />

			<main className="mx-auto max-w-3xl px-4 pt-28 pb-16 md:px-6">
				<header>
					<h1 className="font-bold text-3xl tracking-tight">Privacy Policy</h1>
					<p className="mt-2 text-muted-foreground text-sm">
						Last updated — February 24, 2026
					</p>
				</header>

				<div className="mt-10 space-y-8 text-[15px] leading-relaxed text-foreground/90">
					<p>
						Your privacy is important to us. It is InspoSnaps' policy to respect
						your privacy regarding any information we may collect from you
						across our website and service.
					</p>

					<p>
						We only ask for personal information when we truly need it to
						provide the service to you. We collect it by fair and lawful means,
						with your knowledge and consent. We also let you know why we're
						collecting it and how it will be used.
					</p>

					<section>
						<h2 className="font-semibold text-lg">What we collect</h2>
						<p className="mt-3">
							When you create an account we collect your name, email address,
							and a username. You can sign up with your Google account, in which
							case your name, email, and profile picture are used to pre-fill
							your account.
						</p>
						<p className="mt-3">
							Images you upload are stored on secure cloud servers. We store
							metadata about your images (filename, dimensions, file type) and
							your folder structure in our database.
						</p>
						<p className="mt-3">
							We collect basic technical data such as IP address and user agent
							when you sign in. This is used for session management and security
							— not for tracking or advertising.
						</p>
					</section>

					<section>
						<h2 className="font-semibold text-lg">How we use it</h2>
						<ul className="mt-3 list-disc space-y-1.5 pl-5 text-foreground/80">
							<li>Operate and maintain InspoSnaps</li>
							<li>Authenticate your account and manage sessions</li>
							<li>Enable sharing features you choose to use</li>
							<li>Send transactional emails (password resets, verification)</li>
						</ul>
						<p className="mt-3">
							We do <strong>not</strong> sell your personal information. We do{" "}
							<strong>not</strong> use your data for advertising.
						</p>
					</section>

					<section>
						<h2 className="font-semibold text-lg">Third parties</h2>
						<p className="mt-3">
							We don't share any personally identifying information publicly or
							with third parties, except when required to by law. We use
							third-party cloud providers to store data and process
							authentication — these providers only handle data as needed to
							deliver their services.
						</p>
						<p className="mt-3">
							When you create a share link or invite someone to a folder, the
							content in that folder becomes visible to the people you share it
							with.
						</p>
					</section>

					<section>
						<h2 className="font-semibold text-lg">Cookies</h2>
						<p className="mt-3">
							We use essential cookies to keep you signed in. Your theme
							preference is stored locally in your browser. We do not use
							tracking or third-party analytics cookies.
						</p>
					</section>

					<section>
						<h2 className="font-semibold text-lg">Data retention</h2>
						<p className="mt-3">
							We only retain collected information for as long as necessary to
							provide you with the service. What data we store, we protect
							within commercially acceptable means to prevent loss, theft, and
							unauthorized access. If you wish to have your data removed,
							contact us at the email below.
						</p>
					</section>

					<p>
						Our service may link to external sites that are not operated by us.
						We have no control over the content and practices of these sites and
						cannot accept responsibility for their privacy policies. InspoSnaps
						is not directed at children under 13.
					</p>

					<p>
						You are free to refuse our request for your personal information,
						with the understanding that we may be unable to provide you with
						some of your desired services.
					</p>

					<p>
						Your continued use of our website will be regarded as acceptance of
						our practices around privacy and personal information. If you have
						any questions about how we handle user data, feel free to contact us
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
							to="/terms"
							className="font-medium text-foreground underline underline-offset-4 transition-colors hover:text-foreground/80"
						>
							Terms of Service
						</Link>
						.
					</p>
				</div>
			</main>

			<LandingFooter />
		</div>
	);
}
