import { HEADING_FONT, useCountUp } from "./shared";

function StatItem({
	target,
	suffix,
	label,
	decimals = 0,
}: {
	target: number;
	suffix: string;
	label: string;
	decimals?: number;
}) {
	const { ref, value } = useCountUp(target, decimals);

	const display = decimals
		? value.toFixed(decimals)
		: String(Math.round(value));

	return (
		<div ref={ref} className="text-center">
			<div
				className="text-3xl font-bold tracking-tight sm:text-4xl"
				style={HEADING_FONT}
			>
				{display}
				{suffix}
			</div>
			<p className="mt-1.5 text-[12px] font-medium text-muted-foreground">
				{label}
			</p>
		</div>
	);
}

export function StatsSection() {
	return (
		<section className="py-14 sm:py-20">
			<div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 px-5 sm:grid-cols-4 sm:px-8">
				<StatItem target={50} suffix="K+" label="Folders Created" />
				<StatItem target={1} suffix="M+" label="Images Organized" />
				<StatItem target={120} suffix="+" label="Countries" />
				<StatItem target={4.9} suffix=" ★" label="User Rating" decimals={1} />
			</div>
		</section>
	);
}
