/** @format */

import { getContrastYIQ, stringToColor } from "@troof/helpers";

interface ProfilePictureFromNameProps {
	name: string;
	size?: number;
}

const ProfilePictureFromName = ({
	name,
	size = 40,
}: ProfilePictureFromNameProps) => {
	const initials =
		name.split(" ").length < 2
			? name[0]
			: name
					.split(" ")
					.map((name) => name[0])
					.join("")
					.slice(0, 2);

	return (
		<div
			className="flex aspect-square h-7 w-7
        items-center justify-center rounded-full border border-white
        border-opacity-20 text-xs capitalize text-white"
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
