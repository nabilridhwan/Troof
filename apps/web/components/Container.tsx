import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="w-[90%] mx-auto">
			<div>{children}</div>
		</div>
	);
};

export default Container;