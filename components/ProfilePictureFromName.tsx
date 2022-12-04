import { useState } from "react";
import getContrastYIQ from "../utils/getContrastYIQ";
import stringToColor from "../utils/stringToColor";

interface ProfilePictureFromNameProps {
	name: string;
	size?: number;
}

const ProfilePictureFromName = ({
	name,
	size = 40,
}: ProfilePictureFromNameProps) => {
	const [initials, setInitials] = useState<string>(
		name.split(" ").length < 2
			? name[0]
			: name
					.split(" ")
					.map((name) => name[0])
					.join("")
					.slice(0, 2)
	);

	return (
		<div
			className="rounded-full aspect-square w-7 h-7
        flex items-center justify-center text-white text-xs
        capitalize border border-white border-opacity-20"
			style={{
				backgroundColor: stringToColor(name),
				color: getContrastYIQ(stringToColor(name)),
			}}
		>
			{initials}
		</div>
	);
};

export default ProfilePictureFromName;
