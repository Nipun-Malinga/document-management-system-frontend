import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const DarkThemeButton = () => {
	const [isDark, setIsDark] = useState(() => {
		const theme = localStorage.getItem("theme");
		if (theme === "dark" || theme === "light") return theme === "dark";
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	});

	useEffect(() => {
		document.documentElement.classList.toggle("dark", isDark);
		localStorage.setItem("theme", isDark ? "dark" : "light");
	}, [isDark]);

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
			title={isDark ? "Switch to light theme" : "Switch to dark theme"}
			onClick={() => setIsDark((prev) => !prev)}
		>
			{isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
		</Button>
	);
};

export default DarkThemeButton;
