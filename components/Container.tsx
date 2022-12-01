import React from "react";

const Container = ({ children }: { children: React.ReactNode }) => {
	return <div className="w-[90%] my-10 mx-auto">{children}</div>;
};

export default Container;
