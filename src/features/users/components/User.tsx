const User = ({ username }: { username: string }) => (
	<span
		aria-hidden="true"
		className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground"
	>
		{username.charAt(0).toUpperCase()}
	</span>
);
export default User;
