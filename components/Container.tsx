import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-[90%] h-screen mx-auto flex items-center justify-center">
			<div>{children}</div>
		</div>
	);
};

export default Container;
