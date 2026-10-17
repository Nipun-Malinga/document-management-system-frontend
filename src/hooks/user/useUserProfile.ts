import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import APIService from "@/services/apiService";
import {
	assertSession,
	getSession,
	useSessionStore,
} from "@/states/sessionStore";
import type {
	ChangePasswordRequest,
	UpdateProfileRequest,
	UserProfile,
} from "@/types/UserProfile";

const profileKey = (epoch: number) => ["my-profile", epoch] as const;

export const useUserProfile = (enabled: boolean) => {
	const epoch = useSessionStore((state) => state.epoch);
	return useQuery({
		queryKey: profileKey(epoch),
		queryFn: async ({ signal }) => {
			const profile = await new APIService<undefined, UserProfile>(
				"/users/me",
			).get({ signal, timeout: 15000 });
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
		enabled: enabled && Boolean(getSession().user),
		retry: false,
		refetchOnWindowFocus: false,
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
