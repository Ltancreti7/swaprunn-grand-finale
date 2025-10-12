import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ProfileCardProps {
	name: string;
	company: string;
	role: "dealer" | "driver" | "manager";
	email: string;
	memberSince: string;
}

export default function ProfileCard({
	name,
	company,
	role,
	email,
	memberSince,
}: ProfileCardProps) {
	const [uploading, setUploading] = useState(false);
	const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

	const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
		try {
			setUploading(true);
			if (!event.target.files || event.target.files.length === 0) {
				throw new Error("You must select an image to upload.");
			}

			const file = event.target.files[0];
			const fileExt = file.name.split(".").pop();
			const fileName = `${Date.now()}.${fileExt}`;
			const filePath = `${fileName}`;

			const { error: uploadError } = await supabase.storage
				.from("avatars")
				.upload(filePath, file);

			if (uploadError) throw uploadError;

			const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
			setAvatarUrl(data.publicUrl);
		} catch (error) {
			console.error("Error uploading avatar:", error);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="bg-neutral-900 text-white rounded-2xl p-6 flex flex-col items-center shadow-lg transition-all duration-300 transform hover:scale-[1.02] animate-fadeIn">
			<div className="relative w-32 h-32 mb-4">
				<img
					src={avatarUrl || "/placeholder.svg"}
					alt={`${name}'s avatar`}
					className="rounded-full object-cover w-32 h-32 border-2 border-neutral-700"
				/>
				<label className="absolute bottom-2 right-2 bg-red-600 hover:bg-red-700 p-2 rounded-full cursor-pointer" title="Upload avatar">
					{uploading ? (
						<span className="text-xs text-white">...</span>
					) : (
						<i className="fa-solid fa-camera text-white"></i>
					)}
					<input
						type="file"
						accept="image/*"
						onChange={uploadAvatar}
						aria-label="Upload avatar"
						className="hidden"
						disabled={uploading}
					/>
				</label>
			</div>

			<div className="text-center">
				<p className="text-xl font-bold">{name}</p>
				<p className="text-gray-400">{company}</p>
				<p className="text-red-500 font-semibold capitalize">{role}</p>
			</div>

			<div className="flex flex-col items-center text-gray-400 mt-4 space-y-1">
				<p>{email}</p>
				<p>Member since {memberSince}</p>
			</div>

			<button className="mt-6 w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-semibold transition">
				{role === "dealer"
					? "Request New Driver"
					: role === "driver"
					? "Accept New Job"
					: "Assign Driver"}
			</button>

			<button className="mt-3 w-full bg-white text-black hover:bg-gray-200 py-3 rounded-lg font-semibold transition">
				Edit Personal Info
			</button>
		</div>
	);
}
