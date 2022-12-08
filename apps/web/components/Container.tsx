/** @format */

import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="mx-auto w-[90%]">
			<div>{children}</div>
		</div>
	);
};

export default Container;
