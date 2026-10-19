import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ms from "ms";
import {
	assertSession,
	getSession,
	useSessionStore,
} from "@/features/auth/stores/sessionStore";
import type {
	ChangePasswordRequest,
	UpdateProfileRequest,
	UserProfile,
} from "@/features/users/schemas/UserProfile";
import APIService from "@/services/apiService";

const profileKey = (epoch: number) => ["profile", epoch] as const;

export const useUserProfile = () => {
	const epoch = useSessionStore((state) => state.epoch);

	const service = new APIService<undefined, UserProfile>("/users/me");
	const data = () => service.get();

	return useQuery({
		queryKey: profileKey(epoch),
		staleTime: ms("5m"),
		gcTime: ms("30m"),
		queryFn: async () => {
			const profile = await data();

			assertSession(epoch);

			if (profile.id !== getSession().user?.id)
				throw new Error("Profile identity changed.");
			useSessionStore.setState({
				user: {
					id: profile.id,
					username: profile.username,
					email: profile.email,
					role: profile.role,
				},
			});
			return profile;
		},
	});
};

export const useUpdateProfile = () => {
	const client = useQueryClient();
	return useMutation({
		retry: false,
		mutationFn: async (data: UpdateProfileRequest) => {
			const epoch = getSession().epoch;
			const profile = await new APIService<UpdateProfileRequest, UserProfile>(
				"/users/me",
			).put(data, { timeout: 15000 });
			assertSession(epoch);
			if (profile.id !== getSession().user?.id)
				throw new Error("Profile identity changed.");
			client.setQueryData(profileKey(epoch), profile);
			useSessionStore.setState({
				user: {
					id: profile.id,
					username: profile.username,
					email: profile.email,
					role: profile.role,
				},
			});
			void client.invalidateQueries({ queryKey: ["user-lookup"] });
			return profile;
		},
	});
};

export const useChangePassword = () =>
	useMutation({
		retry: false,
		mutationFn: (data: ChangePasswordRequest) =>
			new APIService<ChangePasswordRequest, void>("/users/me/password").put(
				data,
				{ timeout: 15000 },
			),
	});
