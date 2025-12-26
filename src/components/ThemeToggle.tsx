import {
	ComputerIcon,
	Moon02Icon,
	Sun03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/lib/ThemeProvider";

export function ThemeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button variant="outline" size="icon" className="transition-none">
						<HugeiconsIcon
							icon={Sun03Icon}
							strokeWidth={2}
							className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0"
						/>
						<HugeiconsIcon
							icon={Moon02Icon}
							strokeWidth={2}
							className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100"
						/>
						<span className="sr-only">Toggle theme</span>
					</Button>
				}
			/>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<HugeiconsIcon icon={Sun03Icon} className="size-4" strokeWidth={2} />
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<HugeiconsIcon icon={Moon02Icon} className="size-4" strokeWidth={2} />
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<HugeiconsIcon icon={ComputerIcon} className="size-4" strokeWidth={2} />
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
